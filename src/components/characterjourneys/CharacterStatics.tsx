import { JSXElementConstructor, SVGAttributes } from "react"
import { BirdIcon } from "../../assets/bird"
import { CowIcon } from "../../assets/cow"
import { DeergameIcon } from "../../assets/deergame"

export const CharacterColors = {
  Granby: "rgb(229, 11, 11)",
  Jane: "rgb(18, 142, 12)",
  Tharkay: "rgb(132, 9, 185)"
} as Record<string, string>

export const CharacterIconMap = {
  Granby: BirdIcon,
  Jane: DeergameIcon,
  Tharkay: CowIcon,
} as Record<string, JSXElementConstructor<SVGAttributes<SVGElement>> | undefined>