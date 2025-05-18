# maperaire
Interactive Map Project for the Temeraire books by Naomi Novik.
Try it out [here](https://manonisch.github.io/maperaire/)

## The Project
I started this map, as a base visualisation to show specific map based data from the Temeraire books. Now that the base is done, I aim to add multiple interactive overlays showcasing different datasets manually queried from the books. 

### Available Overlays: 
- The 'Food' project, exploring which foods were explicitly mentioned to be devoured by Temeraire or friends during the course of the service. (95% done)
- The 'Side Characters' project. Maps showing the journeys different major side characters joining Laurence and Temeraire during the books. (70% done)

### Upcoming Overlays:
- OPEN FOR SUGGESTIONS

## Map Features
- Shows a world map showcasing the (aproximated) locations mentioned over the course of the books.
- Implied routes taken to get characters from named places in the book to the next are added as dashed lines
- Simple Tooltip with location and chapter data while hovering over routes and points

- Filter any map on a per chapter basis via the bottom chapter slider bar.

Overlay depending filters:
- Food: Filter by food and food preparation
- Side Characters: Filter by SideCharacter

## Note

Locations and paths were manually selected by the authors best approximation depending on the descriptions in the books. If you see any errors or would like to suggest more detailed paths or points or features, please send me a message or raise an issue via the 'issues' tab.

## Other interesting stuff

* [Planned Todos](OPENISSUES.md)
* [How to prepare topojson data for maps](TECHNOTES.md)

## Sources

### Data sources & world map data

- The Temeraire Books - Copyright by Naomi Novik
- Approximate year dates taken from [stargrazing](https://archiveofourown.org/users/stargrazing/pseuds/stargrazing)'s timeline compilation on the Temeraire Discord Server

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
      
### Graphic

All used graphics, including icons, portraits & backgrounds have been created by @manonisch and do not fall under any other licensing rights or copright.
