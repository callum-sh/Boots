import React from 'react';
import { FlatList, Pressable, StyleSheet, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Text, View} from './Themed';
import { ICategory } from '@/types/category';
import { ICompetition } from '@/types/competition';

interface CategorySelectionModalProps {
  categories: ICategory[];
  handleChange: (key: string | keyof ICompetition, value: any) => void;
}

export function CategorySelectionModal({categories, handleChange}: CategorySelectionModalProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark;

  const renderCategory = ({ item }: { item: ICategory }) => {
    return (
      <Pressable onPress={() => handleChange('category', item.id)} style={styles.competitionContainer}>
        <View style={styles.competitionContainer}>
          <Text>{item.name}</Text>
        </View>
      </Pressable>
    );
  };
  
  return (
    <View>
      <Text style={styles.title}>Category Selection</Text>
      {/* TODO: make this look like TikTok signup choose interest page */}
      <FlatList
        data={Object.values(categories)}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
)};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
  },
  competitionContainer: {
    padding: 16,
    width: '80%',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outerCompetitionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#76c7c0',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});