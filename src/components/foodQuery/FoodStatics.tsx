
import * as d3 from 'd3'
import { BirdIcon } from '../../assets/bird';
import { JSXElementConstructor, SVGAttributes } from 'react';
import { DeergameIcon } from '../../assets/deergame';
import { CowIcon } from '../../assets/cow';
import { PorridgeIcon } from '../../assets/porridge';
import { GrainsIcon } from '../../assets/grains';
import { VegetablesIcon } from '../../assets/vegetables';
import { FishIcon } from '../../assets/fish';
import { TurtleIcon } from '../../assets/turtle';
import { NutsIcon } from '../../assets/nuts';
import { CondimentsIcon } from '../../assets/condiments';
import { LiverIcon } from '../../assets/liver';
import { CamelgameIcon } from '../../assets/camelgame';
import { CangarooIcon } from '../../assets/cangaroo';
import { ElefantgameIcon } from '../../assets/elefantgame';

// import { DeergameIcon } from '../../assets/deergame';
// import { CowIcon } from '../../assets/cow';
// import { PorridgeIcon } from '../../assets/porridge';
// import { GrainsIcon } from '../../assets/grains';
// import { FishIcon } from '../../assets/fish';
// import { VegetablesIcon } from '../../assets/vegetables';

export const foodColorMap = {
  birds: '#577590',
  game: '#f94144',
  livestock: '#f3722c',
  reptiles: '#4d908e',
  'stews and more': '#f9c74f',
  'grains': '#f8961e',
  'fish & ocean mammals': '#277da1',
  'fruits & vegetables': '#90be6d',
  "nuts and so": '#f9844a',
  "condiments": '#43aa8b',
  "misc": 'rgb(86, 125, 128)',
} as Record<string, string>

export const foodIconMap = {
  birds: BirdIcon,
  game: DeergameIcon,
  livestock: CowIcon,
  reptiles: TurtleIcon,
  'stews and more': PorridgeIcon,
  'grains': GrainsIcon,
  'fish & ocean mammals': FishIcon,
  'fruits & vegetables': VegetablesIcon,
  "nuts and so": NutsIcon,
  "condiments": CondimentsIcon,
  "misc": LiverIcon,
  "camel": CamelgameIcon,
  "kangaroo": CangarooIcon,
  "elephant": ElefantgameIcon
} as Record<string, JSXElementConstructor<SVGAttributes<SVGElement>> | undefined>

export const parentIconGroups = new Map([
  ["birds", ["birds", "cassowary", "penguin"]],
  [
    "game",
    [
      "deer",
      "rabbit",
      "monkey",
      "rat",
      "game",
      "buffalo"
    ],
  ],
  ["kangaroo", ["kangaroo", "wombat"]],
  ["elephant", ["elephant", "antelope"]],
  [
    "livestock",
    [
      "charqui",
      "chicken",
      "cow & ox",
      "ducks",
      "goat",
      "horse",
      "pig",
      "sheep",
      "guinea pigs",
      "llama",
      "fat-tailed sheep with hair instead of wool",
    ],
  ],
  ["camel", ["camel"]],
  ["reptiles", ["lizard", "frog", "snake"]],
  ["stews and more", ["bread", "soup", "stew", "porridge"]],
  ["grains", ["barley", "wheat", "maize", "rice"]],
  [
    "fish & ocean mammals",
    [
      "cod",
      "dolphins",
      "lobster",
      "porpoise",
      "seal",
      "shark",
      "toothfish",
      "tunny",
      "whale",
      "fish",
    ],
  ],
  [
    "fruits & vegetables",
    [
      "banana",
      "berries",
      "coconut",
      "dried fruit",
      "mash",
      "potatoes",
      "nutty beans",
      "peppers",
      "onions",
      "pumpkin",
      "plums",
      "raisins",
      "turnips",
      "vegetables",
      "yam",
      "yellow fruit",
      "seaweed",
    ],
  ],
  ["nuts and so", ["chestnuts", "cocoa nut", "mushroom", "roots"]],
  [
    "condiments",
    ["spices", "cardamom", "pepper", "tumeric", "anise", "sugar"],
  ],
  ["misc", ["blood", "liver", "meat", "ice"]],
])

export const parentGroups = new Map([
  ["birds", ["birds", "cassowary", "penguin"]],
  [
    "game",
    [
      "kangaroo",
      "antelope",
      "deer",
      "rabbit",
      "monkey",
      "rat",
      "wombat",
      "game",
      "elephant",
      "buffalo"
    ],
  ],
  [
    "livestock",
    [
      "camel",
      "charqui",
      "chicken",
      "cow & ox",
      "ducks",
      "goat",
      "horse",
      "pig",
      "sheep",
      "guinea pigs",
      "llama",
      "fat-tailed sheep with hair instead of wool",
    ],
  ],
  ["reptiles", ["lizard", "frog", "snake"]],
  ["stews and more", ["bread", "soup", "stew", "porridge"]],
  ["grains", ["barley", "wheat", "maize", "rice"]],
  [
    "fish & ocean mammals",
    [
      "cod",
      "dolphins",
      "lobster",
      "porpoise",
      "seal",
      "shark",
      "toothfish",
      "tunny",
      "whale",
      "fish",
    ],
  ],
  [
    "fruits & vegetables",
    [
      "banana",
      "berries",
      "coconut",
      "dried fruit",
      "mash",
      "potatoes",
      "nutty beans",
      "peppers",
      "onions",
      "pumpkin",
      "plums",
      "raisins",
      "turnips",
      "vegetables",
      "yam",
      "yellow fruit",
      "seaweed",
    ],
  ],
  ["nuts and so", ["chestnuts", "cocoa nut", "mushroom", "roots"]],
  [
    "condiments",
    ["spices", "cardamom", "pepper", "tumeric", "anise", "sugar"],
  ],
  ["misc", ["blood", "liver", "meat", "ice"]],
]);

export const foodGroups = new Map([
  ["anise", ["anise"]],
  ["antelope", ["antelope", "antelopes"]],
  ["banana", ["banana", "bananas"]],
  ["barley", ["barley"]],
  ["berries", ["berries"]],
  ["birds", ["birds"]],
  ["blood", ["blood"]],
  ["buffalo", ["buffalo"]],
  ["bread", ["dough", "bread"]],
  ["camel", ["camel", "camels"]],
  ["cardamom", ["cardamom"]],
  ["cassowary", ["cassowaries", "cassowary"]],
  ["charqui", ["charqui"]],
  ["chestnuts", ["chestnuts"]],
  ["chicken", ["chicken", "chickens", "poultry"]],
  ["cocoa nut", ["cocoa nut"]],
  ["coconut", ["coconut"]],
  ["cod", ["cod"]],
  [
    "cow & ox",
    ["cow", "beef", "cows", "cattle", "ox", "oxen", "veal", "oxheads"],
  ],
  ["deer", ["deer", "venison"]],
  ["dolphins", ["dolphins", "dolphin"]],
  ["dried fruit", ["dried fruit"]],
  ["ducks", ["duck", "ducks"]],
  ["elephant", ["elephant", "elephants"]],
  [
    "fat-tailed sheep with hair instead of wool",
    ["fat-tailed sheep with hair instead of wool"],
  ],
  ["fish", ["fish"]],
  ["frog", ["frog", "frogs"]],
  ["game", ["game"]],
  ["goat", ["goat", "goats"]],
  ["guinea pigs", ["guinea pigs"]],
  ["horse", ["horse", "horses", "burnt horse", "horse carcass", "horsemeat"]],
  ["ice", ["ice"]],
  ["kangaroo", ["kangaroo", "kangaroos"]],
  ["llama", ["llama", "llamas"]],
  ["lizard", ["lizard", "lizards"]],
  ["liver", ["liver in sauce"]],
  ["lobster", ["lobsters", "lobster"]],
  ["maize", ["maize"]],
  ["mash", ["mash"]],
  ["meat", ["meat"]],
  ["monkey", ["monkey livers"]],
  ["mushroom", ["mushrooms", "mushroom"]],
  ["nutty beans", ["nutty beans"]],
  ["onions", ["onions"]],
  ["penguin", ["penguin", "penguins"]],
  ["pepper", ["pepper"]],
  ["peppers", ["peppers"]],
  ["pig", ["pig", "pigs", "hogs", "hog", "pork"]],
  ["porpoise", ["porpoise"]],
  ["porridge", ["porridge"]],
  ["potatoes", ["potatoes"]],
  ["plums", ["plums"]],
  ["pumpkin", ["pumpkin"]],
  ["rat", ["rat", "rats", "rodents"]],
  ["rabbit", ["with rabbit"]],
  ["raisins", ["raisins"]],
  ["rice", ["rice"]],
  ["sugar", ["rock sugar"]],
  ["roots", ["roots"]],
  ["seal", ["seal", "seals"]],
  ["seaweed", ["seaweed"]],
  ["shark", ["sharks", "shark"]],
  ["sheep", ["sheep", "lamb", "lambs", "mutton"]],
  ["snake", ["snake", "snakes"]],
  ["stew", ["stew"]],
  ["soup", ["soup"]],
  ["spices", ["spices"]],
  ["toothfish", ["toothfish"]],
  ["tumeric", ["tumeric"]],
  ["tunny", ["tunny", "tunnys"]],
  ["turnips", ["turnips"]],
  ["vegetables", ["vegetables"]],
  ["whale", ["whale", "whales"]],
  ["wheat", ["wheat", "grain", "grains"]],
  ["wombat", ["wombat", "wombats"]],
  ["yam", ["local yam"]],
  ["yellow fruit", ["small yellow fruits"]],
]);

export const prepTypes = [
  'stewed',
  'boiled',
  'cooked',
  'spit-roasted',
  'roasted',
  'dressed with sauce',
  "stuffed",
  "burnt",
  "smoked",
  "skewers",
  "salted",
  "raw",
  "dried",
  "seared",
  "in wine",
  "grilled",
  "fried",
  "shaved",
  "cured",
]

export const prepColors = {
  "shaved": d3.interpolateRdBu(0.7),
  "cured": d3.interpolateRdBu(0.62),
  "salted": d3.interpolateRdBu(0.58),
  "dried": d3.interpolateRdBu(0.54),
  raw: d3.interpolateRdBu(0.5), //white
  "seared": d3.interpolateRdBu(0.48),
  'boiled': d3.interpolateRdBu(0.45),
  'stewed': d3.interpolateRdBu(0.43),
  'cooked': d3.interpolateRdBu(0.4),
  "stuffed": d3.interpolateRdBu(0.36),
  'dressed with sauce': d3.interpolateRdBu(0.32),
  "in wine": d3.interpolateRdBu(0.28),
  "fried": d3.interpolateRdBu(0.24),
  "skewers": d3.interpolateRdBu(0.2),
  "grilled": d3.interpolateRdBu(0.16),
  'spit-roasted': d3.interpolateRdBu(0.12),
  'roasted': d3.interpolateRdBu(0.08),
  "smoked": d3.interpolateRdBu(0.04),
  "burnt": d3.interpolateRdBu(0)
}

const groupFoods: Record<string, string> = {};
for (const [group, foods] of foodGroups.entries()) {
  for (const food of foods) {
    groupFoods[food] = group;
  }
}

const groupParentFoods: Record<string, string> = {};
for (const [group, foods] of parentGroups.entries()) {
  for (const food of foods) {
    groupParentFoods[food] = group;
  }
}

const groupParentIconFoods: Record<string, string> = {};
for (const [group, foods] of parentIconGroups.entries()) {
  for (const food of foods) {
    groupParentIconFoods[food] = group;
  }
}

export { groupFoods, groupParentFoods, groupParentIconFoods };