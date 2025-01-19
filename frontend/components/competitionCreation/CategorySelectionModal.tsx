import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Text, View} from '../Themed';
import { ICategory } from '@/types/category';
import { ICompetition } from '@/types/competition';

interface CategorySelectionModalProps {
  categories: ICategory[];
  handleChange: (key: keyof ICompetition, value: number[]) => void;
}

export function CategorySelectionModal({categories, handleChange}: CategorySelectionModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark;

  const handleCategoryChange = (category: number) => {
    /** on every change of selectedCategories, send a handleChange event */
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }

    handleChange('categories', selectedCategories);
  };

  const renderCategory = ({ item }: { item: ICategory }) => {
    return (
      <Pressable
        onPress={() => handleCategoryChange(item.id)}
        style={styles.competitionContainer}
      >
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
});