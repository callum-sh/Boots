import { ICategory } from "./category";
import { IParticipant } from "./participant";

export interface ICompetition {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  categories: ICategory[];
  participants: IParticipant[];
}
