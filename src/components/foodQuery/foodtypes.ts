import { ReactNode } from "react";

export type ItemGroup = {
  groupName: string;
  elements: string[];
  icon?: ReactNode;
};

export interface ItemParentGroup {
  parentGroupName: string;
  children: ItemGroup[];
}

export interface FoodPoint {
  coords: number[];
  locName: string;
  foods: string[];
  type: string;
}

export interface countedFoodPoint extends Omit<FoodPoint, 'foods'> {
  countedFood: Map<string, number>
}
