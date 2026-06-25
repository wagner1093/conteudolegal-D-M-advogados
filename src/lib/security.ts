import { supabase } from "./supabase";

/**
 * Security utilities for the Motores project.
 * Implements Rate Limiting, Audit Logging, and Upload Hardening.
 */

/**
 * Consumes a rate limit token for a given identifier.
 * Useful for login attempts, password resets, and other sensitive actions.
 * 
 * @param identifier Unique identifier for the rate limit (e.g., 'login:user@email.com' or 'ip:127.0.0.1')
 * @param maxRequests Maximum number of requests allowed in the window
 * @param windowSeconds Duration of the rate limit window in seconds
 * @returns Object with 'limited' (boolean) and 'retry_after_seconds' (number)
 */
export async function consumeRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowSeconds: number = 60
) {
  if (!supabase) return { limited: false, retry_after_seconds: 0 };

  const { data, error } = await supabase.rpc("consume_security_rate_limit", {
    p_identifier: identifier,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error("Rate limit error:", error);
    return { limited: false, retry_after_seconds: 0 };
  }

  return data as { limited: boolean; retry_after_seconds: number };
}

/**
 * Logs a security or administrative action to the audit_logs table.
 */
export async function logAudit(
  action: string,
  entityType: string,
  entityId?: string,
  delta?: any,
  metadata?: any
) {
  if (!supabase) return;

  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase.from("site_dm_advogados_audit_logs").insert({
    user_id: user?.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    delta,
    metadata: {
      ...metadata,
      user_agent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
      path: typeof window !== "undefined" ? window.location.pathname : "unknown",
    },
  });

  if (error) {
    console.error("Audit log error:", error);
  }
}

/**
 * Validates an audio file's magic bytes to ensure it matches its expected type.
 * Handles MP3, WAV, OGG and M4A formats.
 */
export async function validateAudioSignature(file: File): Promise<boolean> {
  const mpegTypes = ['audio/mpeg', 'audio/mp3', 'audio/x-mpeg', 'audio/x-mp3'];
  const wavTypes  = ['audio/wav', 'audio/wave', 'audio/x-wav'];
  const oggTypes  = ['audio/ogg', 'audio/x-ogg', 'audio/vorbis'];
  const m4aTypes  = ['audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/aac'];

  const allowedTypes = [...mpegTypes, ...wavTypes, ...oggTypes, ...m4aTypes];

  // Extensão como fallback quando o browser não reporta MIME type
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const extMpeg = ['mp3'].includes(ext);
  const extWav  = ['wav'].includes(ext);
  const extOgg  = ['ogg', 'oga'].includes(ext);
  const extM4a  = ['m4a', 'aac', 'mp4'].includes(ext);

  const isMpeg = mpegTypes.includes(file.type) || (file.type === '' && extMpeg);
  const isWav  = wavTypes.includes(file.type)  || (file.type === '' && extWav);
  const isOgg  = oggTypes.includes(file.type)  || (file.type === '' && extOgg);
  const isM4a  = m4aTypes.includes(file.type)  || (file.type === '' && extM4a);

  if (!allowedTypes.includes(file.type) && !extMpeg && !extWav && !extOgg && !extM4a) return false;

  const header = await new Promise<Uint8Array>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      resolve(new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 12));
    };
    reader.readAsArrayBuffer(file.slice(0, 12));
  });

  if (isMpeg) {
    // ID3 tag (ID3) ou MPEG frame sync (FF Ex / FF Fx onde x ≥ 0)
    return (header[0] === 0x49 && header[1] === 0x44 && header[2] === 0x33) ||
           (header[0] === 0xFF && (header[1] === 0xFB || header[1] === 0xFA ||
                                   header[1] === 0xF3 || header[1] === 0xF2 ||
                                   (header[1] & 0xE0) === 0xE0));
  }
  if (isWav) {
    // RIFF....WAVE
    return header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
           header[8] === 0x57 && header[9] === 0x41 && header[10] === 0x56 && header[11] === 0x45;
  }
  if (isOgg) {
    // OggS
    return header[0] === 0x4F && header[1] === 0x67 && header[2] === 0x67 && header[3] === 0x53;
  }
  if (isM4a) {
    // ftyp box at bytes 4-7
    return header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79 && header[7] === 0x70;
  }
  return false;
}

/**
 * Validates a file's magic bytes to ensure it matches its expected type.
 * Specifically handles common image types for upload hardening.
 */
export async function validateFileSignature(file: File): Promise<boolean> {
  // ICO files start with 00 00 01 00 — treated specially since they contain null bytes
  const icoTypes = ["image/x-icon", "image/vnd.microsoft.icon"];
  if (icoTypes.includes(file.type)) {
    // Validate ICO magic bytes: 00 00 01 00
    const header = await new Promise<Uint8Array>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        resolve(new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4));
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
    return header[0] === 0x00 && header[1] === 0x00 && header[2] === 0x01 && header[3] === 0x00;
  }

  const signatures: Record<string, number[]> = {
    "image/jpeg": [0xFF, 0xD8, 0xFF],
    "image/png": [0x89, 0x50, 0x4E, 0x47],
    "image/gif": [0x47, 0x49, 0x46, 0x38],
    "image/webp": [0x52, 0x49, 0x46, 0x46], // WebP has 'RIFF' header
    "image/svg+xml": [0x3C], // SVG starts with '<'
  };

  if (!signatures[file.type]) return false;

  const header = await new Promise<Uint8Array>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      resolve(new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4));
    };
    reader.readAsArrayBuffer(file.slice(0, 4));
  });

  const expected = signatures[file.type];
  return expected.every((byte, i) => header[i] === byte);
}
