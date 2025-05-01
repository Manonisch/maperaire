import { useState, useEffect, useRef, memo, useCallback } from "react";
import * as d3 from 'd3';
import versor from 'versor';
import { getPointerCoords, geoRefs, getPaths, getPoints, getRegions, getBookPosition, getImpliedPaths, getStrokeColor, getAllRelevantElementsOnly, isBehindGlobe, updateBoundingBox } from "./utils";
import { queryRefs, useQuery } from "../stores/QueryStore";
import { TheSlider } from "./mapParts/TheSlider";
import { FoodOverlay } from "./foodQuery/FoodOverlay";
import { AllData } from "./mapParts/GhostLines";
import { TopBar } from "./Topbar";
import { useFoodMapStore } from "../stores/FoodMapStore";
import { countFoodInPoint, getAllKindsOfFood, mapFoodToPointsOnSameCoordinates, prepareFood } from "./foodQuery/foodUtils";
import { useSliderStore } from "../stores/SliderStore";
import { useWorldDataStore } from "../stores/WorldDataStore";
import { BaseMap, OSMLink } from "./mapParts/BaseMap";
import { FoodPoint } from "./foodQuery/foodtypes";
import { getPathLengthFromD, getPathLengthLookup } from 'svg-getpointatlength'

export function TheMapChart() {
  const query = useQuery(s => s.query)

  return <div>
    <TopBar />
    {query === 'Food' && <FoodOverlay />}
    <Marks />
  </div>
}

export const Marks = memo(() => {
  const [isMoving, setIsMoving] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // const [projection] = useState(d3.geoNaturalEarth1)
  const [projection] = useState(d3.geoOrthographic)
  const unityScale = projection.scale();
  const [trick17a, trick17] = useState(0);

  trick17a;

  useEffect(() => {
    if (!svgRef.current) return;

    let v0 = 0;
    let r0 = projection.rotate();
    let q0 = versor(r0);

    let zoomEndTimeout = setTimeout(() => { });

    const zoomBehaviour = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 30])
      .on('start', (ev: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        if (!projection.invert) return;
        const coords = getPointerCoords(ev.sourceEvent.target, ev);
        const projectedCoords = projection.invert(coords);
        if (!projectedCoords) return;
        v0 = versor.cartesian(projectedCoords);
        r0 = projection.rotate();
        q0 = versor(r0);
        setIsMoving(true);
        clearTimeout(zoomEndTimeout);
      })
      .on('zoom', (ev: d3.D3ZoomEvent<Element, unknown>) => {
        if (!isMoving) {
          clearTimeout(zoomEndTimeout);
          setIsMoving(true);
        }

        var scale = ev.transform.k * unityScale;
        projection.scale(scale);
        const coords = getPointerCoords(ev.sourceEvent.target, ev);
        var v1 = versor.cartesian(projection.rotate(r0).invert?.(coords)),
          q1 = versor.multiply(q0, versor.delta(v0, v1)),
          rotation = versor.rotation(q1);

        // rotation[1] = 0; // Don't rotate on Y axis
        rotation[2] = 0; // Don't rotate on Z axis, pole axis

        projection.rotate(rotation);
        trick17(Math.random());
      })
      .on('end', () => {
        // TODO: by passing in coordinates we can move rotate the mape to center the area
        // projection.rotate([137, -64, 0]);

        clearTimeout(zoomEndTimeout);
        zoomEndTimeout = setTimeout(() => {
          setIsMoving(false);
        }, 500);
      })
    d3.select(svgRef.current).call((sel) => zoomBehaviour(sel));
  }, [svgRef, projection]);

  const path = d3.geoPath(projection);

  return (
    <>
      <svg key="1" width='80vw' height='80vh' viewBox="40 0 900 500" className="d-block m-auto" stroke='#aaa' fill='#d7dbd0' ref={svgRef} style={{ margin: 'auto', display: 'block' }}>
        <defs>
          <filter id='shadow' colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="0" stdDeviation="1" floodOpacity="0.2" floodColor='orange' />
          </filter>
          <marker
            id="dragon"
            viewBox="0 0 384 861"
            refX="800"
            refY="780"
            markerWidth="5"
            markerHeight="10"
            orient="auto">
            <path xmlns="http://www.w3.org/2000/svg" d="M180.5,0.5c0,0 92.327,58.693 180,200c0.639,1.029 -39.115,72.002 -38,140c-32.989,16.726 -43.466,70.079 -42,70c8.798,-0.474 8.397,8.634 60,10c12.302,0.326 12.546,-3.024 20,-3c5.459,0.017 -3.892,-11.555 0,-10c4.121,1.646 6.93,7.137 11,11c5.031,4.776 10.932,8.175 11,12c0.067,3.728 -5.394,7.123 -10,11c-6.563,5.525 -13,11 -13,11c0,0 7.185,-10.115 1,-10c-7.452,0.138 -6.131,-2.386 -20,-2c-50.821,1.415 -50.092,8.599 -60,10c-1.943,0.275 4.187,48.286 42,70c-1.301,75.807 38.593,138.956 38,140c-87.502,154.02 -180,200 -180,200c-0,0 44,-102 44,-130c0,-10.603 -14,-28 -14,-28c0,0 15.093,-60.667 15.093,-70c0,-9.333 -15.093,-28 -15.093,-28c0,0 21.897,-18.667 21.897,-28c0,-9.333 -11.016,-28 -11.016,-28c-0,0 14.603,-6.154 17.119,-15.487c2.435,-9.035 2.731,-17.563 0,-26.513c-2.848,-9.333 -18,-50.85 -18,-50.85c0,0 -2.926,0.37 -12.332,-0.59c-12.193,-1.245 -25.234,-12.494 -39.611,-14.56c-40.308,-5.792 -48.057,-20 -68.057,-20c-20,0 -46.667,20 -60,20c-9.428,0 -40,-30 -40,-30c-0,0 26.515,22.655 40,20c16.667,-3.281 40,-26.667 60,-30c19.983,-3.331 59.789,18.602 80,20c15.323,-5.067 17.693,-11.668 29.223,-13.102c8.945,-1.113 10.777,-1.745 10.777,-1.745c0,-0 14.986,-41.82 18,-51.153c3.014,-9.333 2.159,-20.002 0,-29.233c-2.183,-9.333 -17.663,-12.767 -17.663,-12.767c-0,-0 9.384,-18.667 9.384,-28c0,-9.333 -19.721,-28 -19.721,-28c0,0 14,-18.667 14,-28c0,-9.333 -14,-70 -14,-70c0,0 14,-17.565 14,-28c0,-18.667 -44,-130 -44,-130Z" fill="#699aaa" />
          </marker>
        </defs>
        <g key="2" className="marks" style={{ cursor: 'grab' }}>
          <BaseMap path={path} isMoving={isMoving} />
          <BookMapParts projection={projection} path={path} />
          <FoodVisualisation projection={projection} path={path} />
        </g>
        <OSMLink />
      </svg>
      <TheSlider />
    </>
  );
});

// export const allDataAtPoint = () => {

//   //For each (unique) point on the map,

//   //I want to have all data belonging to this point

//   // As an array of Arrays -> each category (not entry, category) should have it's own array

//   // so bubble size can be counted

//   // structure could look like [[Cow, Cattle, Cow, Cow, Cows], [Horse, Horses], [Lizard, Lizards], [Raisins]]
//   // structure could also look like [[[Cow, Cattle, Cow], [Horse, Horses]], [[Lizard, Lizards]], [[Cow, Cows], [Raisins]]]


//   // First, get all Points and All Data



//   // A) Find all Chapters with Overlapping Point data?
//   const books = chapter_labels.books;
//   const reduced = books.flatMap(book => book.chapters);


//   const firstReduced = getAllFirstElementOnly()
//   const otherReduced = getPoints();

//   //TODO: reduce to elements to first element


//   // console.log('what is books', reduced, firstReduced, otherReduced)



//   // B) Reduce all matches from string[][] to string [] in food final
//   const reducedFoodData = Food.map(foodItem => {
//     return {
//       ...foodItem,
//       matches: foodItem.matches.flat()
//     }
//   })

//   console
// }

// export const FoodBubbles = () => {

//   // Given a position and all (filtered) data at this one position,
//   // each data should be added to a bubble
//   // bubbles should be subject to the specified center force

//   const size = 2 // depend on number of same data points at position
//   const centerX = 0 // should be the x coordinate the bubble is attached to //static per datapoint!
//   const centerY = 0 // should be the x coordinate the bubble is attached to //static per datapoint!
//   const age = 0 // counts up for each chapter in animation, set back to 0 when new datapoint is added to size


//   const center = d3.forceCenter(centerX, centerY);

//   const data = [{ "name": "A" }, { "name": "B" }, { "name": "C" }, { "name": "D" }, { "name": "E" }, { "name": "F" }, { "name": "G" }, { "name": "H" }]


//   const simulation = d3.forceSimulation()
//     .force("center", d3.forceCenter().x(100).y(100)) // Attraction to the center of the svg area
//     .force("collide", d3.forceCollide().strength(.1).radius(25).iterations(1)) // Force that avoids circle overlapping

//   // const invertedProj = projection.invert([600, 300]) as [number, number];
//   // const gdist = d3.geoDistance([point.coords[1], point.coords[0]], invertedProj); // the zoom distance whence this should appear

//   return <>
//     {/* <circle
//       key={"116+" + index}
//       transform={`translate(${projection([point.coords[1], point.coords[0]])})`}
//       r={5}
//       fill={getStrokeColor(point, "#699aaa")}
//       opacity={1}
//       stroke='#e6edd0'
//     >
//       <title>{`${point.bookIndex! + 1}.${point.chapterIndex} \n${point.labelName.split(':')[1]}`}</title>
//     </circle> */}
//   </>
// }

export const BookMapParts = memo(function BookMapParts({ projection, path }: { projection: d3.GeoProjection, path: any }) {
  const query = useQuery(s => s.query)

  const sliderStart = useSliderStore(s => s.start);
  const sliderEnd = useSliderStore(s => s.end);
  const start = getBookPosition(sliderStart);
  const end = getBookPosition(sliderEnd);

  const selectedFoodOptions = useFoodMapStore(s => s.selectedOptions);
  const ghostLinesEnabled = useWorldDataStore(s => s.ghostLinesEnabled);

  const positionList = query === 'Food' ? prepareFood(queryRefs[query], selectedFoodOptions) : queryRefs[query];

  const thePoints = getPoints({ start, end, positionList });
  const thePaths = getPaths({ start, end, positionList });
  const theImpliedPaths = getImpliedPaths({ start, end, positionList });
  const theRegions = getRegions({ start, end, positionList });


  // TODO: what we need:

  // Global: Structure should be calculated once for all foods, needs to be filterable by chapter and data should then be accessible with a filtered query, like:

  // getFoodsOnMap ( startChapterIndex, EndChapterIndex ) => Coordinate Elements (Points or Paths)??, food for each element, with amount (maybe with age)

  return <>
    {ghostLinesEnabled && <AllData projection={projection} path={path} />}
    {thePaths.map((pathEntry, index) => {
      const positions: number[][] = []
      for (let i = 0; i < pathEntry.coords.length; i += 2) {
        positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
      }
      return (<path key={"17+" + index} fill='none' stroke={getStrokeColor(pathEntry, "#699aaa")} strokeWidth='1.5px' opacity={0.8} d={path({
        type: "LineString",
        coordinates: positions
      }) || undefined} markerEnd={pathEntry.char !== 'Laurence' ? "url(#dragon)" : ''} ><title>{`${pathEntry.bookIndex! + 1}.${pathEntry.chapterIndex} \n${pathEntry.labelName.split(':')[1]}`}</title></path>)
    })}
    {theImpliedPaths.map((pathEntry, index) => {
      const positions: number[][] = []
      for (let i = 0; i < pathEntry.coords.length; i += 2) {
        positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
      }
      return (<path key={"7+" + index} fill='none' stroke={getStrokeColor(pathEntry, '#699aaa')} strokeWidth='1.5px' opacity={0.7} strokeDasharray='6' d={path({
        type: "LineString",
        coordinates: positions
      }) || undefined} markerEnd={pathEntry.char !== 'Laurence' ? "url(#dragon)" : ''} ><title>{`${pathEntry.bookIndex! + 1}.${pathEntry.chapterIndex} \n${pathEntry.labelName.split(':')[1]}`}</title></path>)
    })}
    {theRegions.map((region, index) => {
      const regional = geoRefs[region?.file ?? ''] || null
      return (<path key={"8+" + index} fill='none' stroke='#6d654b' d={path(regional) || undefined}><title>{`${region.bookIndex! + 1}.${region.chapterIndex} \n${region.labelName.split(':')[1]}`}</title></path>)
    })}
    {thePoints.map((point, index) => {
      if (isBehindGlobe(point, projection)) {
        return null
      }
      const [x, y] = projection([point.coords[1], point.coords[0]]) ?? [0, 0];
      return <circle
        key={"116+" + index}
        cx={x}
        cy={y}
        r={5}
        fill={getStrokeColor(point, "#699aaa")}
        opacity={1}
        stroke='#e6edd0'
      >
        <title>{`${point.bookIndex! + 1}.${point.chapterIndex} \n${point.labelName.split(':')[1]}`}</title>
      </circle>
    })
    }
  </>
})

export const FoodVisualisation = memo(({ projection, path }: { projection: d3.GeoProjection, path: any }) => {


  const makeFoodCircles = useCallback((foodPoints: FoodPoint[], foodColors: Record<string, string>) => {

    const groupedFoodPoints = countFoodInPoint(foodPoints);

    return groupedFoodPoints.map((foodPoint, pointIndex) => {
      const [x, y] = projection([foodPoint.coords[1], foodPoint.coords[0]]) ?? [0, 0];
      const foodsArray = Array.from(foodPoint.countedFood.entries())

      const bb = [x, y, x, y]; // unused

      const g = <g>{foodsArray.map((food, foodIndex) => {

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
  }, [projection]);

  const allKindsOfFood = getAllKindsOfFood(queryRefs.Food);
  const foodColors = getFoodColors(allKindsOfFood);

  const points = getAllRelevantElementsOnly()
    .filter(entry => entry && !isBehindGlobe(entry, projection));
  const foodPoints = mapFoodToPointsOnSameCoordinates(points, queryRefs.Food);


  const foodCirclePoints = foodPoints.filter(p => p.type === 'point');
  const foodCirclePaths = foodPoints.filter(p => p.type === 'path');
  const foodCircles = makeFoodCircles(foodCirclePoints, foodColors);


  function getFoodColors(foods: string[]): Record<string, string> {
    const palette = d3.schemeCategory10;
    const result: Record<string, string> = {};
    foods.forEach((food, index) => {
      result[food] = palette[index % palette.length];
    });
    return result;
  }

  return <g>
    {/* <g>
      {foodCircles}
    </g> */}
    <FoodPathVis foodPoints={foodCirclePaths} projection={projection} path={path} />
  </g>
})

function FoodPathVis({ foodPoints, projection, path }: { foodPoints: FoodPoint[], projection: d3.GeoProjection, path: any }) {
  return <g>{foodPoints.map(pathData => <PathVis d={getD(pathData.coords, path)} pathData={pathData} />)}</g>
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

function PathVis({ pathElement, pathData, d }: { pathElement?: SVGPathElement, pathData: FoodPoint, d: string }) {
  const foodElems = pathData.foods;
  const foodLength = foodElems.length;

  console.log('what is d', d)

  if (!d) {
    return null;
  }

  const pathLengthLookup = getPathLengthLookup(d)

  const totalLength = pathLengthLookup.totalLength;
  // const totalLength = pathElement.getTotalLength();
  const distanceIncrements = totalLength / (foodLength + 1);

  return foodElems.map((elem, i) => {
    const pos = pathLengthLookup.getPointAtLength(distanceIncrements * (1 + i), true);


    //TODO: THIS NEEDS TO BE STATIC!
    const randomOffset = Math.random() * 10;
    let rotatepoo = Math.PI * 0.5
    if (i % 2 === 0) {
      rotatepoo = Math.PI * -0.5
    }
    const x = pos.x + randomOffset * Math.cos(pos.angle + rotatepoo);
    const y = pos.y + randomOffset * Math.sin(pos.angle + rotatepoo);

    console.log('pos', pos)
    return <circle
      key={`poof${i}`}
      cx={x}
      cy={y}
      r={3}
      fill={'grey'}
      opacity={0.5}
      stroke="#000000"
    >
      <title>{elem}</title>
    </circle>
  })

}