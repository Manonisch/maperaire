import { JSXElementConstructor, SVGAttributes } from "react"
import { BirdIcon } from "../../assets/bird"
import { CowIcon } from "../../assets/cow"
import { DeergameIcon } from "../../assets/deergame"
import { LiverIcon } from "../../assets/liver"

export const CharacterColors = {
  Granby: "rgb(229, 11, 11)",
  John: "rgb(229, 11, 11)",
  Jane: "rgb(18, 142, 12)",
  Tharkay: "rgb(132, 9, 185)",
  Tenzing: "rgb(132, 9, 185)",
  Riley: "rgb(227, 172, 46)",
  Tom: "rgb(227, 172, 46)"
} as Record<string, string>

export const CharacterWeakColors = {
  Granby: "rgb(234, 86, 86)",
  John: "rgb(234, 86, 86)",
  Jane: "rgb(91, 191, 86)",
  Tharkay: "rgb(181, 105, 213)",
  Tenzing: "rgb(181, 105, 213)",
  Riley: "rgb(235, 190, 85)",
  Tom: "rgb(235, 190, 85)"
} as Record<string, string>


export const CharacterIconMap = {
  Granby: BirdIcon,
  John: BirdIcon,
  Jane: DeergameIcon,
  Tharkay: CowIcon,
  Tenzing: CowIcon,
  Tom: LiverIcon,
  Riley: LiverIcon
} as Record<string, JSXElementConstructor<SVGAttributes<SVGElement>> | undefined>

export const characterGroups = new Map([
  ["Riley", ["Tom", "Riley"]],
  ["Granby", ["John", "Granby"]],
  ["Jane", ["Jane"]],
  ["Tharkay", ["Tenzing", "Tharkay"]]
])

const groupChars: Record<string, string> = {};
for (const [group, foods] of characterGroups.entries()) {
  for (const food of foods) {
    groupChars[food] = group;
  }
}

export { groupChars };