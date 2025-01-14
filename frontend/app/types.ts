import { RouteProp } from '@react-navigation/native';

// define competition interface 
export interface ICompetition {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

export type RootStackParamList = {
  'index': undefined;
  '+not-found': undefined;
  'competitionDetails/[id]': { competition: ICompetition };
};

export type CompetitionDetailsRouteProp = RouteProp<RootStackParamList, 'competitionDetails/[id]'>;