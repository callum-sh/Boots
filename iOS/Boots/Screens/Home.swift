//
//  Home.swift
//  Boots
//
//  Created by callum on 2025-03-02.
//

import SwiftUI

struct Home: View {
    @State private var activeTab: TabModel = .goals
    
    var body: some View {
        ZStack(alignment: .top) {
            // blurred background imagae
            Color(.systemBackground)
                .ignoresSafeArea()

            GeometryReader { geometry in
                Image(systemName: "figure.hiking")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 600, height: 600)
                    .foregroundColor(Color.blue.opacity(0.4))
                    .blur(radius: 30)
                    .scaleEffect(x: -1, y: 1)
                    .position(x: geometry.size.width * 0.8, y: geometry.size.height * 0.5)
            }
            .ignoresSafeArea()
            
            VStack(spacing: 24) {
                HStack {
                    ToggleView(activeTab: $activeTab)
                        .padding(.vertical, 10)
                    
                    Spacer()
                    
                    // profile
                    Button(action: {}) {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                            .frame(width: 32, height: 32)
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal)
                .padding(.top, 10)
                
                // main content
                ZStack {
                    if activeTab == .goals {
                        Goals()
                    } else {
                        Feed()
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
    }
}

#Preview {
    Home()
}

