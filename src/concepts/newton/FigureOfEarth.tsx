import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 220;
const CX = W / 2;
const CY = H / 2 - 5;

const BASE_R = 70; // radius at omega=0 (sphere)
const MAX_A_DELTA = 25; // extra equatorial px at max omega
const MAX_B_DELTA = 20; // reduction in polar px at max omega

// Real Earth values
const R_EQUATORIAL_KM = 6378;
const R_POLAR_KM = 6357;

// Simple land patch polygons (normalised -1..1 on unit circle, stretched to ellipse)
const LAND_PATCHES: { cx: number; cy: number; rx: number; ry: number; rot: number }[] = [
  { cx: 0.05, cy: -0.25, rx: 0.22, ry: 0.18, rot: 0.3 },   // northern landmass
  { cx: 0.1, cy: 0.35, rx: 0.18, ry: 0.14, rot: -0.4 },     // southern landmass
  { cx: -0.35, cy: -0.1, rx: 0.15, ry: 0.22, rot: 0.6 },    // western landmass
  { cx: 0.38, cy: 0.1, rx: 0.10, ry: 0.15, rot: -0.2 },     // eastern landmass
  { cx: -0.15, cy: 0.5, rx: 0.12, ry: 0.09, rot: 0.1 },     // southern patch
];

const FigureOfEarth = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const rotAngleRef = useRef<number>(0);
  const omegaRef = useRef<number>(1);

  const [omegaMult, setOmegaMult] = useState<number>(1);

  useEffect(() => {
    omegaRef.current = omegaMult;
  }, [omegaMult]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const omega = omegaRef.current;
    const omegaMax = 5;

    // Advance rotation angle (visual spin)
    rotAngleRef.current += 0.004 * omega;
    const rotAngle = rotAngleRef.current;

    // Ellipse axes
    const a = BASE_R + MAX_A_DELTA * (omega / omegaMax); // equatorial (semi-major)
    const b = BASE_R - MAX_B_DELTA * (omega / omegaMax); // polar (semi-minor)

    // Flattening
    const f = (a - b) / a;
    const fRatio = f > 0.0001 ? Math.round(1 / f) : 99999;

    // Scaled radii labels
    const equatKm = R_EQUATORIAL_KM + (R_EQUATORIAL_KM - R_POLAR_KM) * (omega / 1) * (omega / omegaMax * omegaMax);
    const polarKm = R_POLAR_KM - (R_EQUATORIAL_KM - R_POLAR_KM) * (omega / 1) * (omega / omegaMax * omegaMax);
    // Simpler: linear interpolation based on visual axes
    const axisRatio = a / BASE_R;
    const displayEquat = Math.round(6371 * axisRatio);
    const displayPolar = Math.round(6371 * (b / BASE_R));

    // Suppress unused variable warning
    void equatKm; void polarKm;

    // --- Render ---
    ctx.clearRect(0, 0, W, H);

    // Space background
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, W, H);

    // Stars
    const stars = [
      [12, 18], [48, 8], [230, 15], [258, 45], [272, 190],
      [8, 160], [35, 210], [155, 215], [248, 208], [268, 95],
      [85, 6], [195, 5], [265, 140], [140, 10], [20, 100],
      [260, 70], [18, 65], [275, 160],
    ];
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (const [sx, sy] of stars) {
      ctx.beginPath();
      ctx.arc(sx, sy, 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Earth glow
    const glowR = Math.max(a, b) + 14;
    const glowGrad = ctx.createRadialGradient(CX, CY, Math.max(a, b) - 4, CX, CY, glowR);
    glowGrad.addColorStop(0, 'rgba(37,99,235,0.22)');
    glowGrad.addColorStop(1, 'rgba(37,99,235,0)');
    ctx.beginPath();
    ctx.ellipse(CX, CY, a + 14, b + 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Earth ocean fill
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(CX, CY, a, b, 0, 0, Math.PI * 2);
    ctx.clip();

    const oceanGrad = ctx.createRadialGradient(CX - a * 0.3, CY - b * 0.3, 0, CX, CY, a);
    oceanGrad.addColorStop(0, '#3b82f6');
    oceanGrad.addColorStop(0.4, '#2563eb');
    oceanGrad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(CX - a - 2, CY - b - 2, (a + 2) * 2, (b + 2) * 2);

    // Land patches (rotate with Earth)
    for (const patch of LAND_PATCHES) {
      const lx = CX + (patch.cx * Math.cos(rotAngle) - patch.cy * Math.sin(rotAngle)) * a;
      const ly = CY + (patch.cx * Math.sin(rotAngle) + patch.cy * Math.cos(rotAngle)) * b;
      // Only draw if on "front" hemisphere (crude z-check)
      const normDepth = patch.cx * Math.cos(rotAngle) + patch.cy * Math.sin(rotAngle);
      if (normDepth > -0.3) {
        const alpha = Math.min(1, 0.6 + normDepth * 0.5);
        ctx.beginPath();
        ctx.ellipse(lx, ly, patch.rx * a, patch.ry * b, patch.rot + rotAngle * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(22,163,74,${alpha})`;
        ctx.fill();
        // Land highlight
        ctx.beginPath();
        ctx.ellipse(lx - patch.rx * a * 0.2, ly - patch.ry * b * 0.2, patch.rx * a * 0.5, patch.ry * b * 0.4, patch.rot, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,222,128,${alpha * 0.3})`;
        ctx.fill();
      }
    }

    // Ice caps
    const iceLat = 0.82;
    ctx.beginPath();
    ctx.ellipse(CX, CY - b * iceLat, a * 0.38, b * 0.14, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(224,242,254,0.7)';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(CX, CY + b * iceLat, a * 0.32, b * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(224,242,254,0.65)';
    ctx.fill();

    ctx.restore(); // end clip

    // Earth border
    ctx.beginPath();
    ctx.ellipse(CX, CY, a, b, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(147,197,253,0.5)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // --- Latitude lines ---
    const latLines = [-0.6, -0.35, 0, 0.35, 0.6];
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.7;
    for (const lat of latLines) {
      const yOff = lat * b;
      const xScale = Math.sqrt(Math.max(0, 1 - lat * lat));
      ctx.beginPath();
      ctx.ellipse(CX, CY + yOff, a * xScale, b * 0.09 * xScale, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Equatorial line (highlighted, dashed)
    ctx.beginPath();
    ctx.ellipse(CX, CY, a, b * 0.09, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(251,191,36,0.55)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- Dimension arrows ---
    // Equatorial radius arrow (horizontal)
    const arrowColor = 'rgba(251,191,36,0.8)';
    ctx.strokeStyle = arrowColor;
    ctx.fillStyle = arrowColor;
    ctx.lineWidth = 1.2;
    // right arrow from center to equatorial edge
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.lineTo(CX + a - 2, CY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CX + a, CY);
    ctx.lineTo(CX + a - 6, CY - 3);
    ctx.lineTo(CX + a - 6, CY + 3);
    ctx.closePath();
    ctx.fill();

    // Polar radius arrow (vertical)
    ctx.strokeStyle = 'rgba(167,243,208,0.8)';
    ctx.fillStyle = 'rgba(167,243,208,0.8)';
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.lineTo(CX, CY - b + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CX, CY - b);
    ctx.lineTo(CX - 3, CY - b + 6);
    ctx.lineTo(CX + 3, CY - b + 6);
    ctx.closePath();
    ctx.fill();

    // --- Centrifugal force arrow at equator ---
    if (omega > 0.1) {
      const arrowLen = 12 + omega * 4;
      ctx.strokeStyle = 'rgba(239,68,68,0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(CX + a, CY);
      ctx.lineTo(CX + a + arrowLen, CY);
      ctx.stroke();
      // arrowhead
      ctx.fillStyle = 'rgba(239,68,68,0.75)';
      ctx.beginPath();
      ctx.moveTo(CX + a + arrowLen + 5, CY);
      ctx.lineTo(CX + a + arrowLen - 2, CY - 3);
      ctx.lineTo(CX + a + arrowLen - 2, CY + 3);
      ctx.closePath();
      ctx.fill();
      // label
      ctx.font = '7px sans-serif';
      ctx.fillStyle = 'rgba(239,68,68,0.7)';
      ctx.textAlign = 'left';
      ctx.fillText('F_c', CX + a + arrowLen + 7, CY + 3);

      // Gravity arrow (pointing inward from surface)
      ctx.strokeStyle = 'rgba(147,197,253,0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(CX + a + 18, CY + 18);
      ctx.lineTo(CX + a - 4, CY + 4);
      ctx.stroke();
      ctx.fillStyle = 'rgba(147,197,253,0.65)';
      ctx.beginPath();
      ctx.moveTo(CX + a - 6, CY + 2);
      ctx.lineTo(CX + a + 2, CY - 2);
      ctx.lineTo(CX + a, CY + 8);
      ctx.closePath();
      ctx.fill();
      ctx.font = '7px sans-serif';
      ctx.fillStyle = 'rgba(147,197,253,0.65)';
      ctx.fillText('g', CX + a + 20, CY + 26);
    }

    // --- Dimension labels ---
    ctx.textAlign = 'left';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillStyle = 'rgba(251,191,36,0.85)';
    ctx.fillText(`Eq: ${displayEquat.toLocaleString()} km`, 5, H - 28);
    ctx.fillStyle = 'rgba(167,243,208,0.85)';
    ctx.fillText(`Polar: ${displayPolar.toLocaleString()} km`, 5, H - 18);

    // Flattening label (top left)
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = 'rgba(251,191,36,0.9)';
    ctx.fillText(`f = 1/${fRatio}`, 6, 16);

    // Real Earth annotation
    if (Math.abs(omega - 1) < 0.05) {
      ctx.font = '7px sans-serif';
      ctx.fillStyle = 'rgba(74,222,128,0.7)';
      ctx.fillText('Real Earth: f = 1/298', 6, 26);
    }

    // Omega label (top right)
    ctx.textAlign = 'right';
    ctx.font = '8px sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.55)';
    ctx.fillText(`\u03c9 = ${omega.toFixed(1)}\u00d7`, W - 5, 14);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  const omega = omegaMult;
  const omegaMax = 5;
  const a = BASE_R + MAX_A_DELTA * (omega / omegaMax);
  const b = BASE_R - MAX_B_DELTA * (omega / omegaMax);
  const f = (a - b) / a;
  const fDisplay = f > 0.0001 ? `1/${Math.round(1 / f)}` : '0 (sphere)';

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          background: '#060a14',
          border: '1px solid #2563eb30',
          borderRadius: '8px',
          display: 'block',
        }}
      />

      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        {/* Omega slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: '#94a3b8', fontSize: '11px' }}>Rotation speed</label>
            <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 700 }}>
              {omega.toFixed(1)}&times; Earth
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.05}
            value={omegaMult}
            onChange={e => setOmegaMult(parseFloat(e.target.value))}
            style={{ accentColor: '#f59e0b', width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#475569', fontSize: '10px' }}>0 (sphere)</span>
            <span style={{ color: Math.abs(omega - 1) < 0.1 ? '#4ade80' : '#475569', fontSize: '10px' }}>
              {Math.abs(omega - 1) < 0.1 ? '← Real Earth' : '1×'}
            </span>
            <span style={{ color: '#475569', fontSize: '10px' }}>5×</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '5px',
        }}>
          <div style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid #f59e0b25',
            borderRadius: '5px',
            padding: '4px 6px',
          }}>
            <div style={{ color: '#64748b', fontSize: '8px' }}>Equatorial</div>
            <div style={{ color: '#fbbf24', fontSize: '10px', fontWeight: 700 }}>
              {Math.round(6371 * (a / BASE_R)).toLocaleString()} km
            </div>
          </div>
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid #16a34a25',
            borderRadius: '5px',
            padding: '4px 6px',
          }}>
            <div style={{ color: '#64748b', fontSize: '8px' }}>Polar</div>
            <div style={{ color: '#86efac', fontSize: '10px', fontWeight: 700 }}>
              {Math.round(6371 * (b / BASE_R)).toLocaleString()} km
            </div>
          </div>
          <div style={{
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid #2563eb25',
            borderRadius: '5px',
            padding: '4px 6px',
          }}>
            <div style={{ color: '#64748b', fontSize: '8px' }}>Flattening</div>
            <div style={{ color: '#93c5fd', fontSize: '10px', fontWeight: 700 }}>f = {fDisplay}</div>
          </div>
        </div>
      </div>

      <p style={{ color: '#64748b', fontSize: '10px', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6 }}>
        Newton: centrifugal force at equator &gt; at poles &rarr; Earth bulges. Confirmed by 1735 French expedition.
      </p>
    </div>
  );
};

export default FigureOfEarth;
