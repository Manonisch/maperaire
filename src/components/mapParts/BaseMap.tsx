import * as d3 from "d3"; 
import { memo } from "react";
import { useWorldDataStore } from "../../stores/WorldDataStore";
import { w2000 } from "../utils";

export const OSMLink = memo(function OSMLink() {
  return (
    <g transform={`translate(750, 495 )`}>
      <rect fill='#F3E9DF' width={320} stroke='none' height={20} y={-12} />
      <text fill='grey' stroke="none" style={{ fontSize: '8px' }}> historical country border data from <a href='https://www.openstreetmap.org/copyright' style={{ fill: 'maroon' }} target="_blank" rel="noopener noreferrer">
        OpenStreetMap
      </a>
        - 2025-03-30</text>
    </g>
  )
})

export const BaseMap = memo(function BaseMap({ path, isMoving }: { path: any, isMoving: boolean }) {
  const data = useWorldDataStore(s => s.worldData)
  const graticule = d3.geoGraticule();

  if (!data) {
    return <></>
  }

  return (
    <>
      {/* {void projection.translate([zoomTransform.x, zoomTransform.y])} */}
      {/* {projection.rotate([MousePosition.x + 30 / 60, -MousePosition.y, 0])} */}
      <path key="3" className="sphere" d={path({ type: 'Sphere' }) || undefined} />
      <path key="4" className="graticule" d={path(graticule()) || undefined} stroke='#ccc' />
      {/* <path className="rivers" d={path({ }) || undefined} stroke='#ddd' /> */}
      {isMoving ?
        data.hundred.land.features.map((feature: d3.GeoPermissibleObjects, index: number) => (
          <path key={"5+" + index} className="feature" fill='#dfd6c9' d={path(feature) || undefined} stroke='#c9c2af' strokeWidth={6} strokeLinejoin='round' />
        )) :
        data.fifty.land.features.map((feature: d3.GeoPermissibleObjects, index: number) => (
          <path key={"5+" + index} className="feature" fill='#dfd6c9' d={path(feature) || undefined} stroke='#c9c2af' strokeWidth={6} strokeLinejoin='round' />
        ))
      }
      {isMoving ?
        data.hundred.land.features.map((feature: d3.GeoPermissibleObjects, index: number) => (
          <path key={"5+" + index} className="feature" fill='#F3E9DF' d={path(feature) || undefined} stroke='#bbb' />
        )) :
        data.fifty.land.features.map((feature: d3.GeoPermissibleObjects, index: number) => (
          <path key={"5+" + index} className="feature" fill='#F3E9DF' d={path(feature) || undefined} stroke='#bbb' />
        ))
      }
      {!isMoving && (
        <path key="8" fill="none" stroke="#999" d={path(w2000) || undefined} filter="url(#shadow)" />)}
    </>
  )
})