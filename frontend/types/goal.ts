import { ICategory } from "./category";
import { IParticipant } from "./participant";

export interface IGoal {
  id: string;
  participant: IParticipant;
  category: ICategory;
  description: string;
  achieved: boolean;
  date: string;
}
