import { memo, useMemo } from "react";
import { CharacterLocationData, LabelAssociation, useDataPointsStore } from "../../stores";
import { useBidiHighlight } from "../../hooks/useBidiHighlight";
import { getChapterList, isBehindGlobe, updateBoundingBox } from "../utils";
import { CharacterColors, CharacterWeakColors } from "./CharacterStatics";
import * as d3 from "d3";

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
  return whater.toSorted((a, b) => a.label.localeCompare(b.label));;
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


//TODO:

// chore: can the offset calculation be moved somewhere upwards?
// task: complex paths, make complex path into multiple single paths
// issue: path uses longitude/lattitude and not pixel position

function CharPaths({ charPoints, path }: { charPoints: CharacterLocationData[], path: any }) {

  const singleCharPoints = reduceCharInPoints(charPoints);

  return (
    singleCharPoints.map((pathEntry, index) => {
      let positions: number[][] = []
      for (let i = 0; i < pathEntry.coords.length; i += 2) {
        positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
      }

      let pathos: string = path({
        type: "LineString",
        coordinates: positions
      })

      // console.log('what is pathos', pathos)
      return pathEntry.labels.map((label, labelIndex) => {

        if (labelIndex > 0 && pathos) {
          if (pathEntry.coords.length === 4) {
            //transform that positions
            const flatPos = positions.flat();
            const poothos = pathos.split(/L|M|,/i);

            console.log('what is poothos', pathos, poothos)
            const flatOffsetPath = offsetSinglePathSegment(flatPos, labelIndex);
            positions = [[flatOffsetPath[0], flatOffsetPath[1]], [flatOffsetPath[2], flatOffsetPath[3]]]
          }
          else if (pathEntry.coords.length > 4) {
            // positions = dealWithComplexPaths(positions, labelIndex);
          }
        }

        return (<path key={"17+" + index + label.label} fill='none' strokeDasharray={label.weak ? '10 3' : 'none'} stroke={label.weak ? CharacterWeakColors[label.label] : CharacterColors[label.label]} strokeWidth={3} opacity={1} d={path({
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
        key={`${charIndex}.${pointIndex}.char`}
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

export const SingleFilterBarChart = memo(() => {

  const characterChapterData = useDataPointsStore(s => s.characterChapterData);

  if (!characterChapterData) {
    return null
  }

  const width = document.body.getBoundingClientRect().width - 100;
  const margin = 10;
  const maxHeight = 45;

  const data = getChapterList();
  const data_last = data.length == 0 ? 0 : data.length - 1;
  const characterCounts = characterChapterData.map(elem => elem.labels[0].count);

  const xScale = d3.scaleLinear([0, data_last], [margin, width - margin]).clamp(true);
  const yScale = d3.scaleLinear([0, Math.max(...characterCounts)], [0, 90]).clamp(true);
  const barWidth = (width / data.length) - 1
  const bars = useMemo(() => {
    const numberOfTicksTarget = data.length;

    return xScale.ticks(numberOfTicksTarget).map((value, index) => ({
      value: yScale(characterCounts[index]),
      xOffset: xScale(value),
    }));
  }, [xScale, data]);

  return (
    <svg width={'95vw'} height={maxHeight} style={{ margin: 'auto', display: 'block', marginTop: '-90px' }}>
      {bars.map(({ value, xOffset }, index) => (
        <g key={"10+" + index} transform={`translate(${xOffset - (barWidth / 2)}, 0)`}>
          <rect x={0} y={0} width={barWidth} height={value} opacity={0.8} fill="#2F4F4F" />
        </g>))}
    </svg>
  )
})


function dealWithComplexPaths(path: number[][], labelIndex: number) {

  const newPoints: number[][] = [];

  //get starting point so we only have to get offset once for each point
  let offsetStarterPath = offsetSinglePathSegment([...path[0], ...path[1]], labelIndex);
  newPoints.push([offsetStarterPath[0], offsetStarterPath[1]]);

  // for each set of two, this is a coordinate
  for (let i = 1; i < path.length - 1; i++) {
    // single path segments go between each 
    const testPathNext = [...path[i + 1], ...path[i]]

    //get the offset of this path segment and the next
    const offTestPathNext = offsetSinglePathSegment(testPathNext, labelIndex);

    //Find the intersection between this path segment and the next
    const interSectPoint = getIntersection(offsetStarterPath, offTestPathNext)
    newPoints.push(interSectPoint);
    offsetStarterPath = offTestPathNext;
  }
  return newPoints;
}

function offsetSinglePathSegment(path: number[], offseter: number): [number, number, number, number] {
  // get the richtungsvector
  const xa = path[2] - path[0];
  const ya = path[3] - path[1];

  //normalisiere den Vektor
  const denomiter = Math.sqrt((xa * xa) + (ya * ya))
  const xau = xa / denomiter
  const yau = ya / denomiter

  // get the normal to the anstieg
  const xn = -yau
  const yn = xau

  const offset = 1 * offseter;

  return [path[0] + (offset * xn), path[1] + (offset * yn), path[2] + (offset * xn), path[3] + (offset * yn)]
}

function getIntersection(path1: [number, number, number, number], path2: [number, number, number, number]) {

  //for two given single path segment => get the path function for each

  if (path1.length !== 4 || path2.length !== 4) {
    throw new Error('oh no, path has not exactly 4 coordinates ' + path1 + ' , ' + path2)
  }

  // basis is starting point
  const x1 = path1[0]
  const y1 = path1[1]
  // slope is difference
  const u1 = path1[2] - path1[0]
  const v1 = path1[3] - path1[1]

  // basis is starting point
  const x2 = path2[0]
  const y2 = path2[1]
  // slope is difference
  const u2 = path2[2] - path2[0]
  const v2 = path2[3] - path2[1]


  const divident = (-u2 * y2 + y1 * u2 + x2 * v2 - x1 * v2);
  const divisor = (u1 * v2 - v1 * u2);
  const a = divident / divisor;

  const xS = x1 + a * u1;
  const yS = y1 + a * v1;

  return [xS, yS]
}