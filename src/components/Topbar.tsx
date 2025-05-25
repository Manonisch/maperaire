import { memo, useState, useCallback, ChangeEvent } from "react";
import {
  useQuery,
  queryRefs,
  Querys,
  dataSetMinimizers,
} from "../stores/QueryStore";
import { GhostPointButton } from "./GhostPointButton";
import { SourcesLink } from "./links/SourcesLink";
import { useWorldDataStore } from "../stores/WorldDataStore";
import { useDataPointsStore } from "../stores/DataPointsStore";
import { useFoodMapStore, useSliderStore } from "../stores";
import { useCharacterMapStore } from "../stores/CharacterMapStore";
import { useMap } from "../stores/MapStore";
import { useDragonMapStore } from "../stores/DragonMapStore";
import { FlatmapIcon } from "../assets/flatmapIcon";
import { EarthIcon } from "../assets/earthIcon";

export const TopBar = memo(() => {
  const [ghostyLines, setGhostyLines] = useState(false);
  const chooseQuery = useQuery((s) => s.chooseQuery);
  const minimalizeDataSet = useDataPointsStore((s) => s.minimalizeDataSet);
  const setGhostLinesEnabled = useWorldDataStore((s) => s.setGhostLineEnabled);
  const resetFoodFilters = useFoodMapStore((s) => s.resetFoodFilters);
  const resetCharacterFilters = useCharacterMapStore(
    (s) => s.resetCharacterFilters
  );

  const queryArray = Object.entries(queryRefs);

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const query = event.target.value as Querys;
    resetFoodFilters();
    resetCharacterFilters();
    chooseQuery(query);
    const dataSet = queryRefs[query];
    const minimizers = dataSetMinimizers[query];
    minimalizeDataSet(dataSet, minimizers); // sets MinimalGroupedData
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "40px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <SourcesLink />
      <select
        onChange={handleChange}
        style={{
          height: "26px",
          borderRadius: "6px",
          border: "unset",
          color: "oklch(26.8% 0.007 34.298)",
          margin: "2px",
        }}
      >
        {queryArray.map((entry) => {
          return (
            <option key={"option" + entry[0]} value={entry[0]}>
              {entry[0]}
            </option>
          );
        })}
      </select>
      <GhostPointButton
        handleClick={() => {
          setGhostyLines((s) => !s);
          setGhostLinesEnabled(!ghostyLines);
        }}
        ghostyLines={ghostyLines}
      />
      <MapTypeButton />
      <UsageHint />
      <TriggerUpdateRelevantData />
    </div>
  );
});

//TODO: JUST FOR TESTING
const TriggerUpdateRelevantData = () => {
  const updateRelevantData = useDataPointsStore((s) => s.updateRelevantData);
  const query = useQuery((s) => s.query);
  const foodFilter = useFoodMapStore((s) => s.selectedFoodOptions);
  const prepFilter = useFoodMapStore((s) => s.selectedPrepOptions);
  const characterFilter = useCharacterMapStore(
    (s) => s.selectedCharacterOptions
  );
  const dragonFilter = useDragonMapStore((s) => s.selectedDragonOptions);

  const sliderEnd = useSliderStore((s) => s.end);
  const sliderStart = useSliderStore((s) => s.start);

  updateRelevantData(
    query,
    {
      filter: [foodFilter, prepFilter, characterFilter, dragonFilter].filter(
        (x) => x.length
      ),
    },
    { end: sliderEnd ?? 0, start: sliderStart ?? 0 }
  );
  return <></>;
};

function MapTypeButton() {
  const mapType = useMap((s) => s.mapType);
  const toggleMapType = useMap((s) => s.toggleMapType);

  return (
    <button
      style={{
        height: "26px",
        borderRadius: "6px",
        border: "unset",
        backgroundColor: "#e7e5e4",
        color: "oklch(26.8% 0.007 34.298)",
        margin: "2px",
        paddingInline: '4px'
      }}
      onClick={toggleMapType}
    >
      {
        {
          globe: (
            <span style={{ width: "24px", height: "24px", display: 'inline-block' }}>
              <FlatmapIcon />
            </span>
          ),
          flatmap: (
            <span style={{ width: "24px", height: "24px", display: 'inline-block' }}>
              <EarthIcon />
            </span>

          ),
        }[mapType]
      }
    </button>
  );
}

function UsageHint() {
  return (
    <span
      style={{
        fontSize: "14px",
        color: "#555",
        paddingInlineStart: "10px",
        padding: "4px",
        background: "antiquewhite",
        margin: "2px",
      }}
    >
      <span style={{ fontWeight: "bold" }}>Move the Globe </span>
      by dragging with the mouse, zoom via scroll wheel. Hover on points to
      <span style={{ fontWeight: "bold" }}> see more information</span>. To
      <span style={{ fontWeight: "bold" }}> Filter </span>
      drag and move the handles on the bottom axis.
    </span>
  );
}
