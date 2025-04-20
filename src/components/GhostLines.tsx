import * as d3 from "d3";
import { memo } from "react";
import { getPoints, getPaths, getImpliedPaths, getRegions, getStrokeColor, geoRefs } from "./utils";

export const AllData = memo(({ projection }: { projection: d3.GeoProjection }) => {
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