import { useState, useEffect, useRef, memo } from "react";
import * as d3 from 'd3';
import versor from 'versor';
import { getPointerCoords } from "./utils";
import { TopBar } from "./Topbar";
import { useQuery } from "../stores";
import { BaseMap, OSMLink, TheSlider } from "./mapParts";
import { FoodOverlay, FoodVisualisation } from "./foodQuery";
import { BookMapParts } from "./mapParts/BookMapParts";
import { CharacterOverlay } from "./characterjourneys/CharacterOverlay";
import { CharacterVisualisation, SingleFilterBarChart } from "./characterjourneys/CharacterParts";
import { DragonOverlay } from "./dragonJourneys/DragonOverlay";
import { DragonVisualisation, SingleDragonBarChart } from "./dragonJourneys/DragonParts";

export function TheMapChart() {
  const query = useQuery(s => s.query)

  return <div>
    <TopBar />
    {query === 'Food' && <FoodOverlay />}
    {query === 'Characters' && <CharacterOverlay />}
    {query === 'Dragons' && <DragonOverlay />}
    <Marks />
  </div>
}

export const Marks = memo(() => {
  const [isMoving, setIsMoving] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const [projection] = useState(d3.geoNaturalEarth1)
  const unityScale = projection.scale();
  const [trick17a, trick17] = useState(0);
  const path = d3.geoPath(projection);
  const r = 4;
  const query = useQuery(s => s.query)
  trick17a;

  useEffect(() => {
    if (!svgRef.current) return;

    projection.translate([0, 0]);

    let v0 = 0;
    let r0 = projection.rotate();
    let q0 = versor(r0);


    let lon0 = 0;

    let zoomEndTimeout = setTimeout(() => { });

    const bb = svgRef.current.getBoundingClientRect();
    trick17(Math.random());

    const zoomBehaviour = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 30])
      .extent([[0, 0], [bb.width, bb.height]])
      .on('start', (ev: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        if (!projection.invert) return;
        const coords = getPointerCoords(ev.sourceEvent.target, ev);
        const projectedCoords = projection.invert(coords);
        if (!projectedCoords) return;
        lon0 = projectedCoords[0];
        v0 = versor.cartesian([projectedCoords[0], [0]]);
        r0 = projection.rotate();
        q0 = versor(r0);
      })
      .on('zoom', (ev: d3.D3ZoomEvent<Element, unknown>) => {
        if (!isMoving) {
          clearTimeout(zoomEndTimeout);
          setIsMoving(true);
        }

        const {k, y: ty} = ev.transform;
        const coords_px = getPointerCoords(ev.sourceEvent.target, ev);

        projection.scale(k * unityScale);

        const [lon1] = projection.rotate(r0).invert!(coords_px)!;
        projection.rotate([r0[0] + lon1 - lon0, r0[1], r0[2]]);
        projection.translate([0, ty]);

        trick17(Math.random());
      })
      .on('end', () => {
        clearTimeout(zoomEndTimeout);
        zoomEndTimeout = setTimeout(() => {
          setIsMoving(false);
        }, 500);
      })
    d3.select(svgRef.current).call((sel) => zoomBehaviour(sel));
  }, [svgRef, projection]);

  return (
    <>
      <svg key="1" width='80vw' height='75vh' viewBox="-500 -250 1000 500" className="d-block m-auto" stroke='#aaa' fill='#d7dbd0' ref={svgRef} style={{
         border: '1px solid red',
         margin: 'auto', display: 'block' }} onMouseDown={(event) => { event.preventDefault() }}>
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
            <path xmlns="http://www.w3.org/2000/svg" d="M180.5,0.5c0,0 92.327,58.693 180,200c0.639,1.029 -39.115,72.002 -38,140c-32.989,16.726 -43.466,70.079 -42,70c8.798,-0.474 8.397,8.634 60,10c12.302,0.326 12.546,-3.024 20,-3c5.459,0.017 -3.892,-11.555 0,-10c4.121,1.646 6.93,7.137 11,11c5.031,4.776 10.932,8.175 11,12c0.067,3.728 -5.394,7.123 -10,11c-6.563,5.525 -13,11 -13,11c0,0 7.185,-10.115 1,-10c-7.452,0.138 -6.131,-2.386 -20,-2c-50.821,1.415 -50.092,8.599 -60,10c-1.943,0.275 4.187,48.286 42,70c-1.301,75.807 38.593,138.956 38,140c-87.502,154.02 -180,200 -180,200c-0,0 44,-102 44,-130c0,-10.603 -14,-28 -14,-28c0,0 15.093,-60.667 15.093,-70c0,-9.333 -15.093,-28 -15.093,-28c0,0 21.897,-18.667 21.897,-28c0,-9.333 -11.016,-28 -11.016,-28c-0,0 14.603,-6.154 17.119,-15.487c2.435,-9.035 2.731,-17.563 0,-26.513c-2.848,-9.333 -18,-50.85 -18,-50.85c0,0 -2.926,0.37 -12.332,-0.59c-12.193,-1.245 -25.234,-12.494 -39.611,-14.56c-40.308,-5.792 -48.057,-20 -68.057,-20c-20,0 -46.667,20 -60,20c-9.428,0 -40,-30 -40,-30c-0,0 26.515,22.655 40,20c16.667,-3.281 40,-26.667 60,-30c19.983,-3.331 59.789,18.602 80,20c15.323,-5.067 17.693,-11.668 29.223,-13.102c8.945,-1.113 10.777,-1.745 10.777,-1.745c0,-0 14.986,-41.82 18,-51.153c3.014,-9.333 2.159,-20.002 0,-29.233c-2.183,-9.333 -17.663,-12.767 -17.663,-12.767c-0,-0 9.384,-18.667 9.384,-28c0,-9.333 -19.721,-28 -19.721,-28c0,0 14,-18.667 14,-28c0,-9.333 -14,-70 -14,-70c0,0 14,-17.565 14,-28c0,-18.667 -44,-130 -44,-130Z" fill={query === "default" ? "#699aaa" : "#999"} />
          </marker>
        </defs>
        <g key="2" className="marks" style={{ cursor: 'grab' }}>
          <BaseMap path={path} isMoving={isMoving} />
          <BookMapParts projection={projection} path={path} />
          {query === 'Food' ? <FoodVisualisation projection={projection} path={path} /> : null}
          {query === 'Characters' ? <CharacterVisualisation projection={projection} path={path} /> : null}
          {query === 'Dragons' ? <DragonVisualisation projection={projection} path={path} /> : null}
        </g>
        <OSMLink />
        <circle cx="0" cy="0" r={r} fill="fuchsia" />
        <circle cx="-500" cy="0" r={r} fill="blue" />
        <circle cx="-500" cy="-250" r={r} fill="blue" />
        <circle cx="-500" cy="250" r={r} fill="blue" />

        <circle cx="500" cy="0" r={r} fill="blue" />
        <circle cx="500" cy="-250" r={r} fill="blue" />
        <circle cx="500" cy="250" r={r} fill="blue" />
      </svg>
      <TheSlider />
      {query === 'Characters' ? <SingleFilterBarChart /> : null}
      {query === 'Dragons' ? <SingleDragonBarChart /> : null}

    </>
  );
});

