import { memo, useMemo } from "react";
import { CharacterLocationData, useDataPointsStore } from "../../stores";
import { useBidiHighlight } from "../../hooks/useBidiHighlight";
import { getChapterList, isBehindGlobe, updateBoundingBox } from "../utils";
import { DragonColors, DragonWeakColors } from "./DragonStatics";
import * as d3 from "d3";
import {
  reduceCharInPoints,
  offsetSinglePathSegment,
  dealWithComplexPaths,
  createPathStringFromCoords,
} from "../characterjourneys/CharacterParts";

export const DragonVisualisation = memo(
  ({ projection, path }: { projection: d3.GeoProjection; path: any }) => {
    const locationData = useDataPointsStore((s) => s.dragonLocationData);

    const CharacterCirclePoints = locationData.filter(
      (p) => p.type === "point"
    );
    const CharacterCirclePaths = locationData.filter((p) => p.type === "path");

    return (
      <g>
        <DragonPaths charPoints={CharacterCirclePaths} path={path} />
        <DragonCircles
          charPoints={CharacterCirclePoints}
          projection={projection}
        />
      </g>
    );
  }
);

function DragonPaths({
  charPoints,
  path,
}: {
  charPoints: CharacterLocationData[];
  path: any;
}) {
  const singleCharPoints = reduceCharInPoints(charPoints);

  return singleCharPoints.map((pathEntry, index) => {
    let positions: number[][] = [];
    for (let i = 0; i < pathEntry.coords.length; i += 2) {
      positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
    }

    let pathString: string = path({
      type: "LineString",
      coordinates: positions,
    });

    return pathEntry.labels.map((label, labelIndex) => {
      if (labelIndex > 0 && pathString) {
        const poothos = pathString
          .split(/L|M|,/i)
          .filter((coord) => !!coord)
          .map((elem) => Number.parseFloat(elem));

        if (poothos.length === 4) {
          //transform that positions
          const flatOffsetPath = offsetSinglePathSegment(poothos);
          pathString = createPathStringFromCoords(flatOffsetPath);
        } else if (pathEntry.coords.length > 4) {
          const complexPathString = dealWithComplexPaths(poothos);
          pathString = createPathStringFromCoords(complexPathString)
        }
      }

      return (
        <path
          key={"17+" + index + label.label}
          fill="none"
          stroke={
            label.weak
              ? DragonColors[label.label]
              : DragonWeakColors[label.label]
          }
          strokeWidth={3}
          opacity={0.7}
          d={pathString || undefined}
          style={{
            cursor: "pointer",
          }}
        >
          <title>{`${label.label}\n${pathEntry.locName.split(":")[1]}`}</title>
        </path>
      );
    });
  });
}

const DragonCircles = memo(
  ({
    charPoints,
    projection,
  }: {
    charPoints: CharacterLocationData[];
    projection: d3.GeoProjection;
  }) => {
    const {
      interestingLabel,
      bidiHighlightMouseOver,
      bidiHighlightMouseLeave,
    } = useBidiHighlight("label");

    const singleCharPoints = reduceCharInPoints(charPoints);

    return singleCharPoints.map((charPoint, pointIndex) => {
      if (isBehindGlobe(charPoint.coords, projection)) {
        return;
      }

      const [x, y] = projection([charPoint.coords[1], charPoint.coords[0]]) ?? [
        0, 0,
      ];

      const bb = [x, y, x, y]; // unused

      const g = (
        <g key={`char${pointIndex}`}>
          {charPoint.labels.map((char, charIndex) => {
            let n = 0;
            if (charPoint.labels.length <= 5) {
              n = charPoint.labels.length;
            } else {
              n = 12;
            }

            const angle = (charIndex / n) * 2 * Math.PI;
            const radius = 5;
            const ringRadius = Math.max(
              radius + 5,
              (0.5 * radius * 1) / Math.sin((0.5 * Math.PI) / n)
            ); // N-Eck äusserer Radius
            const cx = x + ringRadius * Math.cos(angle);
            const cy = y + ringRadius * Math.sin(angle);

            updateBoundingBox(
              bb,
              cx - radius,
              cy - radius,
              cx + radius,
              cy + radius
            );

            return (
              <circle
                key={`${charIndex}.${pointIndex}.char`}
                cx={cx}
                cy={cy}
                r={5}
                fill={DragonColors[char.label]}
                opacity={0.5}
                stroke="black"
                style={{
                  cursor: "pointer",
                }}
                strokeWidth={interestingLabel == char.label ? 3 : 1}
                onMouseOver={bidiHighlightMouseOver}
                onMouseLeave={bidiHighlightMouseLeave}
                data-label={char.label}
              >
                <title>{char.label}</title>
              </circle>
            );
          })}
        </g>
      );

      return g;
    });
  }
);

export const SingleDragonBarChart = memo(() => {
  const dragonChapterData = useDataPointsStore((s) => s.dragonChapterData);

  if (!dragonChapterData) {
    return null;
  }

  const width = document.body.getBoundingClientRect().width - 100;
  const margin = 10;
  const maxHeight = 45;

  const data = getChapterList();
  const data_last = data.length == 0 ? 0 : data.length - 1;
  const dragonCounts = dragonChapterData.map((elem) => elem.labels[0].count);

  const xScale = d3
    .scaleLinear([0, data_last], [margin, width - margin])
    .clamp(true);
  const yScale = d3
    .scaleLinear([0, Math.max(...dragonCounts)], [0, 90])
    .clamp(true);
  const barWidth = width / data.length - 1;
  const bars = useMemo(() => {
    const numberOfTicksTarget = data.length;

    return xScale.ticks(numberOfTicksTarget).map((value, index) => ({
      value: yScale(dragonCounts[index]),
      xOffset: xScale(value),
    }));
  }, [xScale, data]);

  return (
    <svg
      width={"95vw"}
      height={maxHeight}
      style={{ margin: "auto", display: "block", marginTop: "-90px" }}
    >
      {bars.map(({ value, xOffset }, index) => (
        <g
          key={"10+" + index}
          transform={`translate(${xOffset - barWidth / 2}, 0)`}
        >
          <rect
            x={0}
            y={0}
            width={barWidth}
            height={value}
            opacity={0.8}
            fill="#2F4F4F"
          />
        </g>
      ))}
    </svg>
  );
});