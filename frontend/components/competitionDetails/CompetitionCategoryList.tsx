import { View, Text } from "../Themed";
import { StyleSheet } from "react-native";
import { ICategory } from "@/types/category";


export function CompetitionCategoryList({ categories }: { categories: ICategory[] }) {
  return (
    <View style={styles.detailContainer}>
        <Text style={styles.title}>Categories</Text>
        <View style={styles.titleSeparator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {categories.map(category => (
            <View key={category.id}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text>{category.description}</Text>
            </View>
        ))}
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
  });