import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 180;

// Reference speeds at T0 = 293 K (20°C)
const V_NEWTON_0 = 290; // m/s — isothermal sqrt(P/rho)
const V_LAPLACE_0 = 343; // m/s — adiabatic sqrt(gamma*P/rho), gamma=1.4

// Visual wave parameters
const NEWTON_AMP = 16;
const LAPLACE_AMP = 22;
const NEWTON_WAVE_SPEED = 1.6; // px per frame
const LAPLACE_WAVE_SPEED = NEWTON_WAVE_SPEED * (V_LAPLACE_0 / V_NEWTON_0); // ~1.89

const SpeedOfSound = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseNRef = useRef<number>(0); // Newton wave phase
  const phaseLRef = useRef<number>(0); // Laplace wave phase
  const tempCRef = useRef<number>(20);

  const [tempC, setTempC] = useState<number>(20);

  useEffect(() => {
    tempCRef.current = tempC;
  }, [tempC]);

  const getSpeeds = useCallback((tc: number) => {
    const T = tc + 273.15;
    const T0 = 293;
    const factor = Math.sqrt(T / T0);
    return {
      newton: V_NEWTON_0 * factor,
      laplace: V_LAPLACE_0 * factor,
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tc = tempCRef.current;
    const T = tc + 273.15;
    const T0 = 293;
    const tempFactor = Math.sqrt(T / T0);

    // Advance phases (speed scaled by temperature)
    phaseNRef.current += NEWTON_WAVE_SPEED * tempFactor;
    phaseLRef.current += LAPLACE_WAVE_SPEED * tempFactor;

    const { newton: vN, laplace: vL } = getSpeeds(tc);

    // --- Render ---
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let y = 20; y < H; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const midN = H * 0.38; // Newton wave centre y
    const midL = H * 0.68; // Laplace wave centre y

    // Wave wavelengths (Laplace = longer = faster)
    const lambdaN = 38;
    const lambdaL = lambdaN * (V_LAPLACE_0 / V_NEWTON_0); // ~45

    // --- Newton wave ---
    ctx.save();
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let x = 0; x <= W; x++) {
      const phase = (x - phaseNRef.current) * (2 * Math.PI / lambdaN);
      const y = midN + Math.sin(phase) * NEWTON_AMP;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Newton wave label
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.textAlign = 'left';
    ctx.fillText('Newton (1687)', 5, midN - NEWTON_AMP - 5);

    // Newton speed badge
    ctx.fillStyle = 'rgba(59,130,246,0.18)';
    ctx.beginPath();
    ctx.roundRect(5, midN + NEWTON_AMP + 3, 82, 16, 3);
    ctx.fill();
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`${vN.toFixed(0)} m/s`, 8, midN + NEWTON_AMP + 14);

    // Error badge
    ctx.fillStyle = 'rgba(239,68,68,0.2)';
    ctx.beginPath();
    ctx.roundRect(92, midN + NEWTON_AMP + 3, 54, 16, 3);
    ctx.fill();
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('Error = 18%', 95, midN + NEWTON_AMP + 14);

    // --- Laplace wave ---
    ctx.save();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let x = 0; x <= W; x++) {
      const phase = (x - phaseLRef.current) * (2 * Math.PI / lambdaL);
      const y = midL + Math.sin(phase) * LAPLACE_AMP;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Laplace wave label
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'left';
    ctx.fillText('Laplace (1816)', 5, midL - LAPLACE_AMP - 5);

    // Laplace speed badge
    ctx.fillStyle = 'rgba(245,158,11,0.15)';
    ctx.beginPath();
    ctx.roundRect(5, midL + LAPLACE_AMP + 3, 82, 16, 3);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`${vL.toFixed(0)} m/s`, 8, midL + LAPLACE_AMP + 14);

    // Correct badge
    ctx.fillStyle = 'rgba(34,197,94,0.2)';
    ctx.beginPath();
    ctx.roundRect(92, midL + LAPLACE_AMP + 3, 54, 16, 3);
    ctx.fill();
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('\u2713 Correct', 95, midL + LAPLACE_AMP + 14);

    // --- Wavefront position marker (right side) ---
    // After 1 second, Laplace wave is (vL - vN) metres ahead.
    // Show as a vertical gap between the two wave fronts (on right edge).
    const gapPx = Math.min(((vL - vN) / vL) * 40, 38); // visual indicator only
    const markerX = W - 18;

    ctx.strokeStyle = 'rgba(148,163,184,0.3)';
    ctx.setLineDash([2, 3]);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(markerX, midN);
    ctx.lineTo(markerX, midL - gapPx / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow top
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(markerX, midN - 4);
    ctx.lineTo(markerX - 3, midN + 4);
    ctx.lineTo(markerX + 3, midN + 4);
    ctx.closePath();
    ctx.fill();

    // Arrow bottom
    ctx.beginPath();
    ctx.moveTo(markerX, midL - gapPx / 2 + 4);
    ctx.lineTo(markerX - 3, midL - gapPx / 2 - 4);
    ctx.lineTo(markerX + 3, midL - gapPx / 2 - 4);
    ctx.closePath();
    ctx.fill();

    // Gap label
    ctx.save();
    ctx.translate(markerX + 6, (midN + midL - gapPx / 2) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '7px sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText(`+${(vL - vN).toFixed(0)} m/s`, 0, 0);
    ctx.restore();

    // Temperature indicator (top right)
    ctx.textAlign = 'right';
    ctx.font = '8px sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.fillText(`T = ${tc > 0 ? '+' : ''}${tc}°C`, W - 5, 13);

    rafRef.current = requestAnimationFrame(draw);
  }, [getSpeeds]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  const { newton: vN, laplace: vL } = getSpeeds(tempC);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          background: '#0d1117',
          border: '1px solid #f59e0b25',
          borderRadius: '8px',
          display: 'block',
        }}
      />

      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        {/* Temperature slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: '#94a3b8', fontSize: '11px' }}>Temperature</label>
            <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 700 }}>
              {tempC > 0 ? '+' : ''}{tempC}°C
            </span>
          </div>
          <input
            type="range"
            min={-40}
            max={40}
            step={1}
            value={tempC}
            onChange={e => setTempC(parseInt(e.target.value))}
            style={{ accentColor: '#f59e0b', width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#475569', fontSize: '10px' }}>-40°C</span>
            <span style={{ color: '#475569', fontSize: '10px' }}>+40°C</span>
          </div>
        </div>

        {/* Speed comparison row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
        }}>
          <div style={{
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid #3b82f630',
            borderRadius: '6px',
            padding: '5px 8px',
          }}>
            <div style={{ color: '#64748b', fontSize: '9px' }}>Newton</div>
            <div style={{ color: '#93c5fd', fontSize: '12px', fontWeight: 700 }}>{vN.toFixed(0)} m/s</div>
            <div style={{ color: '#ef4444', fontSize: '9px' }}>18% error</div>
          </div>
          <div style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid #f59e0b30',
            borderRadius: '6px',
            padding: '5px 8px',
          }}>
            <div style={{ color: '#64748b', fontSize: '9px' }}>Laplace</div>
            <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700 }}>{vL.toFixed(0)} m/s</div>
            <div style={{ color: '#4ade80', fontSize: '9px' }}>Factor = \u221a\u03b3 = 1.18</div>
          </div>
        </div>
      </div>

      <p style={{ color: '#64748b', fontSize: '10px', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6 }}>
        Newton assumed isothermal compression. Laplace: sound is too fast for heat to escape &rarr; adiabatic. Factor = &radic;&gamma; = 1.18
      </p>
    </div>
  );
};

export default SpeedOfSound;
