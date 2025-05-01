import *  as d3 from "d3";
import { memo } from "react";
import { queryRefs } from "../../stores/QueryStore";
import { updateBoundingBox, isBehindGlobe } from "../utils";
import { FoodPoint } from "./foodtypes";
import { countFoodInPoint, getAllKindsOfFood, mapFoodToPointsOnSameCoordinates } from "./foodUtils";
import { getPathLengthLookup } from 'svg-getpointatlength'
import { useDataPointsStore } from "../../stores/DataPointsStore";

export const FoodVisualisation = memo(({ projection, path }: { projection: d3.GeoProjection, path: any }) => {

  const relevantFoods = useDataPointsStore(s => s.allRelevantElements)

  //TODO: should this be pre-filter or post filtering?
  const allKindsOfFood = getAllKindsOfFood(queryRefs.Food);
  const foodColors = getFoodColors(allKindsOfFood);

  const points = relevantFoods.filter(entry => entry && !isBehindGlobe(entry, projection));
  const foodPoints = mapFoodToPointsOnSameCoordinates(points, queryRefs.Food);

  const foodCirclePoints = foodPoints.filter(p => p.type === 'point');
  const foodCirclePaths = foodPoints.filter(p => p.type === 'path');

  return <g>
    <g>
      <FoodCircles foodPoints={foodCirclePoints} foodColors={foodColors} projection={projection} />
    </g>
    <FoodPathVis foodPoints={foodCirclePaths} path={path} />
  </g>
})

function getFoodColors(foods: string[]): Record<string, string> {
  const palette = d3.schemeCategory10;
  const result: Record<string, string> = {};
  foods.forEach((food, index) => {
    result[food] = palette[index % palette.length];
  });
  return result;
}

const FoodCircles = memo(({ foodPoints, foodColors, projection }: { foodPoints: FoodPoint[], foodColors: Record<string, string>, projection: d3.GeoProjection }) => {

  const groupedFoodPoints = countFoodInPoint(foodPoints);

  return groupedFoodPoints.map((foodPoint, pointIndex) => {
    const [x, y] = projection([foodPoint.coords[1], foodPoint.coords[0]]) ?? [0, 0];
    const foodsArray = Array.from(foodPoint.countedFood.entries())

    const bb = [x, y, x, y]; // unused

    const g = <g key={`foooooooo${pointIndex}`}>{foodsArray.map((food, foodIndex) => {

      let n = 0;
      if (foodsArray.length <= 5) {
        n = foodsArray.length;
      }
      else if (foodIndex < 5) {
        n = 5
      }
      else if (foodIndex < 16) {
        n = 12
      }
      else if (foodIndex < 32) {
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
        stroke="#000000"
      >
        <title>{food[0]}</title>
      </circle>
    })}</g>;

    return g;
  });
});

function FoodPathVis({ foodPoints, path }: { foodPoints: FoodPoint[], path: any }) {
  return <g>{foodPoints.map((pathData, i) => <PathVis key={i + 'kjgkhjkt'} d={getD(pathData.coords, path)} pathData={pathData} />)}</g>
}

// function svgPathElement(coords: number[], path: any) {
//   const positions: number[][] = []
//   for (let i = 0; i < coords.length; i += 2) {
//     positions.push([coords[i + 1], coords[i]]);
//   }
//   const d = path({ type: "LineString", coordinates: positions }) || '';
//   const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//   pathElement.setAttribute('d', d);
//   return pathElement;
// }

function getD(coords: number[], path: any) {
  const positions: number[][] = []
  for (let i = 0; i < coords.length; i += 2) {
    positions.push([coords[i + 1], coords[i]]);
  }
  return path({ type: "LineString", coordinates: positions }) || '';
}

function PathVis({ pathData, d }: { pathData: FoodPoint, d: string }) {
  const foodElems = pathData.foods;
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