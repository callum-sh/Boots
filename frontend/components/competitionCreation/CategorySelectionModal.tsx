import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Switch, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { RowView, Text, View } from '../Themed';
import { ICategory } from '@/types/category';
import { ICompetition } from '@/types/competition';

interface CategorySelectionModalProps {
  categories: ICategory[];
  handleChange: (key: keyof ICompetition, value: number[]) => void;
}

export function CategorySelectionModal({
  categories,
  handleChange,
}: CategorySelectionModalProps) {

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [publicCategories, setPublicCategories] = useState<ICategory[]>([]);
  const [customCategories, setCustomCategories] = useState<ICategory[]>([]);
  const theme = useColorScheme() === 'light' ? Colors.light : Colors.dark;

  useEffect(() => {
    if (!Array.isArray(categories) || categories.length === 0) return;

    // set default categories if there are categories to choose from
    console.log(`categories: ${categories}`);
    setPublicCategories(categories.filter((cat) => cat.public));

    // TODO: pull private categories from user's profile 
  }, [categories]);

  const handleAddCategory = async () => {
    // TODO: actually create new category model in backend 
    if (newCategory.trim()) {
      const newCategoryObj = {
        id: 0,
        name: newCategory,
        description: '',
        public: isPublic,
      };

      const updatedSelectedCategories = [...selectedCategories, newCategoryObj.id];
      setSelectedCategories(updatedSelectedCategories);
      {isPublic ? (
        setPublicCategories([...publicCategories, newCategoryObj])
      ) : (
        setCustomCategories([...customCategories, newCategoryObj])
      )}
      handleChange('categories', updatedSelectedCategories);
      setNewCategory('');
      Keyboard.dismiss();
    }
  };

  const handlePress = (category: ICategory) => {
    const updatedSelectedCategories = selectedCategories.includes(category.id)
      ? selectedCategories.filter((cat) => cat !== category.id)
      : [...selectedCategories, category.id];
      
    setSelectedCategories(updatedSelectedCategories);
    handleChange('categories', updatedSelectedCategories);
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
            borderWidth: 1,
          },
        ]}
      >
      <Text style={[styles.categoryText, { color: isSelected ? '#007BFF' : theme.text }]}>{category.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ padding: 12 }}>
      <Text style={styles.title}>Category Selection</Text>

      {/* Render popular categories */}
      <Text style={styles.subTitle}>Public Categories</Text>
      <View style={styles.categoryRow}>
        {publicCategories.map((category: ICategory) =>
          renderCategory(category)
        )}
      </View>

      {/* Render custom categories */}
      <Text style={styles.subTitle}>Your Categories</Text>
      <View style={styles.categoryRow}>
        {customCategories.length > 0 ? (
          customCategories.map((category: ICategory) => renderCategory(category))
        ) : (
          <Text style={{ color: theme.text, paddingBottom: 26 }}>
            {"No previous custom categories to display"}
          </Text>
        )}
      </View>

      {/* Add a new custom category */}
      <RowView style={styles.inputRow}>
        <TextInput
          style={[styles.textInput, { color: theme.tint }]}
          value={newCategory}
          onChangeText={(text) => setNewCategory(text)}
          placeholder="Enter new public/private category"
          onSubmitEditing={handleAddCategory}
        />
        <View style={styles.switchContainer}>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            style={styles.toggle}
          />
          <Text style={{ color: theme.text }}>
            {isPublic ? "Public Category" : "Private Category"}
          </Text>
        </View>
      </RowView>
      <Pressable onPress={handleAddCategory} style={styles.addButton}>
        <Text style={styles.buttonText}>Add a new Custom Category</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
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
    flex: 1,
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingBottom: 8,
  },
  toggle: {
    marginLeft: 16,
    marginRight: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});