import { useState, useEffect, useRef, useCallback, memo, ChangeEvent } from "react";
import * as d3 from 'd3';
import versor from 'versor';
import { w2000, w100, getPointerCoords, geoRefs, getPaths, getPoints, getRegions, useWorldData, getBookPosition, getImpliedPaths, getStrokeColor } from "./utils";
import { bookPosition } from "./types";
import { SourcesLink } from "./SourcesLink";
import { queryRefs, Querys, useQuery } from "../stores/QueryStore";
import { TheSlider } from "./TheSlider";
import { GhostPointButton } from "./GhostPointButton";

export function TheMapChart() {
  const [showGhostLines, setShowGhostLines] = useState(false);
  const worldData = useWorldData();
  const query = useQuery(s => s.query)
  const chooseQuery = useQuery(s => s.chooseQuery)
  const queryArray = Object.entries(queryRefs);

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    chooseQuery(event.target.value as Querys);
  }, [])

  if (!worldData) {
    return <div>'Loading'</div>
  }

  return <div>
    <div className="w-full h-[40px] flex" style={{ width: '100%', height: '40px', display: 'flex' }}> <SourcesLink />
      <select onChange={handleChange} style={{ height: '26px', borderRadius: '6px', backgroundColor: 'oklch(70.9% 0.01 56.259)', color: 'oklch(26.8% 0.007 34.298)', margin: '2px' }}
      >{queryArray.map(entry => {
        return (<option key={'option' + entry[0]} value={entry[0]}>{entry[0]}</option>)
      })}
      </select>
      <GhostPointButton handleClick={() => setShowGhostLines(s => !s)} text={showGhostLines ? 'Hide GhostLines' : 'Show GhostLines'} />
      <span style={{ fontSize: '14px', color: '#555', textAlign: 'center', paddingInlineStart: '10px' }}>   Move the Globe by dragging with the mouse, zoom via scroll wheel. To Filter drag and mouve the handles on the bottom axis</span>
    </div>
    <Marks data={worldData} filterData={queryRefs[query]} showGhostLines={showGhostLines} />
  </div>
}

export const Marks = memo(({ data, filterData, showGhostLines }: { data: { fifty: { land: any, interiors: any }, hundred: { land: any, interiors: any } }, filterData?: bookPosition[], showGhostLines?: boolean }) => {
  const [localData, setLocalData] = useState(data.fifty)
  const [worldData, setWorldData] = useState(w2000);
  const [isMoving, setIsMoving] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState<number | undefined>(undefined)

  const svgRef = useRef<SVGSVGElement>(null);

  // const [projection] = useState(d3.geoNaturalEarth1)
  const [projection] = useState(d3.geoOrthographic)
  const unityScale = projection.scale();
  const [trick17a, trick17] = useState(0);

  const setRange = useCallback(({ theStart, theEnd }: { theStart: number, theEnd: number }) => {
    setStart(theStart);
    setEnd(theEnd);
  }, [])

  trick17a;

  const makeWorldLookStuped = useCallback(() => {
    setLocalData(data.hundred);
    setWorldData(w100);
    setIsMoving(true)
  }, [data]);

  const makeWorldShiny = useCallback(() => {
    setLocalData(data.fifty);
    setWorldData(w2000)
    setIsMoving(false)
  }, [data]);

  useEffect(() => {
    if (!svgRef.current) return;

    let v0 = 0;
    let r0 = projection.rotate();
    let q0 = versor(r0);

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
        makeWorldLookStuped();
      })
      .on('zoom', (ev: d3.D3ZoomEvent<Element, unknown>) => {
        // if (!projection) return;
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
        makeWorldShiny();
      })


    d3.select(svgRef.current).call((sel) => zoomBehaviour(sel));
  }, [svgRef, projection]);

  const path = d3.geoPath(projection);
  const graticule = d3.geoGraticule();

  const thePoints = getPoints({ start: getBookPosition(start), end: getBookPosition(end), positionList: filterData });
  const thePaths = getPaths({ start: getBookPosition(start), end: getBookPosition(end), positionList: filterData });
  const theImpliedPaths = getImpliedPaths({ start: getBookPosition(start), end: getBookPosition(end), positionList: filterData });
  const theRegions = getRegions({ start: getBookPosition(start), end: getBookPosition(end), positionList: filterData });


  return (
    <>
      <svg key="1" width='80vw' height='70vh' viewBox="40 0 900 500" className="d-block m-auto" stroke='#aaa' fill='white' ref={svgRef} style={{ margin: 'auto', display: 'block' }}>

        <defs>
          <marker
            id="dragon"
            viewBox="0 0 384 861"
            refX="800"
            refY="430"
            markerWidth="8"
            markerHeight="15"
            orient="auto">
            <path xmlns="http://www.w3.org/2000/svg" d="M180.5,0.5c0,0 92.327,58.693 180,200c0.639,1.029 -39.115,72.002 -38,140c-32.989,16.726 -43.466,70.079 -42,70c8.798,-0.474 8.397,8.634 60,10c12.302,0.326 12.546,-3.024 20,-3c5.459,0.017 -3.892,-11.555 0,-10c4.121,1.646 6.93,7.137 11,11c5.031,4.776 10.932,8.175 11,12c0.067,3.728 -5.394,7.123 -10,11c-6.563,5.525 -13,11 -13,11c0,0 7.185,-10.115 1,-10c-7.452,0.138 -6.131,-2.386 -20,-2c-50.821,1.415 -50.092,8.599 -60,10c-1.943,0.275 4.187,48.286 42,70c-1.301,75.807 38.593,138.956 38,140c-87.502,154.02 -180,200 -180,200c-0,0 44,-102 44,-130c0,-10.603 -14,-28 -14,-28c0,0 15.093,-60.667 15.093,-70c0,-9.333 -15.093,-28 -15.093,-28c0,0 21.897,-18.667 21.897,-28c0,-9.333 -11.016,-28 -11.016,-28c-0,0 14.603,-6.154 17.119,-15.487c2.435,-9.035 2.731,-17.563 0,-26.513c-2.848,-9.333 -18,-50.85 -18,-50.85c0,0 -2.926,0.37 -12.332,-0.59c-12.193,-1.245 -25.234,-12.494 -39.611,-14.56c-40.308,-5.792 -48.057,-20 -68.057,-20c-20,0 -46.667,20 -60,20c-9.428,0 -40,-30 -40,-30c-0,0 26.515,22.655 40,20c16.667,-3.281 40,-26.667 60,-30c19.983,-3.331 59.789,18.602 80,20c15.323,-5.067 17.693,-11.668 29.223,-13.102c8.945,-1.113 10.777,-1.745 10.777,-1.745c0,-0 14.986,-41.82 18,-51.153c3.014,-9.333 2.159,-20.002 0,-29.233c-2.183,-9.333 -17.663,-12.767 -17.663,-12.767c-0,-0 9.384,-18.667 9.384,-28c0,-9.333 -19.721,-28 -19.721,-28c0,0 14,-18.667 14,-28c0,-9.333 -14,-70 -14,-70c0,0 14,-17.565 14,-28c0,-18.667 -44,-130 -44,-130Z" fill="#00A1E0" />
          </marker>
        </defs>
        <g key="2" className="marks" style={{ cursor: 'grab' }}>
          {/* {void projection.translate([zoomTransform.x, zoomTransform.y])} */}
          {/* {projection.rotate([MousePosition.x + 30 / 60, -MousePosition.y, 0])} */}
          <path key="3" className="sphere" d={path({ type: 'Sphere' }) || undefined} />
          <path key="4" className="graticule" d={path(graticule()) || undefined} stroke='#ddd' />
          {/* <path className="rivers" d={path({ }) || undefined} stroke='#ddd' /> */}

          {
            localData.land.features.map((feature: d3.GeoPermissibleObjects, index: number) => (
              <path key={"5+" + index} className="feature" fill="#eee" d={path(feature) || undefined} stroke='#bbb' />
            ))
          }
          <path key="6" className="interiors" d={path(localData.interiors) || undefined} stroke='#bbb' />

          {!isMoving && (
            <>
              <path key="8" fill="none" stroke="#999" d={path(worldData) || undefined} />

              {showGhostLines && <AllData projection={projection} />}

              {thePaths.map((pathEntry, index) => {
                const positions: number[][] = []
                for (let i = 0; i < pathEntry.coords.length; i += 2) {
                  positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
                }

                return (<path key={"17+" + index} fill='none' stroke={getStrokeColor(pathEntry, "#00A1E0")} opacity={0.8} d={path({
                  type: "LineString",
                  coordinates: positions
                }) || undefined} markerEnd="url(#dragon)" markerUnits={2}><title>{`${pathEntry.bookIndex! + 1}.${pathEntry.chapterIndex} \n${pathEntry.labelName.split(':')[1]}`}</title></path>)
              })}
              {theImpliedPaths.map((pathEntry, index) => {

                const positions: number[][] = []
                for (let i = 0; i < pathEntry.coords.length; i += 2) {
                  positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
                }

                return (<path key={"7+" + index} fill='none' stroke={getStrokeColor(pathEntry, '#004966')} opacity={0.7} strokeDasharray='6' d={path({
                  type: "LineString",
                  coordinates: positions
                }) || undefined} markerEnd="url(#dragon)" markerUnits={2}><title>{`${pathEntry.bookIndex! + 1}.${pathEntry.chapterIndex} \n${pathEntry.labelName.split(':')[1]}`}</title></path>)
              })}
              {theRegions.map((region, index) => {

                const regional = geoRefs[region?.file ?? ''] || null
                return (<path key={"8+" + index} fill='none' stroke='#001D4A' d={path(regional) || undefined} ><title>{`${region.bookIndex! + 1}.${region.chapterIndex} \n${region.labelName.split(':')[1]}`}</title></path>)
              })}
              {thePoints.map((point, index) => {
                if (!projection.invert) {
                  return null
                }
                const invertedProj = projection.invert([600, 300]) as [number, number];
                const gdist = d3.geoDistance([point.coords[1], point.coords[0]], invertedProj);
                return gdist < 1.57 ? (
                  <circle
                    key={"116+" + index}
                    transform={`translate(${projection([point.coords[1], point.coords[0]])})`}
                    r={5}
                    fill={getStrokeColor(point, "#00A1E0")}
                    opacity={0.8}
                    stroke='#EAF8BF'>
                    <title>{`${point.bookIndex! + 1}.${point.chapterIndex} \n${point.labelName.split(':')[1]}`}</title>
                  </circle>
                ) : null
              })
              }
            </>)}

        </g>
        <g transform={`translate(750, 495 )`}>
          <rect fill='aliceblue' width={320} stroke='none' height={20} y={-12} />
          <text fill='grey' stroke="none" style={{ fontSize: '8px' }}> historical country border data from <a href='https://www.openstreetmap.org/copyright' style={{ fill: 'blue' }} target="_blank" rel="noopener noreferrer">
            OpenStreetMap
          </a>
            - 2025-03-30</text>
        </g>
      </svg>
      <TheSlider handleChange={setRange} />
    </>
  );
});

const AllData = memo(({ projection }: { projection: d3.GeoProjection }) => {
  const allPoints = getPoints();
  const allPaths = getPaths();
  const allImpliedPaths = getImpliedPaths();
  const allRegions = getRegions();
  const path = d3.geoPath(projection);

  return <>
    {allPaths.map((pathEntry, index) => {

      const positions: number[][] = []
      for (let i = 0; i < pathEntry.coords.length; i += 2) {
        positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
      }

      return (<path key={"26+" + index} fill='none' stroke={getStrokeColor(pathEntry, "#B1B1D3")} opacity={0.4} d={path({
        type: "LineString",
        coordinates: positions
      }) || undefined} />)
    })}
    {allImpliedPaths.map((pathEntry, index) => {

      const positions: number[][] = []
      for (let i = 0; i < pathEntry.coords.length; i += 2) {
        positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
      }

      return (<path key={"27+" + index} fill='none' stroke={getStrokeColor(pathEntry, '#B1B1D3')} opacity={0.4} strokeDasharray='6' d={path({
        type: "LineString",
        coordinates: positions
      }) || undefined} />)
    })}
    {allRegions.map((region, index) => {

      const regional = geoRefs[region?.file ?? ''] || null
      return (<path key={"28+" + index} fill='none' stroke='#001D4A' d={path(regional) || undefined} opacity={0.25} />)
    })}
    {allPoints.map((point, index) => {
      if (!projection.invert) {
        return null
      }
      const invertedProj = projection.invert([600, 300]) as [number, number];
      const gdist = d3.geoDistance([point.coords[1], point.coords[0]], invertedProj);
      return gdist < 1.57 ? (
        <circle
          key={"26+" + index}
          transform={`translate(${projection([point.coords[1], point.coords[0]])})`}
          r={5}
          fill={getStrokeColor(point, "#B1B1D3")}
          opacity={0.25}
          stroke='none'>
          <title>{`${point.bookIndex! + 1}.${point.chapterIndex} \n${point.labelName.split(':')[1]}`}</title>
        </circle>
      ) : null
    })
    }
  </>
})