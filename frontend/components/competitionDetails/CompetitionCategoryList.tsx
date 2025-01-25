import { View, Text } from "../Themed";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { ICategory } from "@/types/category";
import { Colors } from "@/constants/Colors";


export function CompetitionCategoryList({ categories }: { categories: ICategory[] }) {
    const theme = useColorScheme() === 'light' ? Colors.light : Colors.dark;
    
    const renderCategory = (category: ICategory) => {
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryContainer,
              {
                backgroundColor: theme.container,
                borderColor: '#007BFF',
                borderWidth: 1,
              },
            ]}
          >
          <Text style={[styles.categoryText, { color: '#007BFF' }]}>{category.name}</Text>
          </TouchableOpacity>
        );
    };


    return (
      <View style={styles.detailContainer}>
            <Text style={styles.title}>Categories</Text>
            <View style={styles.titleSeparator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={styles.categoryRow}>
                {categories.map((category: ICategory) =>
                    renderCategory(category)
                )}
            </View>
      </View>
    );
  }

const styles = StyleSheet.create({
    detailContainer: {
        width: '80%',
        alignItems: 'flex-start',
        paddingBottom: 16,
    },
    titleSeparator: {
        marginVertical: 5,
        height: 1,
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'flex-start'
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
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
    categoryRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 8,
    },
  });