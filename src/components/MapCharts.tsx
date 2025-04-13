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
      <GhostPointButton handleClick={() => setShowGhostLines(s => !s)} />
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
        <g key="2" className="marks" >
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
                }) || undefined} />)
              })}
              {theImpliedPaths.map((pathEntry, index) => {

                const positions: number[][] = []
                for (let i = 0; i < pathEntry.coords.length; i += 2) {
                  positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
                }

                return (<path key={"7+" + index} fill='none' stroke={getStrokeColor(pathEntry, '#004966')} opacity={0.7} strokeDasharray='6' d={path({
                  type: "LineString",
                  coordinates: positions
                }) || undefined} />)
              })}
              {theRegions.map((region, index) => {

                const regional = geoRefs[region?.file ?? ''] || null
                return (<path key={"8+" + index} fill='none' stroke='#001D4A' d={path(regional) || undefined} />)
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