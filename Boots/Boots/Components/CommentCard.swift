//
//  CommentCard.swift
//  Boots
//
//  Created by callum on 2025-03-01.
//

import SwiftUI

struct CommentCard: View {
    let currComment: CommentCardModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: 15) {
            // Info Header
            HStack {
                Text("\(currComment.participant) · \(currComment.competition)")
                    .font(.custom("HelveticaNeue-Light", size: 15))
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Text(formattedTime())
                    .font(.custom("HelveticaNeue-Light", size: 15))
                    .foregroundColor(.secondary)
            }
            
            // Comment text
            Text(currComment.comment)
                .font(.custom("Georgia", size: 17))
                .fixedSize(horizontal: false, vertical: true)
            
            // Goal category w/ icon 
            Text("\(currComment.goalIcon) \(currComment.goalName)")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(20)
        .frame(width: 362, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .foregroundColor(Color(UIColor.secondarySystemBackground))
                .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
        )
    }
    
    private func formattedTime() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm"
        let timeString = formatter.string(from: Date())
        
        if Calendar.current.isDateInToday(Date()) {
            return "Today, \(timeString)"
        } else if Calendar.current.isDateInYesterday(Date()) {
            return "Yesterday, \(timeString)"
        } else {
            formatter.dateFormat = "MMM d, h:mm"
            return formatter.string(from: Date())
        }
    }
}

#Preview {
    CommentCard(currComment: CommentCardModel(
        id: 1,
        competition: "Bestie Boots",
        participant: "Pierre",
        time: Date(),
        comment: "Drank so much water I pissed myself before my midterm. Piss boy Strong.",
        goalIcon: "💦",
        goalName: "Water"
    ))
}
