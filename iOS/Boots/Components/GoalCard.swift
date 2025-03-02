//
//  GoalCard.swift
//  Boots
//
//  Created by callum on 2025-03-01.
//

import SwiftUI

struct GoalCard: View {
    let goal: GoalCardModel
    
    var body: some View {
        HStack(spacing: 16) {
            // large icon
            VStack {
                Text(goal.icon)
                    .font(.title)
            }
            .frame(width: 50)

            VStack(spacing: 15) {
                // title (bold) + competition
                HStack {
                    Text(goal.title)
                        .font(.custom("HelveticaNeue-Light", size: 15))
                        .foregroundColor(.secondary)
                        .fontWeight(.bold)
                    
                    Spacer()
                    
                    Text(goal.competition)
                        .font(.custom("HelveticaNeue-Light", size: 15))
                        .foregroundColor(.secondary)
                }
                
                // description?
                if let description = goal.description {
                    Text(description)
                        .font(.custom("Georgia", size: 13))
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
        }
        .padding(20)
        .frame(width: 362, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .foregroundColor(Color(UIColor.secondarySystemBackground))
                .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
        )
    }
}

#Preview {
    GoalCard(goal: GoalCardModel(
        id: 1,
        title: "7am Wakeup",
        competition: "Bestie Boots",
        description: "Wake up at 7am every day",
        icon: "🥱")
    )
}
