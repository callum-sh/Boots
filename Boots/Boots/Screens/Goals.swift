//
//  Goals.swift
//  Boots
//
//  Created by callum on 2025-03-02.
//

import SwiftUI

struct Goals: View {
    // Sample data - in real app would come from database/API
    @State private var goals = [
        GoalCardModel(
            id: 1,
            title: "7am Wakeup",
            competition: "Bestie Boots",
            icon: "🥱",
            isCompleted: nil
        ),
        GoalCardModel(
            id: 2,
            title: "Exercise",
            competition: "Morning Crew",
            description: "5k run before work",
            icon: "🏃‍♀️",
            isCompleted: false
        ),
        GoalCardModel(
            id: 3,
            title: "3.6L of Water",
            competition: "Bestie Boots",
            icon: "💧",
            isCompleted: true
        ),
        GoalCardModel(
            id: 4,
            title: "Read 30 Minutes",
            competition: "Study Squad",
            description: "Daily reading goal",
            icon: "📚",
            isCompleted: nil
        )
    ]
    
    // Computed properties to sort goals by status
    var incompleteGoals: [GoalCardModel] {
        goals.filter { $0.isCompleted == nil }
    }
    
    var successGoals: [GoalCardModel] {
        goals.filter { $0.isCompleted == true }
    }
    
    var failedGoals: [GoalCardModel] {
        goals.filter { $0.isCompleted == false }
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // To Do Goals Section
                Section {
                    if !incompleteGoals.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            HStack(spacing: 8) {
                                Text("To Do")
                                    .font(.headline)
                                    .foregroundColor(.secondary)
                                
                                Circle()
                                    .fill(.orange)
                                    .frame(width: 8, height: 8)
                            }
                            .padding(.horizontal, 20)
                            
                            ForEach(incompleteGoals.indices, id: \.self) { index in
                                let goalIndex = goals.firstIndex(where: { $0.id == incompleteGoals[index].id })!
                                GoalCard(goal: $goals[goalIndex])
                                    .padding(.horizontal, 15)
                                    .id("todo-\(goals[goalIndex].id)")
                            }
                        }
                    } else {
                        VStack(alignment: .leading) {
                            HStack(spacing: 8) {
                                Text("To Do")
                                    .font(.headline)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.horizontal, 20)
                            
                            Text("Done goals for today")
                                .font(.custom("Georgia", size: 17))
                                .foregroundColor(.secondary)
                                .padding(.top, 5)
                                .frame(maxWidth: .infinity, alignment: .center)
                        }
                    }
                }
                
                // Addressed Goals Section for completed and failed goals
                if !successGoals.isEmpty || !failedGoals.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack(spacing: 8) {
                            Text("Completed")
                                .font(.headline)
                                .foregroundColor(.secondary)
                        }
                        .padding(.horizontal, 20)
                        
                        // Successful goals
                        ForEach(successGoals.indices, id: \.self) { index in
                            let goalIndex = goals.firstIndex(where: { $0.id == successGoals[index].id })!
                            GoalCard(goal: $goals[goalIndex])
                                .padding(.horizontal, 15)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20)
                                        .fill(Color.green.opacity(0.05))
                                        .allowsHitTesting(false)
                                )
                                .id("complete-\(goals[goalIndex].id)")
                        }
                        
                        // Failed goals
                        ForEach(failedGoals.indices, id: \.self) { index in
                            let goalIndex = goals.firstIndex(where: { $0.id == failedGoals[index].id })!
                            GoalCard(goal: $goals[goalIndex])
                                .padding(.horizontal, 15)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20)
                                        .fill(Color.red.opacity(0.05))
                                        .allowsHitTesting(false)
                                )
                                .id("failed-\(goals[goalIndex].id)")
                        }
                    }
                }
            }
            .padding(.vertical)
            .animation(.spring(), value: incompleteGoals.count)
            .animation(.spring(), value: successGoals.count)
            .animation(.spring(), value: failedGoals.count)
        }
    }
}

#Preview {
    Goals()
}
