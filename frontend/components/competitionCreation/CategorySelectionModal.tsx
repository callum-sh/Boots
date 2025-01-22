import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Text, View } from '../Themed';
import { ICategory } from '@/types/category';
import { ICompetition } from '@/types/competition';

interface CategorySelectionModalProps {
  categories: ICategory[];
  handleChange: (key: keyof ICompetition, value: number[]) => void;
}

export function CategorySelectionModal({ categories, handleChange }: CategorySelectionModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [customCategories, setCustomCategories] = useState<ICategory[]>([]);
  const popularCategories: ICategory[] = [
    { id: 1, name: 'Workout' },
    { id: 2, name: 'Focus' },
    { id: 3, name: 'Wakeup' },
    { id: 4, name: 'Reading' },
    { id: 5, name: 'Diet' },
    { id: 6, name: 'Water' },
    { id: 7, name: 'Social Media' },
  ];
  const theme = useColorScheme() === 'light' ? Colors.light : Colors.dark;

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObj = {
        id: Math.max(...popularCategories.map((cat) => cat.id), ...customCategories.map((cat) => cat.id)) + 1,
        name: newCategory,
      };
      setCustomCategories([...customCategories, newCategoryObj]);
      setSelectedCategories([...selectedCategories, newCategoryObj.id]);
      setNewCategory('');
    }
  };

  const handlePress = (category: ICategory) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };

  const renderCategory = (category: ICategory) => {
    const isSelected = selectedCategories.includes(category.id);
    return (
      <TouchableOpacity
        onPress={() => handlePress(category)}
        key={category.id}
        style={[
          styles.categoryContainer,
          {
            backgroundColor: theme.container,
            borderColor: isSelected ? '#007BFF' : theme.tint,
            borderWidth: 2,
          },
        ]}
      >
        <Text style={[styles.categoryText, { color: isSelected ? '#007BFF' : theme.text }]}>{category.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.title}>Category Selection</Text>

      {/* Render Popular Categories */}
      <Text style={styles.subTitle}>Popular Categories</Text>
      <View style={styles.categoryRow}>
        {popularCategories.map((category: ICategory) => renderCategory(category))}
      </View>

      {/* Render Custom Categories */}
      <Text style={styles.subTitle}>Custom Categories</Text>
      <View style={styles.categoryRow}>
        {customCategories.map((category: ICategory) => renderCategory(category))}
      </View>

      <TextInput
        style={[styles.textInput, { color: theme.tint }]}
        value={newCategory}
        onChangeText={(text) => setNewCategory(text)}
      />
      <Pressable onPress={handleAddCategory} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add a new Custom Category</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#EDEDED',
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    marginBottom: 8,
    padding: 4,
    borderRadius: 4,
    borderColor: "rgb(102, 102, 102)",
    color: Colors.light.text,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});