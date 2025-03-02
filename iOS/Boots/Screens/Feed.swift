//
//  Feed.swift
//  Boots
//
//  Created by callum on 2025-03-02.
//

import SwiftUI

struct Feed: View {
    // Sample data - in real app would come from database/API
    let comments = [
        CommentCardModel(
            id: 1,
            competition: "Morning Crew",
            participant: "Michelle",
            time: Calendar.current.date(byAdding: .hour, value: -2, to: Date())!,
            comment: "Dropped weights mid set and made the person beside me leave the gym.",
            goalIcon: "🏃‍♀️",
            goalName: "Exercise"
        ),
        CommentCardModel(
            id: 4,
            competition: "Morning Crew",
            participant: "Sarah",
            time: Calendar.current.date(byAdding: .hour, value: -2, to: Date())!,
            comment: "Got my morning run in! 5k in 25 minutes",
            goalIcon: "🏃‍♀️",
            goalName: "Exercise"
        ),
        CommentCardModel(
            id: 2, 
            competition: "Bestie Boots",
            participant: "Pierre",
            time: Calendar.current.date(byAdding: .day, value: -1, to: Date())!,
            comment: "Drank so much water I pissed myself before my midterm. Piss boy Strong.",
            goalIcon: "💦",
            goalName: "Water"
        ),
        CommentCardModel(
            id: 3,
            competition: "Study Squad",
            participant: "Alex",
            time: Calendar.current.date(byAdding: .day, value: -2, to: Date())!,
            comment: "3 hours of focused study complete! Brain feels like mush but in a good way.",
            goalIcon: "📚",
            goalName: "Study"
        )
    ]
    
    var groupedComments: [String: [CommentCardModel]] {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM d, yyyy"
        
        // First, get the date components we care about (year, month, day)
        let calendar = Calendar.current
        
        // Group by date, stripping time components
        return Dictionary(grouping: comments) { comment in
            if calendar.isDateInToday(comment.time) {
                return "Today"
            } else if calendar.isDateInYesterday(comment.time) {
                return "Yesterday"
            } else {
                return formatter.string(from: comment.time)
            }
        }.mapValues { comments in
            // Sort comments within each group by time (newest first)
            comments.sorted { $0.time > $1.time }
        }
        // Sort the dictionary by the actual dates
        .sorted { group1, group2 in
            // Get the date for comparison
            let date1 = group1.value.first?.time ?? Date.distantPast
            let date2 = group2.value.first?.time ?? Date.distantPast
            return date1 > date2
        }
        // Convert back to dictionary
        .reduce(into: [:]) { dict, element in
            dict[element.key] = element.value
        }
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Custom sorting for date strings
                ForEach(Array(groupedComments.keys.sorted { date1, date2 in
                    if date1 == "Today" { return true }
                    if date2 == "Today" { return false }
                    if date1 == "Yesterday" { return true }
                    if date2 == "Yesterday" { return false }
                    return date1 > date2
                }), id: \.self) { date in
                    VStack(alignment: .leading, spacing: 10) {
                        Text(date)
                            .font(.headline)
                        
                            .foregroundColor(.secondary)
                            .padding(.horizontal, 20)
                        
                        ForEach(groupedComments[date] ?? [], id: \.id) { comment in
                            CommentCard(currComment: comment)
                        }
                    }
                }
            }
            .padding(.vertical)
        }
    }
}

#Preview {
    Feed()
}
