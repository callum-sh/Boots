//
//  BootsApp.swift
//  Boots
//
//  Created by callum on 2025-03-01.
//

import SwiftUI

@main
struct BootsApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
