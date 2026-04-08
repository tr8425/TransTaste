"use client";

import { FlavorProfile } from "@/lib/types";
import { FLAVOR_AXES } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

interface FlavorRadarProps {
  profile: FlavorProfile;
  size?: number;
}

const MAX_SCORE = 5;
const RINGS = [1, 3, 5];

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleIndex: number,
  totalAxes: number
): [number, number] {
  const angle = (Math.PI * 2 * angleIndex) / totalAxes - Math.PI / 2;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

export default function FlavorRadar({ profile, size = 120 }: FlavorRadarProps) {
  const { t } = useTranslation();
  const padding = 24;
  const svgSize = size + padding * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = size / 2;
  const axes = FLAVOR_AXES;

  // Grid ring polygons
  const ringPaths = RINGS.map((ringScore) => {
    const r = (ringScore / MAX_SCORE) * radius;
    const points = axes
      .map((_, i) => polarToCartesian(cx, cy, r, i, axes.length))
      .map(([x, y]) => `${x},${y}`)
      .join(" ");
    return points;
  });

  // Data polygon
  const dataPoints = axes.map((axis, i) => {
    const score = profile[axis as keyof FlavorProfile] || 0;
    const r = (score / MAX_SCORE) * radius;
    return polarToCartesian(cx, cy, r, i, axes.length);
  });
  const dataPath = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  // Axis labels
  const labelPositions = axes.map((axis, i) => {
    const [x, y] = polarToCartesian(cx, cy, radius + 14, i, axes.length);
    return { axis, x, y, label: t(`flavor.${axis}`) };
  });

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      role="img"
      aria-label={`Flavor profile: ${axes
        .map((a) => `${t(`flavor.${a}`)} ${profile[a as keyof FlavorProfile]}`)
        .join(", ")}`}
    >
      <title>Flavor Radar Chart</title>

      {/* Grid rings */}
      {ringPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#E5E0D8"
          strokeWidth={0.5}
        />
      ))}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const [x, y] = polarToCartesian(cx, cy, radius, i, axes.length);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#E5E0D8"
            strokeWidth={0.5}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPath}
        fill="rgba(216, 90, 48, 0.25)"
        stroke="#D85A30"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5} fill="#D85A30" />
      ))}

      {/* Axis labels */}
      {labelPositions.map(({ axis, x, y, label }) => (
        <text
          key={axis}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-brown-medium"
          style={{ fontSize: "9px", fontFamily: "Inter, sans-serif" }}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
