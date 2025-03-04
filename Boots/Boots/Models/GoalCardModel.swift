//
//  GoalCardModel.swift
//  Boots
//
//  Created by callum on 2025-03-01.
//

import Foundation

class GoalCardModel: Identifiable, Codable {
    let id: Int
    let title: String
    let competition: String
    let description: String?
    let icon: String
    let isCompleted: Bool?
    
    init(id: Int, title: String, competition: String, description: String? = nil, icon: String, isCompleted: Bool? = nil) {
        self.id = id
        self.title = title
        self.competition = competition
        self.description = description
        self.icon = icon
        self.isCompleted = isCompleted
    }
}
