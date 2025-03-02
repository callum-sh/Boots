//
//  CommentCardModel.swift
//  Boots
//
//  Created by callum on 2025-03-02.
//

import Foundation

struct CommentCardModel {
    let id: Int
    let competition: String
    let participant: String
    let time: Date
    let comment: String
    let goalIcon: String
    let goalName: String

    init(id: Int, competition: String, participant: String, time: Date, comment: String, goalIcon: String, goalName: String) {
        self.id = id
        self.competition = competition
        self.participant = participant
        self.time = time
        self.comment = comment
        self.goalIcon = goalIcon
        self.goalName = goalName
    }
}
