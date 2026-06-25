'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const draggingRef = useRef(false);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remaining = duration - currentTime;

  // Conjunto de barras com alturas pseudo-aleatórias estáveis (estilo waveform)
  const BAR_COUNT = 56;
  const barHeights = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      // Padrão de onda suave combinado com variação pseudo-aleatória
      const wave = Math.sin(i * 0.45) * 0.5 + 0.5;
      const noise = Math.abs(Math.sin(i * 12.9898) * 43758.5453 % 1);
      arr.push(Math.round((wave * 0.55 + noise * 0.45) * 70 + 22));
    }
    return arr;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => { if (!draggingRef.current) setCurrentTime(audio.currentTime); };
    const onDurationChange = () => setDuration(audio.duration);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Detecta dispositivos sem hover (toque) para abrir o volume por toque
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  };

  const computeRatio = (clientX: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const seekToRatio = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const t = ratio * duration;
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const handleSeekPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!duration) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    draggingRef.current = true;
    setIsDragging(true);
    seekToRatio(computeRatio(e.clientX, e.currentTarget));
  };

  const handleSeekPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    seekToRatio(computeRatio(e.clientX, e.currentTarget));
  };

  const handleSeekPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
  };

  const toggleMute = () => setIsMuted((m) => !m);
  const effectiveVolume = isMuted ? 0 : volume;

  const VolumeIcon = () => {
    if (effectiveVolume === 0) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      );
    }
    if (effectiveVolume < 0.5) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
  };

  return (
    <div className="audio-player-card" style={{
      background: 'linear-gradient(135deg, #0b1220 0%, #1a2740 60%, #16243d 100%)',
      borderRadius: '22px',
      padding: '22px 28px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.28)',
      border: '1px solid rgba(255,255,255,0.06)',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Brilho de fundo */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        left: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(76,175,80,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: isPlaying ? 1 : 0.4,
        transition: 'opacity 0.4s ease'
      }} />

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="audio-player-row" style={{ display: 'flex', alignItems: 'center', gap: '22px', position: 'relative', zIndex: 1, minWidth: 0 }}>
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          className="audio-player-playbtn"
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'var(--accent, #4caf50)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: isPlaying
              ? '0 0 0 6px rgba(76,175,80,0.18), 0 6px 20px rgba(76,175,80,0.5)'
              : '0 4px 16px rgba(76,175,80,0.45)',
            transition: 'transform 0.1s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.07)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.93)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.07)'; }}
        >
          {isPlaying ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <rect x="5" y="4" width="5" height="16" rx="1" />
              <rect x="14" y="4" width="5" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '3px' }}>
              <polygon points="5,3 20,12 5,21" />
            </svg>
          )}
        </button>

        {/* Center: title + waveform visualizer + progress */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{
              color: 'rgba(255,255,255,0.92)',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              minWidth: 0
            }}>
              {title || 'Áudio do Artigo'}
            </span>
            <span style={{ display: 'flex', gap: '5px', color: 'rgba(255,255,255,0.45)', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.88)' }}>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </span>
          </div>

          {/* Waveform visualizer com seek por arraste */}
          <div
            ref={progressRef}
            onPointerDown={handleSeekPointerDown}
            onPointerMove={handleSeekPointerMove}
            onPointerUp={handleSeekPointerUp}
            onPointerCancel={handleSeekPointerUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              height: '44px',
              cursor: 'pointer',
              position: 'relative',
              touchAction: 'none'
            }}
          >
            {barHeights.map((h, i) => {
              const barPos = (i / BAR_COUNT) * 100;
              const played = barPos <= progress;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    borderRadius: '2px',
                    height: `${h}%`,
                    background: played
                      ? 'linear-gradient(180deg, #6ee06f 0%, #4caf50 100%)'
                      : 'rgba(255,255,255,0.16)',
                    boxShadow: played ? '0 0 6px rgba(76,175,80,0.5)' : 'none',
                    transformOrigin: 'center',
                    animation: isPlaying && played
                      ? `wf${(i % 5) + 1} ${0.7 + (i % 4) * 0.18}s ease-in-out infinite alternate`
                      : 'none',
                    transition: 'background 0.15s ease, box-shadow 0.15s ease'
                  }}
                />
              );
            })}
          </div>

          {/* Linha de progresso fina (arrastavel) + volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              onPointerDown={handleSeekPointerDown}
              onPointerMove={handleSeekPointerMove}
              onPointerUp={handleSeekPointerUp}
              onPointerCancel={handleSeekPointerUp}
              style={{
                flex: 1,
                paddingTop: '9px',
                paddingBottom: '9px',
                cursor: 'pointer',
                position: 'relative',
                touchAction: 'none'
              }}
            >
              <div style={{
                height: isDragging ? '6px' : '4px',
                borderRadius: '3px',
                background: 'rgba(255,255,255,0.12)',
                position: 'relative',
                transition: 'height 0.12s ease'
              }}>
                <div style={{
                  height: '100%',
                  borderRadius: '3px',
                  background: 'var(--accent, #4caf50)',
                  width: `${progress}%`,
                  transition: isDragging ? 'none' : 'width 0.1s linear',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    right: isDragging ? '-8px' : '-6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: isDragging ? '16px' : '12px',
                    height: isDragging ? '16px' : '12px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: isDragging
                      ? '0 0 0 5px rgba(76,175,80,0.25), 0 0 6px rgba(76,175,80,0.9)'
                      : '0 0 5px rgba(76,175,80,0.9)',
                    transition: 'width 0.12s ease, height 0.12s ease, box-shadow 0.12s ease',
                    pointerEvents: 'none'
                  }} />
                </div>
              </div>
            </div>

            {/* Controle de volume */}
            <div
              onMouseEnter={() => { if (!isTouch) setShowVolume(true); }}
              onMouseLeave={() => { if (!isTouch) setShowVolume(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
            >
              <button
                onClick={() => { if (isTouch) { setShowVolume((s) => !s); } else { toggleMute(); } }}
                aria-label={isTouch ? 'Ajustar volume' : (isMuted ? 'Ativar som' : 'Silenciar')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: showVolume ? '#fff' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  margin: '-4px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { if (!showVolume) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              >
                <VolumeIcon />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={effectiveVolume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="audio-volume-slider"
                style={{
                  width: showVolume ? '72px' : '0px',
                  opacity: showVolume ? 1 : 0,
                  transition: 'width 0.25s ease, opacity 0.2s ease',
                  // @ts-ignore - custom prop usada no CSS abaixo
                  '--vol': `${effectiveVolume * 100}%`
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Tempo restante */}
          {duration > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '11px', fontFamily: 'monospace' }}>
                -{formatTime(remaining)} restante
              </span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes wf1 { from { transform: scaleY(0.55); } to { transform: scaleY(1.18); } }
        @keyframes wf2 { from { transform: scaleY(0.85); } to { transform: scaleY(1.35); } }
        @keyframes wf3 { from { transform: scaleY(1.1); } to { transform: scaleY(0.5); } }
        @keyframes wf4 { from { transform: scaleY(0.65); } to { transform: scaleY(1.25); } }
        @keyframes wf5 { from { transform: scaleY(1.0); } to { transform: scaleY(0.62); } }

        .audio-volume-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(to right,
            var(--accent, #4caf50) 0%,
            var(--accent, #4caf50) var(--vol),
            rgba(255,255,255,0.18) var(--vol),
            rgba(255,255,255,0.18) 100%);
        }
        .audio-volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
          cursor: pointer;
        }
        .audio-volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border: none;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
          cursor: pointer;
        }

        @media (pointer: coarse) {
          .audio-volume-slider {
            height: 6px;
          }
          .audio-volume-slider::-webkit-slider-thumb {
            width: 18px;
            height: 18px;
          }
          .audio-volume-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
          }
        }

        @media (max-width: 600px) {
          .audio-player-card {
            padding: 16px 16px !important;
            border-radius: 18px !important;
          }
          .audio-player-row {
            gap: 14px !important;
          }
          .audio-player-playbtn {
            width: 48px !important;
            height: 48px !important;
          }
        }
        @media (max-width: 400px) {
          .audio-player-card {
            padding: 14px 12px !important;
          }
          .audio-player-row {
            gap: 10px !important;
          }
          .audio-player-playbtn {
            width: 44px !important;
            height: 44px !important;
          }
        }
      `}</style>
    </div>
  );
}
