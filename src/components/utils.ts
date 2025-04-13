import { pointers } from "d3-selection";
import {
  bluem,
  chiku,
  cumbr,
  derbys,
  monm,
  northu,
  southy,
  taklam,
  world100,
  world2000,
} from "../data/maps/topos";
import * as topojson from "topojson-client";
import chapter_labels from "../data/points_and_paths/chapter_labels";
import {
  Chapterus,
  book,
  ChapterType,
  bookPosition,
  FunnyEntry,
} from "./types";
import * as d3 from "d3";
import { useState, useEffect } from "react";

export function getChapterName(namestring: string) {
  const dictionary = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
    "twenty",
    "twentyone",
    "twentytwo",
  ];
  const allParts = namestring.split(" ");
  let lastPart = allParts[allParts.length - 1];
  if (dictionary.includes(lastPart.toLowerCase())) {
    lastPart = (dictionary.indexOf(lastPart.toLowerCase()) + 1).toString();
  }
  const shortName = lastPart.length > 2 ? lastPart[0].toUpperCase() : lastPart;
  return shortName;
}

export function getBookPosition(globalChapterIndex?: number) {
  return globalChapterIndex ? getChapterList()[globalChapterIndex] : undefined;
}

// MAP functions

export const useWorldData = () => {
  const [data, setData] = useState<any>(null);
  const json110Url = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";
  const json50Url = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

  useEffect(() => {
    d3.json(json110Url)
      .then((topojsonData: any) => {
        const { land } = topojsonData.objects;
        return {
          land: topojson.feature(topojsonData, land),
          interiors: null, //mesh(topojsonData, countries, (a, b) => a !== b)
        };
      })
      .then((hundredData) => {
        d3.json(json50Url).then((topojsonData: any) => {
          const { land } = topojsonData.objects;
          setData({
            hundred: hundredData,
            fifty: {
              land: topojson.feature(topojsonData, land),
              interiors: null, //mesh(topojsonData, countries, (a, b) => a !== b)
            },
          });
        });
      });
  }, []);
  return data;
};

export function getPointerCoords<E, Ev>(
  nodeEl: E,
  zoomEv: Ev
): [number, number] {
  var avg = function avg(vals: number[]) {
    return (
      vals.reduce(function (agg, v) {
        return agg + v;
      }, 0) / vals.length
    );
  };
  var pointers$1 = pointers(zoomEv, nodeEl);
  if (pointers$1 && pointers$1.length > 1) {
    return [avg(pointers$1.map((t) => t[0])), avg(pointers$1.map((t) => t[1]))];
  } else if (pointers$1.length > 0) {
    return pointers$1[0];
  } else {
    return [0, 0];
  }
}

function getAllCoords() {
  const books = chapter_labels.books as book[];

  const theLocLabels: FunnyEntry[] = [];
  books.forEach((book, bookI) => {
    book.chapters.forEach((chapter) => {
      const localLabels: FunnyEntry[] = [...chapter.locLabels];
      localLabels.forEach((entry) => {
        entry.chapterIndex = chapter.index;
        entry.bookIndex = bookI;
      });

      theLocLabels.push(...localLabels);
    });
  });
  return theLocLabels;
}

function isInRange(
  label: FunnyEntry,
  options?: {
    start?: bookPosition;
    end?: bookPosition;
    positionList?: bookPosition[];
  }
): boolean {
  if (
    options?.start &&
    (label.bookIndex || label.bookIndex === 0) &&
    (label.chapterIndex || label.chapterIndex === 0)
  ) {
    if (
      label.bookIndex < options.start.bookIndex ||
      (label.bookIndex === options.start.bookIndex &&
        label.chapterIndex < options.start.chapterIndex)
    ) {
      return false;
    }
  }
  if (
    options?.end &&
    (label.bookIndex || label.bookIndex === 0) &&
    (label.chapterIndex || label.chapterIndex === 0)
  ) {
    if (
      label.bookIndex > options.end.bookIndex ||
      (label.bookIndex === options.end.bookIndex &&
        label.chapterIndex > options.end.chapterIndex)
    ) {
      return false;
    }
  }
  if (options?.positionList && options?.positionList?.length > 0) {
    if (
      !options.positionList.find(
        (position) =>
          position.bookIndex === label.bookIndex &&
          position.chapterIndex === label.chapterIndex
      )
    ) {
      return false;
    }
  }
  return true;
}

export function getPoints(options?: {
  start?: bookPosition;
  end?: bookPosition;
  positionList?: bookPosition[];
}) {
  return getAllCoords().filter(
    (label) => label.type === "point" && isInRange(label, options)
  );
}

export function getPaths(options?: {
  start?: bookPosition;
  end?: bookPosition;
  positionList?: bookPosition[];
}) {
  return getAllCoords().filter(
    (label) =>
      label.type === "path" && !label.centrality && isInRange(label, options)
  );
}

export function getImpliedPaths(options?: {
  start?: bookPosition;
  end?: bookPosition;
  positionList?: bookPosition[];
}) {
  return getAllCoords().filter(
    (label) =>
      label.type === "path" && !!label.centrality && isInRange(label, options)
  );
}

export function getRegions(options?: {
  start?: bookPosition;
  end?: bookPosition;
  positionList?: bookPosition[];
}) {
  return getAllCoords().filter(
    (label) => label.type === "region" && isInRange(label, options)
  );
}

export function getChapterList(): Chapterus[] {
  const books = chapter_labels.books as book[];

  const theChapters: Chapterus[] = [];
  books.forEach((book, bookI) => {
    book.chapters.forEach((chapter) => {
      theChapters.push({
        bookIndex: bookI,
        chapterIndex: chapter.index,
        name: chapter.name,
        type: chapter.type as ChapterType,
      });
    });
  });
  return theChapters;
}

export function getStrokeColor(pathEntry: FunnyEntry, defaultColor?: string) {
  if (pathEntry.char) {
    if (pathEntry.char === "Laurence") {
      return "#27476E";
    }
    if (pathEntry.char === "Temeraire") {
      return "#eca400";
    }
  }

  return defaultColor ?? "gray";
}

// MAP Data statics

function topojsonFeature(a: any, b: any) {
  return topojson.feature(a, b);
}

export const geoRefs: Record<string, any> = {
  "export_MonmouthShire.geojson": topojsonFeature(
    monm,
    monm.objects.export_MonmouthShire
  ),
  "export_Chikuzen.geojson": topojsonFeature(
    chiku,
    chiku.objects.export_Chikuzen
  ),
  "export_BlueMountainsMunicipality.geojson": topojsonFeature(
    bluem,
    bluem.objects.export_BlueMountainsMunicipality
  ),
  "export_Cumbria.geojson": topojsonFeature(
    cumbr,
    cumbr.objects.export_Cumbria
  ),
  "export_Northumberland.geojson": topojsonFeature(
    northu,
    northu.objects.export_Northumberland
  ),
  "export_SouthYorkshire.geojson": topojsonFeature(
    southy,
    southy.objects.export_SouthYorkshire
  ),
  "export_taklamakan.geojson": topojsonFeature(
    taklam,
    taklam.objects.export_taklamakan
  ),
  "export_Derbyshire.geojson": topojsonFeature(
    derbys,
    derbys.objects.export_Derbyshire
  ),
};

export const w100 = topojsonFeature(
  world100,
  world100.objects.export_world_territories1825
);
export const w2000 = topojsonFeature(
  world2000,
  world2000.objects.export_world_territories1825
);
