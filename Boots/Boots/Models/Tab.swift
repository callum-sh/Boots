//
//  TabModel.swift
//  ContactExplorer
//
//  Created by Harvin Park on 2/23/25.
//

import SwiftUI

enum TabModel: String, CaseIterable {
    
    case goals = "square.and.pencil"
    case feed = "newspaper"
    
    var title: String{
        switch self{
        case .goals: "Goals"
        case .feed: "Feed"
        }
    }
}
