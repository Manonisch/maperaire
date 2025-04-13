import { useState, useEffect, useRef, useCallback, useMemo, memo, MouseEvent, ChangeEvent } from "react";
import * as d3 from 'd3';
import versor from 'versor';
import { w2000, w100, getPointerCoords, geoRefs, getChapterName, getChapterList, getPaths, getPoints, getRegions, useWorldData, getBookPosition, getImpliedPaths } from "./utils";
import { bookPosition, FunnyEntry } from "./types";
import { SourcesLink } from "./SourcesLink";
import { BookPosition, queryRefs, useQuery } from "../stores/QueryStore";

export function TheMapChart() {
  const [filterData, setFilterData] = useState<BookPosition[]>([])

  // const filteredData = prepareFilteredData();
  const worldData = useWorldData();
  const query = useQuery(s => s.query)
  // const filterdata = queryRefs[query] ?? []
  const queryArray = Object.entries(queryRefs);

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setFilterData(queryRefs[event.target.value] ?? []);
  }, [])

  if (!worldData) {
    return <div>'Loading'</div>
  }

  return <div>
    <div className="w-full h-[40px] flex" style={{ width: '100%', height: '40px', display: 'flex' }}> <SourcesLink /> <select onChange={handleChange}>{queryArray.map(entry => {
      return (<option key={'option' + entry[0]} value={entry[0]}>{entry[0]}</option>)
    })}</select></div>
    <Marks data={worldData} filterData={filterData} />
  </div>
}

export const Marks = memo(({ data, filterData }: { data: { fifty: { land: any, interiors: any }, hundred: { land: any, interiors: any } }, filterData?: bookPosition[] }) => {
  const [localData, setLocalData] = useState(data.fifty)
  const [worldData, setWorldData] = useState(w2000) // TODO either world1825-100 or world1825-2000
  const [isMoving, setIsMoving] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState<number | undefined>(undefined)

  // const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  // const [localPath, setLocalPath] = useState(d3.geoPath(projection))
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
        // setProjection(projection);
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
          {/* <path className="rivers" d={path(graticule()) || undefined} stroke='#ddd' /> */}

          {
            localData.land.features.map((feature: d3.GeoPermissibleObjects, index: number) => (
              <path key={"5+" + index} className="feature" fill="#eee" d={path(feature) || undefined} stroke='#bbb' />
            ))
          }
          <path key="6" className="interiors" d={path(localData.interiors) || undefined} stroke='#bbb' />
          {!isMoving && <path key="8" fill="none" stroke="#999" d={path(worldData) || undefined} />}

          {!isMoving && thePaths.map((pathEntry, index) => {

            const positions: number[][] = []
            for (let i = 0; i < pathEntry.coords.length; i += 2) {
              positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
            }

            return (<path key={"17+" + index} fill='none' stroke={getStrokeColor(pathEntry, "#00A1E0")} opacity={0.8} d={path({
              type: "LineString",
              coordinates: positions
            }) || undefined} />)
          })}
          {!isMoving && theImpliedPaths.map((pathEntry, index) => {

            const positions: number[][] = []
            for (let i = 0; i < pathEntry.coords.length; i += 2) {
              positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
            }

            return (<path key={"7+" + index} fill='none' stroke={getStrokeColor(pathEntry, '#004966')} opacity={0.7} strokeDasharray='6' d={path({
              type: "LineString",
              coordinates: positions
            }) || undefined} />)
          })}
          {!isMoving && theRegions.map((region, index) => {

            const regional = geoRefs[region?.file ?? ''] || null
            return (<path key={"8+" + index} fill='none' stroke='#001D4A' d={path(regional) || undefined} />)
          })}
          {
            !isMoving && thePoints.map((point, index) => {
              if (!projection.invert) {
                return null
              }
              const foo = projection.invert([600, 300]) as [number, number];
              const gdist = d3.geoDistance([point.coords[1], point.coords[0]], foo);
              return gdist < 1.57 ? (
                <circle
                  key={"116+" + index}
                  transform={`translate(${projection([point.coords[1], point.coords[0]])})`}
                  r={5}
                  fill={getStrokeColor(point, "#00A1E0")}
                  opacity={0.8}
                  stroke='#EAF8BF'>
                  <title>{`${point.bookIndex! + 1}.${point.chapterIndex} \n${point.labelName}`}</title>
                </circle>
              ) : null
            })
          }
        </g>
      </svg>
      <TheSlider handleChange={setRange} />
    </>
  );
});

function getStrokeColor(pathEntry: FunnyEntry, defaultColor?: string) {

  if (pathEntry.char) {
    if (pathEntry.char === 'Laurence') {
      return '#27476E'
    }
    if (pathEntry.char === 'Temeraire') {
      return '#eca400'
    }
  }

  return defaultColor ?? 'gray';
}

const TheSlider = memo(function TheSlider({ handleChange }: { handleChange: ({ theStart, theEnd }: { theStart: number, theEnd: number }) => void }) {
  const height = 70;
  const width = 1500;
  const margin = 10;

  const data = getChapterList();
  const data_last = data.length == 0 ? 0 : data.length - 1;

  const [onTheMove, setOnTheMove] = useState<'left' | 'right' | 'slider' | undefined>();
  const [leftSliderPos, setLeftSliderPos] = useState<number>(10);
  const [rightSliderPos, setRightSliderPos] = useState<number>(width - 10);
  const [leftRange, setLeftRange] = useState<number>(0);
  const [rightRange, setRightRange] = useState<number>(data.length - 1);

  const xScale = d3.scaleLinear([0, data_last], [margin, width - margin]).clamp(true);

  const handleMouseMove = useCallback((event: MouseEvent<SVGSVGElement>) => {
    if (onTheMove) {
      const theNumber = Math.round(xScale.invert(event.clientX - 38));
      const theTickPos = xScale(theNumber);

      if (onTheMove === 'left' && event.clientX - 38 < rightSliderPos) {
        setLeftSliderPos(event.clientX - 38)
        if (theNumber && leftRange !== theTickPos) {
          setLeftRange(theNumber);
          // handleChange({ theStart: leftRange, theEnd: theNumber })
        }
      }
      if (onTheMove === 'right' && event.clientX - 38 > leftSliderPos) {
        setRightSliderPos(event.clientX - 38)
        if (theNumber && rightRange !== theTickPos) {
          setRightRange(theNumber);
          // handleChange({ theStart: theNumber, theEnd: rightRange })
        }
      }
      if (onTheMove === 'slider') {
        setLeftSliderPos(leftSliderPos + event.movementX);
        setRightSliderPos(rightSliderPos + event.movementX);
        setLeftRange(Math.round(xScale.invert(leftSliderPos + event.movementX)));
        setRightRange(Math.round(xScale.invert(rightSliderPos + event.movementX)));
        // handleChange({ theStart: Math.round(xScale.invert(leftSliderPos + event.movementX)), theEnd: Math.round(xScale.invert(rightSliderPos + event.movementX)) })
      }
      event.preventDefault();
    }
  }, [xScale, rightSliderPos, leftSliderPos, leftRange, rightRange, onTheMove]);

  const handleMouseUp = useCallback((event: MouseEvent<SVGSVGElement>) => {
    if (onTheMove) {
      const theNumber = Math.round(xScale.invert(event.clientX - 38));
      const theTickPos = xScale(theNumber);

      if (onTheMove === 'left') {
        setLeftSliderPos(theTickPos)
        setLeftRange(theNumber);
        handleChange({ theStart: theNumber, theEnd: rightRange })

      }
      if (onTheMove === 'right') {
        setRightSliderPos(theTickPos)
        setRightRange(theNumber)
        handleChange({ theStart: leftRange, theEnd: theNumber })
      }
      if (onTheMove === 'slider') {
        const theLeftNumber = Math.round(xScale.invert(leftSliderPos));
        const theRightNumber = Math.round(xScale.invert(rightSliderPos));
        setRightRange(theRightNumber);
        setLeftRange(theLeftNumber);
        handleChange({ theStart: theLeftNumber, theEnd: theRightNumber })
      }

    }
    setOnTheMove(undefined)
  }, [onTheMove, leftRange, rightRange, rightSliderPos, leftSliderPos])

  return <svg
    width='95vw'
    height={height}
    stroke="gray"
    fill="none"
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    style={{ display: 'block', margin: 'auto' }}
  >
    <TheTicks />
    <g key='elem' id='the-element'
      onMouseDown={() => {
        setOnTheMove('slider');
      }}
    >
      <rect x={leftSliderPos} y={15} width={rightSliderPos - leftSliderPos} height={25} fill="blue" fillOpacity={0.2} stroke="none" />
    </g>
    <g key='left slider' id='left-slider'
      onMouseDown={(event: MouseEvent<SVGSVGElement>) => {
        event.preventDefault();
        setOnTheMove('left')
      }}
      transform={`translate(${leftSliderPos}, 15)`}>
      <line y2={30} stroke='blue' strokeWidth={'5px'} />
      <text style={{
        fontSize: "10px",
        textAnchor: "middle",
        cursor: 'ew-resize'
      }}>{data[leftRange].bookIndex + 1 + '.' + getChapterName(data[leftRange]?.name)}</text>
    </g>
    <g key='right-slider' id='right-slider'
      onMouseDown={(event: MouseEvent<SVGSVGElement>) => {
        event.preventDefault();
        setOnTheMove('right')
      }}
      transform={`translate(${rightSliderPos}, 15)`}>
      <line y2={30} stroke='blue' strokeWidth={'5px'} />
      <text style={{
        fontSize: "10px",
        textAnchor: "middle",
        cursor: 'ew-resize'
      }}>{data[rightRange].bookIndex + 1 + '.' + getChapterName(data[rightRange]?.name)}</text>
    </g>
  </svg>
})

const TheTicks = memo(() => {
  const TICK_LENGTH = 6;
  const DOUBLE_TICK_LENGTH = 18;
  const width = 1500;
  const margin = 10;

  const data = getChapterList();
  const data_last = data.length == 0 ? 0 : data.length - 1;

  const xScale = d3.scaleLinear([0, data_last], [margin, width - margin]).clamp(true);

  const ticks = useMemo(() => {
    const numberOfTicksTarget = data.length;

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value: (data[value] && value % 3 === 0 || data[value].chapterIndex === 0) ? data[value].bookIndex + 1 + '.' + getChapterName(data[value].name) : '',
      xOffset: xScale(value),
      firstChapter: data[value].chapterIndex === 0
    }));
  }, [xScale, data]);

  return (
    <>
      <line stroke="black" x1={margin} y1={20} x2={width - margin} y2={20} />
      {/* Ticks and labels */}
      {
        ticks.map(({ value, xOffset, firstChapter }, index) => (
          <g key={"10+" + index} transform={`translate(${xOffset}, 20)`}>
            <line y2={firstChapter ? DOUBLE_TICK_LENGTH : TICK_LENGTH} stroke="currentColor" />
            <text
              key={value}
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                transform: firstChapter ? "translateY(45px)" : "translateY(30px)",
              }}
            >
              {value}
            </text>
          </g>
        ))
      }
    </>
  )
})