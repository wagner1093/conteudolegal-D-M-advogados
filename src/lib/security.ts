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
