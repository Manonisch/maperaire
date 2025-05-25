import * as d3 from "d3";
import { create } from "zustand";

type MapType = "globe" | "flatmap";

export interface MapStore {
  mapType: MapType;
  toggleMapType(): void;
  isVisible(coords: number[] | undefined, projection: d3.GeoProjection, log?: boolean): boolean;
}

export const useMap = create<MapStore>((set, get) => ({
  mapType: "flatmap",
  toggleMapType: () => {
    const mapType = get().mapType === 'globe' ? 'flatmap' : 'globe';
    set({ mapType });
  },
  isVisible: (coords: number[] | undefined, projection: d3.GeoProjection, log?: boolean) => {
    if (get().mapType !== 'globe') {
        return true;
    }
    if (!coords) {
        return true;
    }
    const r = projection.rotate();
    const gdist = d3.geoDistance([coords[1], coords[0]], [-r[0], -r[1]]);
    return gdist < 1.57;
  }
}));
