import { memo, SVGProps } from "react";
import { useQuery, useWorldDataStore } from "../../stores";
import { useDataPointsStore } from "../../stores/DataPointsStore";
import { getStrokeColor, geoRefs, isBehindGlobe } from "../utils";
import { AllData } from "./GhostLines";
import { FunnyEntry } from "../types";

export const BookMapParts = memo(function BookMapParts({
  projection,
  path,
}: {
  projection: d3.GeoProjection;
  path: any;
}) {
  const locations = useDataPointsStore((s) => s.locations);
  const ghostLinesEnabled = useWorldDataStore((s) => s.ghostLinesEnabled);
  const query = useQuery((s) => s.query);

  const thePoints = locations.filter((label) => label.type === "point");
  const thePaths = locations.filter(
    (label) => label.type === "path" && !label.centrality
  );
  const theImpliedPaths = locations.filter(
    (label) => label.type === "path" && !!label.centrality
  );
  const theRegions = locations.filter((label) => label.type === "region");

  return (
    <>
      {ghostLinesEnabled && <AllData projection={projection} path={path} />}
      {thePaths.map((pathEntry, index) => {
        const positions: number[][] = [];
        for (let i = 0; i < pathEntry.coords.length; i += 2) {
          positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
        }
        return (
          <APath
            pathEntry={pathEntry}
            path={path}
            positions={positions}
            key={"17+" + index}
            stroke={
              query === "default"
                ? getStrokeColor(pathEntry, "#699aaa")
                : "#c2b8b3"
            }
          />
        );
      })}
      {theImpliedPaths.map((pathEntry, index) => {
        const positions: number[][] = [];
        for (let i = 0; i < pathEntry.coords.length; i += 2) {
          positions.push([pathEntry.coords[i + 1], pathEntry.coords[i]]);
        }
        return (
          <APath
            pathEntry={pathEntry}
            path={path}
            positions={positions}
            key={"7+" + index}
            stroke={
              query === "default"
                ? getStrokeColor(pathEntry, "#699aaa")
                : "#c2b8b3"
            }
            opacity={0.7}
            strokeDasharray="6"
          />
        );
      })}
      {theRegions.map((region, index) => {
        const regional = geoRefs[region?.file ?? ""] || null;
        return (
          <path
            key={"8+" + index}
            fill="none"
            stroke="#6d654b"
            d={path(regional) || undefined}
          >
            <title>{`${region.bookIndex! + 1}.${region.chapterIndex} \n${
              region.labelName.split(":")[1]
            }`}</title>
          </path>
        );
      })}
      {thePoints.map((point, index) => {
        if (isBehindGlobe(point.coords, projection)) {
          return null;
        }
        const [x, y] = projection([point.coords[1], point.coords[0]]) ?? [0, 0];
        return (
          <circle
            key={"116+" + index}
            cx={x}
            cy={y}
            r={5}
            fill={
              query === "default" ? getStrokeColor(point, "#699aaa") : "#c2b8b3"
            }
            opacity={1}
            stroke="#e6edd0"
            style={{
              cursor: "pointer",
            }}
          >
            <title>{`${point.bookIndex! + 1}.${point.chapterIndex} \n${
              point.labelName.split(":")[1]
            }`}</title>
          </circle>
        );
      })}
    </>
  );
});

interface PathStuff extends SVGProps<SVGPathElement> {
  pathEntry: FunnyEntry;
  path: any;
  positions: number[][];
}

const APath = (props: PathStuff) => {
  const { pathEntry, path, positions, ...rest } = props;

  return (
    <path
      fill="none"
      strokeWidth="1.5px"
      opacity={0.8}
      d={
        path({
          type: "LineString",
          coordinates: positions,
        }) || undefined
      }
      markerEnd={pathEntry.char !== "Laurence" ? "url(#dragon)" : ""}
      style={{
        cursor: "pointer",
      }}
      {...rest}
    >
      <title>{`${pathEntry.bookIndex! + 1}.${pathEntry.chapterIndex} \n${
        pathEntry.labelName.split(":")[1]
      }`}</title>
    </path>
  );
};
