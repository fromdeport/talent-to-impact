import { usePlatform } from '../context/PlatformContext';
import { TALENT_DOMAINS } from '../data/defaultQuestions';
import type { TalentDomainKey } from '../types/platform';

interface TalentRadarChartProps {
  scores: Record<TalentDomainKey, number>;
  labels: Record<TalentDomainKey, { label: string; short: string }>;
}

export function TalentRadarChart({ scores, labels }: TalentRadarChartProps) {
  const { theme } = usePlatform();
  const isLight = theme === 'light';

  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = 112;
  const rings = [20, 40, 60, 80, 100];

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / TALENT_DOMAINS.length - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, value)) / 100) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const dataPoints = TALENT_DOMAINS.map((domain, idx) => getPoint(idx, scores[domain] ?? 0));
  const polygonPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const gridStroke = isLight ? 'rgba(21, 112, 212, 0.22)' : 'rgba(148, 174, 240, 0.18)';
  const polyStroke = isLight ? '#1570D4' : '#D4FF00';
  const nodeFill = isLight ? '#FFFFFF' : '#090E23';
  const nodeStroke = isLight ? '#1570D4' : '#8FD3FF';
  const titleColor = isLight ? '#0B1A36' : '#F4F7FF';
  const scoreColor = isLight ? '#1570D4' : '#D4FF00';

  return (
    <div className="w-full flex items-center justify-center px-3 sm:px-0">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[270px] sm:max-w-[340px] h-auto overflow-visible"
        role="img"
        aria-label="TALENT MAP radar profile"
      >
        <defs>
          <linearGradient id="talentRadarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#1570D4' : '#D4FF00'} stopOpacity="0.28" />
            <stop offset="100%" stopColor={isLight ? '#64B5F6' : '#8FD3FF'} stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {rings.map((ring) => {
          const pts = TALENT_DOMAINS.map((_, idx) => {
            const p = getPoint(idx, ring);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          }).join(' ');
          return (
            <polygon
              key={ring}
              points={pts}
              fill="none"
              stroke={gridStroke}
              strokeWidth="1"
            />
          );
        })}

        {TALENT_DOMAINS.map((domain, idx) => {
          const end = getPoint(idx, 100);
          return (
            <line
              key={domain}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke={gridStroke}
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={polygonPath}
          fill="url(#talentRadarFill)"
          stroke={polyStroke}
          strokeWidth="1.8"
        />

        {TALENT_DOMAINS.map((domain, idx) => {
          const pt = dataPoints[idx];
          const labelPt = getPoint(idx, 124);
          const score = scores[domain] ?? 0;
          return (
            <g key={domain}>
              <rect
                x={pt.x - 3.5}
                y={pt.y - 3.5}
                width="7"
                height="7"
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth="1.6"
              />
              <text
                x={labelPt.x}
                y={labelPt.y - 4}
                textAnchor="middle"
                fill={titleColor}
                fontSize="11"
                fontFamily="Onest, sans-serif"
                fontWeight="600"
              >
                {labels[domain].short}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 11}
                textAnchor="middle"
                fill={scoreColor}
                fontSize="10.5"
                fontFamily="'Momo Trust Sans', 'Onest', sans-serif"
                fontWeight="600"
              >
                {score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
