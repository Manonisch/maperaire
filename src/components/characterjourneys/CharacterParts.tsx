import { memo } from "react";
import { CharacterLocationData, LabelAssociation, useDataPointsStore } from "../../stores";
import { useBidiHighlight } from "../../hooks/useBidiHighlight";
import { isBehindGlobe, updateBoundingBox } from "../utils";
import { CharacterColors } from "./CharacterStatics";

export const CharacterVisualisation = memo(({ projection, path }: { projection: d3.GeoProjection, path: any }) => {
  const locationData = useDataPointsStore(s => s.characterLocationData);

  const CharacterCirclePoints = locationData.filter(p => p.type === 'point');
  const CharacterCirclePaths = locationData.filter(p => p.type === 'path');

  return (
    <g>
      <CharPaths charPoints={CharacterCirclePaths} path={path} />
      <CharacterCircles charPoints={CharacterCirclePoints} projection={projection} />
    </g>
  )
})

function whatever(list: LabelAssociation[]): LabelAssociation[] {
  const whater: LabelAssociation[] = [];
  list.forEach(l => {
    if (!whater.some(what => what.label === l.label)) {
      whater.push(l);
    }
  })
  return whater;
}

function reduceCharInPoints(points: CharacterLocationData[]) {
  const theRetour: CharacterLocationData[] = [];
  points.forEach(point => {
    theRetour.push({
      labels: whatever(point.labels),
      coords: [...point.coords],
      locName: point.locName,
      type: point.type
    })
  })
  return theRetour;
}

function CharPaths({ charPoints, path }: { charPoints: CharacterLocationData[], path: any }) {

  const singleCharPoints = reduceCharInPoints(charPoints);

  return (
    singleCharPoints.map((pathEntry, index) => {
      const positions: number[][] = []
      for (let i = 0; i < pathEntry.coords.length; i += 2) {
        positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
      }

      return pathEntry.labels.map((label, labelIndex) => {
        return (<path key={"17+" + index + label.label} fill='none' stroke={CharacterColors[label.label]} strokeWidth={(pathEntry.labels.length - labelIndex) * 3} opacity={1} d={path({
          type: "LineString",
          coordinates: positions
        }) || undefined}
          style={{
            cursor: 'pointer'
          }}
        ></path>)
      })
    })
  )
}

const CharacterCircles = memo(({ charPoints, projection }: { charPoints: CharacterLocationData[], projection: d3.GeoProjection }) => {
  const { interestingLabel, bidiHighlightMouseOver, bidiHighlightMouseLeave } = useBidiHighlight('label');

  const singleCharPoints = reduceCharInPoints(charPoints);

  return singleCharPoints.map((charPoint, pointIndex) => {
    if (isBehindGlobe(charPoint.coords, projection)) {
      return;
    }

    const [x, y] = projection([charPoint.coords[1], charPoint.coords[0]]) ?? [0, 0];

    const bb = [x, y, x, y]; // unused

    const g = <g key={`char${pointIndex}`}>{charPoint.labels.map((char, charIndex) => {

      let n = 0;
      if (charPoint.labels.length <= 5) {
        n = charPoint.labels.length;
      } else {
        n = 12
      }

      const angle = (charIndex / n) * 2 * Math.PI;
      const radius = 5;
      const ringRadius = Math.max(radius + 5, 0.5 * radius * 1 / Math.sin(0.5 * Math.PI / n)); // N-Eck äusserer Radius
      const cx = x + ringRadius * Math.cos(angle);
      const cy = y + ringRadius * Math.sin(angle);

      updateBoundingBox(bb, cx - radius, cy - radius, cx + radius, cy + radius);

      return <circle
        key={`${charIndex}.${pointIndex}.food`}
        cx={cx}
        cy={cy}
        r={5}
        fill={CharacterColors[char.label]}
        opacity={0.5}
        stroke='black'
        style={{
          cursor: 'pointer'
        }}
        strokeWidth={interestingLabel == char.label ? 3 : 1}
        onMouseOver={bidiHighlightMouseOver}
        onMouseLeave={bidiHighlightMouseLeave}
        data-label={char.label}
      >
        <title>{char.label}</title>
      </circle>
    })}</g>;

    return g;
  });
});