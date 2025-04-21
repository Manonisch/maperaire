# maperaire
Interactive Map Project for the Temeraire books by Naomi Novik.
Try it out [here](https://manonisch.github.io/maperaire/)

## Features
- Shows a world map showcasing the (aproximated) locations mentioned over the course of the books.
- Implied routes taken to get characters from named places in the book to the next are added as dashed lines
- Simple Tooltip while hovering over routes and points

Available Filter Methods
- On a per chapter basis via the bottom chapter slider bar.
- Depending on pre-filtered queries via the select in the topbar.

## Note

Locations and paths were manually selected by the authors best approximation depending on the descriptions in the books. If you see any errors or would like to suggest more detailed paths or points or features, please send me a message or contact me via the 'issues' tab.

## Coming Soon

I started this map, as a base visualisation to show specific map based data from the Temeraire books. Now that the base is done, I aim to add multiple interactive overlays showcasing different datasets manually queried from the books. 

The current project is the 'Food' project, exploring which foods were explicitly mentioned to be devoured by Temeraire during the course of the service. The projects base visualisation and base filter mechanisms have been added and will now be enhanced with extra visualisation features.

## Other interesting stuff

* [Planned Todos](OPENISSUES.md)
* [How to prepare topojson data for maps](TECHNOTES.md)

## Sources

### The underlying world map data, as well as region boundaries were queried using the following sources:

- Historical country boundaries & Chikuzen Province Boundaries: OpenHistoricalMap contributors
- The above + other province and area boundaries:
        [OpenStreetMap 2025-03-30](https://www.openstreetmap.org/copyright)
        
- World land & water mass data and topojson boundaries:
        [World Atlas Topojson](https://github.com/topojson/world-atlas) - Copyright 2013-2019 Michael Bostock
        [ISC License](https://github.com/topojson/world-atlas?tab=ISC-1-ov-file)

### The interactive Map is build using d3js visualisation library and multiple sister libraries:

  - [Versor](https://github.com/d3/versor) - Copyright 2013-2021 Mike Bostock 
        Licenses: [ISC License](https://github.com/d3/versor?tab=ISC-1-ov-file), [GPL-3.0 license](https://github.com/d3/versor?tab=GPL-3.0-2-ov-file)
      
  - [topojson-client](https://github.com/topojson/topojson-client) - Copyright 2012-2019 Michael Bostock
        [ISC License](https://github.com/topojson/topojson-client?tab=ISC-1-ov-file)
      
  - [d3-geoprojection](https://github.com/d3/d3-geoprojection) - Copyright 2013-2021 Mike Bostock
        [LicenseText](https://github.com/d3/d3-geo-projection?tab=License-1-ov-file#)
      
  -  topojson data converted using [topojson-server](https://github.com/topojson/topojson-server) - Copyright 2012-2019 Michael Bostock - 
        [ISC License](https://github.com/topojson/topojson-server?tab=ISC-1-ov-file)
      
  - [d3-selection](https://github.com/d3/d3-selection) - Copyright 2010-2021 Mike Bostock
        [ISC License](https://github.com/d3/d3-selection?tab=ISC-1-ov-file#)
      
  - [d3-geo-zoom](https://github.com/vasturiano/d3-geo-zoom) - Copyright (c) 2017 Vasco Asturiano
        [MIT License](https://github.com/vasturiano/d3-geo-zoom?tab=MIT-1-ov-file#)
      
  - [d3](https://github.com/d3/d3) - Copyright 2010-2023 Mike Bostock
        [ISC License](https://github.com/d3/d3?tab=ISC-1-ov-file#)
      

### The project itself was build using vite and react library, on a [pnpm](https://github.com/pnpm/pnpm) and [nodejs](https://github.com/nodejs/node) base:
  -  [Vite](https://github.com/vitejs/vite) - Copyright (c) 2019-present, VoidZero Inc. and Vite contributors
        [MIT License](https://github.com/vitejs/vite?tab=MIT-1-ov-file#)
      
  - [React](https://github.com/facebook/react) - Copyright (c) Meta Platforms, Inc. and affiliates.
        [MIT License](https://github.com/facebook/react?tab=MIT-1-ov-file#)
      

