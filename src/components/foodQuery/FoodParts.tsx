import *  as d3 from "d3";
import { memo, ReactElement, SVGProps } from "react";
import { updateBoundingBox, isBehindGlobe } from "../utils";
import { countFoodInPoint, getAllKindsOfFood, getFoodColors } from "./foodUtils";
import { getPathLengthLookup } from 'svg-getpointatlength'
import { LocationData, MinimalGroupedData, useDataPointsStore } from "../../stores";
import { useBidiHighlight } from "../../hooks/useBidiHighlight";
import { foodColorMap, foodGroups, foodIconMap, groupParentFoods } from "./FoodStatics";
import { BirdIcon } from "../../assets/bird";
import { CowIcon } from "../../assets/cow";
import { DeergameIcon } from "../../assets/deergame";
import { FishIcon } from "../../assets/fish";
import { GrainsIcon } from "../../assets/grains";
import { PorridgeIcon } from "../../assets/porridge";
import { VegetablesIcon } from "../../assets/vegetables";

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
  const { interestingLabel, bidiHighlightMouseOver, bidiHighlightMouseLeave } = useBidiHighlight('label');

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
        style={{
          cursor: 'pointer'
        }}
        strokeWidth={interestingLabel == food[0] ? 3 : 1}
        onMouseOver={bidiHighlightMouseOver}
        onMouseLeave={bidiHighlightMouseLeave}
        data-label={food[0]}
      >
        <title>{food[0] + ': ' + food[1]}</title>
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
  const { interestingLabel, bidiHighlightMouseOver, bidiHighlightMouseLeave } = useBidiHighlight('label');

  const foodElems = pathData.labels.filter(label => foodGroups.has(label));
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
    const interest = interestingLabel === elem;

    //TODO: here shall be icons

    const parent = groupParentFoods[elem];
    const commonProps = {
      x: x,
      y: y,
      width: '20px',
      height: '20px',
      opacity: '0.5',
      style: { cursor: 'pointer', strokeWidth: '4%' }
    }

    switch (parent) {
      case 'birds':
        return <g x={x} y={y} style={{ color: foodColorMap[parent] }}
        >
          <BirdIcon {...commonProps} stroke={interest ? 'black' : 'none'}
            onMouseOver={bidiHighlightMouseOver}
            onMouseLeave={bidiHighlightMouseLeave}
            data-label={elem}
          ></BirdIcon>
          <title>{elem}</title>
        </g>
        break;
      case 'game':
        return <g x={x} y={y} style={{ color: foodColorMap[parent] }}
        >
          <DeergameIcon {...commonProps} stroke={interest ? 'black' : 'none'} onMouseOver={bidiHighlightMouseOver}
            onMouseLeave={bidiHighlightMouseLeave} data-label={elem}
          ></DeergameIcon>
          <title>{elem}</title>
        </g>;
        break;
      case 'livestock':
        return <g x={x} y={y} style={{ color: foodColorMap[parent] }}
        >
          <CowIcon {...commonProps} stroke={interest ? 'black' : 'none'} onMouseOver={bidiHighlightMouseOver}
            onMouseLeave={bidiHighlightMouseLeave} data-label={elem}
          ></CowIcon>
          <title>{elem}</title>
        </g >
        break;
      case 'stews and more':
        return <g x={x} y={y} style={{ color: foodColorMap[parent] }}
        >
          <PorridgeIcon {...commonProps} stroke={interest ? 'black' : 'none'} onMouseOver={bidiHighlightMouseOver}
            onMouseLeave={bidiHighlightMouseLeave} data-label={elem}
          ></PorridgeIcon>
          <title>{elem}</title>
        </g >
        break;
      case 'grains':
        return <g x={x} y={y} style={{ color: foodColorMap[parent] }}
        >
          <GrainsIcon {...commonProps} stroke={interest ? 'black' : 'none'} onMouseOver={bidiHighlightMouseOver}
            onMouseLeave={bidiHighlightMouseLeave} data-label={elem}
          ></GrainsIcon>
          <title>{elem}</title>
        </g >;
        break;
      case 'fish & ocean mammals':
        return <g x={x} y={y} style={{ color: foodColorMap[parent] }}
        ><FishIcon {...commonProps} stroke={interest ? 'black' : 'none'} onMouseOver={bidiHighlightMouseOver}
          onMouseLeave={bidiHighlightMouseLeave} data-label={elem}
        ></FishIcon>
          <title>{elem}</title>
        </g >;
        break;
      case 'fruits & vegetables':
        return <g x={x} y={y} style={{ color: foodColorMap[parent] }}
        ><VegetablesIcon {...commonProps} stroke={interest ? 'black' : 'none'} onMouseOver={bidiHighlightMouseOver}
          onMouseLeave={bidiHighlightMouseLeave} data-label={elem}
        ></VegetablesIcon>
          <title>{elem}</title>
        </g >
        break;
      default:
        return (<text
          key={i + 'somestuff'}
          x={x} y={y}
          style={{
            fontSize: '12px',
            fontWeight: interest ? 'bold' : undefined,
            cursor: 'pointer',
          }}
          fill={interest ? 'black' : 'grey'}
          stroke='none'
          onMouseOver={bidiHighlightMouseOver}
          onMouseLeave={bidiHighlightMouseLeave}
          data-label={elem}
        >
          {elem[0]}
          <title>{elem}</title>
        </text>)
    }
  })
}

const theIcon = () => {

  //pass the props to the generic child

  return {props.children}
}