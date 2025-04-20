import { MapLink } from "../components/links/MapLink";

export function SourcesView() {
  return <div style={{ width: '80vw', height: '100vh', margin: 'auto', padding: '32px', zIndex: '1', position: 'relative' }}>
    <MapLink />
    <h1> Used Sources & Licenses Overview</h1>
    <h2> Interactive Data Sources </h2>
    <ul>
      <li>
        Non-map data shown is based on the Temeraire book series by Naomi Novik - Temeraire copyright Naomi Novik
      </li>
    </ul>
    <h2> Map Data Sources </h2>
    <ul>
      <li>
        Historical country boundaries & Chikuzen Province Boundaries: OpenHistoricalMap contributors
      </li>
      <li>
        The above + other province and area boundaries:
        <a href='https://www.openstreetmap.org/copyright' target="_blank" rel="noopener noreferrer">
          OpenStreetMap
        </a>
        - 2025-03-30
      </li>
      <li>
        World land & water mass data and topojson boundaries:
        <a href='https://github.com/topojson/world-atlas' target="_blank" rel="noopener noreferrer">
          World Atlas TopoJSON
        </a> - Copyright 2013-2019 Michael Bostock
        License: <a href='https://github.com/topojson/world-atlas?tab=ISC-1-ov-file'>ISC License</a>
      </li>
    </ul>
    <h2> Packages used</h2>
    <ul>
      <li>
        <a href='https://github.com/d3/versor'>Versor</a> - Copyright 2013-2021 Mike Bostock
        Licenses: <a href='https://github.com/d3/versor?tab=ISC-1-ov-file'>ISC License</a>, <a href='https://github.com/d3/versor?tab=GPL-3.0-2-ov-file'>GPL-3.0 license</a>
      </li>
      <li>
        <a href='https://github.com/topojson/topojson-client'>topojson-client</a> - Copyright 2012-2019 Michael Bostock
        Licenses: <a href='https://github.com/topojson/topojson-client?tab=ISC-1-ov-file'>ISC License</a>
      </li>
      <li>
        <a href='https://github.com/d3/d3-geoprojection'>d3-geoprojection</a> - Copyright 2013-2021 Mike Bostock
        Licenses: <a href='https://github.com/d3/d3-geo-projection?tab=License-1-ov-file#'>Licensetext</a>
      </li>
      <li> topojson data converted using
        <a href='https://github.com/topojson/topojson-server'>topojson-server</a> - Copyright 2012-2019 Michael Bostock
        Licenses: <a href='https://github.com/topojson/topojson-server?tab=ISC-1-ov-file'>ISC License</a>
      </li>
      <li>
        <a href='https://github.com/d3/d3-selection'>d3-selection</a> - Copyright 2010-2021 Mike Bostock
        Licenses: <a href='https://github.com/d3/d3-selection?tab=ISC-1-ov-file#'>ISC</a>
      </li>
      <li>
        <a href='https://github.com/vasturiano/d3-geo-zoom'>d3-geo-zoom</a> - Copyright (c) 2017 Vasco Asturiano
        Licenses: <a href='https://github.com/vasturiano/d3-geo-zoom?tab=MIT-1-ov-file#'>MIT</a>
      </li>
      <li>
        <a href='https://github.com/d3/d3'>d3</a> - Copyright 2010-2023 Mike Bostock
        Licenses: <a href='https://github.com/d3/d3?tab=ISC-1-ov-file#'>ISC License</a>
      </li>
      <li>
        <a href='https://github.com/vitejs/vite'>Vite</a> - Copyright (c) 2019-present, VoidZero Inc. and Vite contributors
        Licenses: <a href='https://github.com/vitejs/vite?tab=MIT-1-ov-file#'>MIT</a>
      </li>
      <li>
        <a href='https://github.com/facebook/react'>React</a> - Copyright (c) Meta Platforms, Inc. and affiliates.
        Licenses: <a href='https://github.com/facebook/react?tab=MIT-1-ov-file#'>MIT</a>
      </li>
    </ul>
  </div>
}