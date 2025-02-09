import React, { useEffect, useState } from 'react';
import { Text, View } from "@/components/Themed";
import { IGoal } from '@/types/goal';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { fetchTodaysUserGoals, putGoal } from '@/network/goals';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { ICompetition } from '@/types/competition';
import { Colors } from '@/constants/Colors';
import { fetchWrapper } from '@/network/fetchWrapper';
import { IconButton } from '@/components/IconButton';
import { fetchCompetitionDetails } from '@/network/competition';

interface GoalItemProps {
    goal: IGoal;
    onToggleAchieved: (goalId: string) => void;
  }

export default function ParticipantGoals() {
    const theme = useColorScheme() === 'light' ? Colors.light : Colors.dark;
    
    const local = useLocalSearchParams();
    const [goals, setGoals] = useState<IGoal[]>([]);
    const [competitionDetails, setCompetitionDetails] = useState<ICompetition | undefined>(undefined);

    useEffect(() => {
        fetchTodaysUserGoals(local.participant as string).then(setGoals);
    }, [local.participant]);

    useEffect(() => {
        if (goals && goals.length > 0) 
            fetchCompetitionDetails(goals[0].participant.competition).then(setCompetitionDetails);
    }, [goals]);

    const handleDetails = () => {
        if (!competitionDetails) return;
        router.push(`/competition/${competitionDetails.id}`);
    };

    const handleToggleAchieved = async (goalId: string) => {
        // Call the backend to update the goal's achieved status
        // update goal with all fields the same except achieved = true

        const updatedGoal = goals.find(goal => goal.id === goalId);
        if (!updatedGoal) return;

        const data = { ...updatedGoal, achieved: true };
        const response = await putGoal(goalId, data);
        fetchTodaysUserGoals(local.participant as string).then(setGoals);
    };

    const GoalItem = ({ goal, onToggleAchieved }: GoalItemProps) => {
        return (
            <TouchableOpacity
                    onPress={() => onToggleAchieved(goal.id)}
                    key={goal.id}
                    style={[
                        styles.competitionContainer,
                        {backgroundColor: theme.container}
                    ]}
                    disabled={goal.achieved}
                    >
                    <Text>{goal.category.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Stack.Screen options={{ title: competitionDetails?.name }} />
            <View style={styles.container}>
                {goals && goals.length > 0 ? goals.map((goal: IGoal) => (
                    <GoalItem
                        key={goal.id}
                        goal={goal}
                        onToggleAchieved={handleToggleAchieved}
                    />
                )) : <Text>No goals for today</Text>}

                <IconButton
                    iconName="question"
                    content="Competition Details"
                    color={theme.tint}
                    iconSize={32}
                    onPress={handleDetails}
                />
            </View>
            
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    competitionContainer: {
        padding: 16,
        width: "80%",
        marginVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
});