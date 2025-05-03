# NEXT

- [ ] (BUG) Slider start and end only show current and not full range of points while changing - E
- [ ] (BUG) Bubbles show all data in point -> should only show selected && should only show FOOD - G
- [ ] colorize the foodz (idea: use food parent groups)
- [ ] QMF - bidirectional higlighting (match in Agenda + points on card) (copied, see below)
      ^
- [ ] QMF - Filter by meta matches (food preparation) in a tiered legend, preparation uses different color scale

# Todos

- [ ] Use icons instead of circles for path foods
- [ ] Concept: How to display the individual points on far zoom

- [ ] function (path, food) checks if symbols fit along the path or path needs to be treated as point

- [ ] show food symbols in legend
- [ ] food legend, maybe add hints about food preparation
- [ ] add ancient map typography

- [ ] Region objects need to be rewound to accept fill 
- [ ] Better Tooltips
- [ ] Allow processing for point meta information (single query result labels)

# FeatureList to add
- [ ] Query Map Food (QMF)
- [ ] QMF - show result groups on map (different matches)
- [ ] QMF - show result frequency on map (per chapter vs total)
- [x] QMF - Show match legend
- [ ] QMF - Individual match icons
- [x] QMF - Filter by individual matches
- [ ] QMF - Filter by individual match Groups
- [ ] QMF - Filter by meta matches
- [ ] QMF - bidirectional higlighting (match in Agenda + points on card) (copied, see above)
- [ ] QMF - Animated Story following (reveal locations and automatic semantic zoom)
- [ ] Other Map types (naturalEarth1, flat map)
- [ ] Automatic, animated region zooming on filtering
- [ ] Query Map Dragon Types (QMDT)
- [ ] QMDT - Individual match icons...
- [ ] QMDT - icon size matches Dragon size type?


# Last changes

- [x] food map should only show with 
- [x] connect circles and pathcircles to normal filtering mechanisms from the slider
- [x] connect circles and pathcircles to filtering mechanisms from food legend

- [x] make everything that can be static, static and move to global state -> PERFORMANCE, Precalculate and cache

- [x] function (point, food) draws spiral of food symbols around it
- [x] function (point, food) draws spiral of food symbols with variable size around it
- [x] add paragraphIndexes to food data
- [x] add paragraphIndexes to position data
- [x] function (path, food) draws symbols along it (evenly spaced)

- [x] function that is mapping for all places (points, paths, etc, but not names!)
      all foods that are associated with them, returns a list of all places with their foods attached