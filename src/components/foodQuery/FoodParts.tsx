import *  as d3 from "d3";
import { memo, MouseEvent, useCallback } from "react";
import { updateBoundingBox, isBehindGlobe } from "../utils";
import { countFoodInPoint, getAllKindsOfFood, getFoodColors } from "./foodUtils";
import { getPathLengthLookup } from 'svg-getpointatlength'
import { LocationData, MinimalGroupedData, useDataPointsStore } from "../../stores";
import { useInterestingLabelStore } from "../../stores/InterestingLabelStore";

export const FoodVisualisation = memo(({ projection, path }: { projection: d3.GeoProjection, path: any }) => {
  const locationData = useDataPointsStore(s => s.locationData);

  const allKindsOfFood = getAllKindsOfFood(MinimalGroupedData);
  const foodColors = getFoodColors(allKindsOfFood);

  const foodCirclePoints = locationData.filter(p => p.type === 'point');
  const foodCirclePaths = locationData.filter(p => p.type === 'path');

  return <g>
    <g>
      <FoodCircles foodPoints={foodCirclePoints} foodColors={foodColors} projection={projection} />
    </g>
    <FoodPathVis foodPoints={foodCirclePaths} path={path} />
  </g>
})

const FoodCircles = memo(({ foodPoints, foodColors, projection }: { foodPoints: LocationData[], foodColors: Record<string, string>, projection: d3.GeoProjection }) => {
  const interestingLabel = useInterestingLabelStore(s => s.interestingLabel);
  const setInterestingLabel = useInterestingLabelStore(s => s.setInterestingLabel);
  const onCircleMouseOver = useCallback((ev: MouseEvent<SVGElement>) => {
    setInterestingLabel(ev.currentTarget.dataset.label ?? null);
  }, []);
  const onCircleMouseLeave = useCallback((ev: MouseEvent<SVGElement>) => {
    if (interestingLabel == ev.currentTarget.dataset.label) {
      setInterestingLabel(null);
    }
  }, [interestingLabel]);

  const groupedFoodPoints = countFoodInPoint(foodPoints);

  return groupedFoodPoints.map((foodPoint, pointIndex) => {
    if (isBehindGlobe(foodPoint.coords, projection)) {
      return;
    }

    const [x, y] = projection([foodPoint.coords[1], foodPoint.coords[0]]) ?? [0, 0];
    const foodsArray = Array.from(foodPoint.countedFood.entries())

    const bb = [x, y, x, y]; // unused

    const g = <g key={`foooooooo${pointIndex}`}>{foodsArray.map((food, foodIndex) => {

      let n = 0;
      if (foodsArray.length <= 5) {
        n = foodsArray.length;
      } else if (foodIndex < 5) {
        n = 5
      } else if (foodIndex < 16) {
        n = 12
      } else {
        n = 19
      }

      const angle = (foodIndex / n) * 2 * Math.PI;
      const radius = (5 + (food[1] * 0.3));
      const ringRadius = Math.max(radius + 5, 0.5 * radius * 1 / Math.sin(0.5 * Math.PI / n)); // N-Eck äusserer Radius
      const cx = x + ringRadius * Math.cos(angle);
      const cy = y + ringRadius * Math.sin(angle);

      updateBoundingBox(bb, cx - radius, cy - radius, cx + radius, cy + radius);

      return <circle
        key={`${foodIndex}.${pointIndex}.food`}
        cx={cx}
        cy={cy}
        r={3 + food[1]}
        fill={foodColors[food[0]]}
        opacity={0.5}
        stroke='black'
        strokeWidth={interestingLabel == food[0] ? 3 : 1}
        onMouseOver={onCircleMouseOver}
        onMouseLeave={onCircleMouseLeave}
        data-label={food[0]}
      >
        <title>{food[0]}</title>
      </circle>
    })}</g>;

    return g;
  });
});

function FoodPathVis({ foodPoints, path }: { foodPoints: LocationData[], path: any }) {
  return <g>{foodPoints.map((data, i) => <PathVis key={i + 'kjgkhjkt'} d={getD(data.coords, path)} pathData={data} />)}</g>
}

function getD(coords: number[], path: any) {
  const positions: number[][] = []
  for (let i = 0; i < coords.length; i += 2) {
    positions.push([coords[i + 1], coords[i]]);
  }
  return path({ type: "LineString", coordinates: positions }) || '';
}

function PathVis({ pathData, d }: { pathData: LocationData, d: string }) {
  const foodElems = pathData.labels;
  const foodLength = foodElems.length;

  if (!d) {
    return null;
  }

  const pathLengthLookup = getPathLengthLookup(d)
  const distanceIncrements = pathLengthLookup.totalLength / (foodLength + 1);

  return foodElems.map((elem, i) => {
    const pos = pathLengthLookup.getPointAtLength(distanceIncrements * (1 + i), true);

    let rotatepoo = Math.PI * 0.5
    if (i % 2 === 0) {
      rotatepoo = Math.PI * -0.5
    }
    const x = pos.x + 7 * Math.cos(pos.angle + rotatepoo);
    const y = pos.y + 7 * Math.sin(pos.angle + rotatepoo);

    //TODO: here shall be icons
    return <text key={i + 'somestuff'} x={x} y={y} style={{ fontSize: '12px' }} fill='grey' stroke='none'>{elem[0]}</text>
  })

}