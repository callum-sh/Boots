import { RouteProp } from '@react-navigation/native';

// define competition interface 
export interface Competition {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export type RootStackParamList = {
  'index': undefined;
  '+not-found': undefined;
  'competitionDetails/[id]': { competition: Competition };
};

export type CompetitionDetailsRouteProp = RouteProp<RootStackParamList, 'competitionDetails/[id]'>;