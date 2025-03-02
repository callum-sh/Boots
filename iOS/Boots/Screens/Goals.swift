//
//  Goals.swift
//  Boots
//
//  Created by callum on 2025-03-02.
//

import SwiftUI

struct Goals: View {
    // Sample data - in real app would come from database/API
    let goals = [
        GoalCardModel(
            id: 1,
            title: "7am Wakeup",
            competition: "Bestie Boots",
            icon: "🥱",
            isCompleted: false
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
            isCompleted: true
        )
    ]
    
    var incompleteGoals: [GoalCardModel] {
        goals.filter { !$0.isCompleted }
    }
    
    var completedGoals: [GoalCardModel] {
        goals.filter { $0.isCompleted }
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Incomplete Goals Section
                if !incompleteGoals.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack(spacing: 8) {
                            Text("To Do")
                                .font(.headline)
                                .foregroundColor(.secondary)
                            
                            Circle()
                                .fill(.red)
                                .frame(width: 8, height: 8)
                        }
                        .padding(.horizontal, 20)
                        
                        ForEach(incompleteGoals) { goal in
                            GoalCard(goal: goal)
                        }
                    }
                }
                
                // Completed Goals Section
                if !completedGoals.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Done")
                            .font(.headline)
                            .foregroundColor(.secondary)
                            .padding(.horizontal, 20)
                        
                        ForEach(completedGoals) { goal in
                            GoalCard(goal: goal)
                                .opacity(0.2) // 20% opacity for completed goals
                        }
                    }
                }
            }
            .padding(.vertical)
        }
    }
}

#Preview {
    Goals()
}
