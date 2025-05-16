# How to prepare map data

* 1. Get your data as valid .geojson data -> can be exported from OSM via tools or APIs

* 2. Transform geojson to topojson, using geo2topo

```
npm install -g topojson-server

# myGeojson.json is geojson file
# myTopojson.json is the name of the output topojson file

geo2topo myGeojson.json > myTopojson.json

```

*Note*: Do not use geo2topo's quantisation mechanism for reducing file size, since this returns blocky quantisation! Instead use topojson-simplify.


* 3. topojson-simplify for topojson file size reducing

  ```
  npm install -g topojson-simplify

  # a.json is a topojson file
  # b.json is a simplified topojson file

  # -S 0.01 is fine enough
  # -S 0.001 is coarse

  toposimplify -S 0.01 -F a.json > b.json ; ls -lh b.json
  ```
