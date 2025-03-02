//
//  ProgressBar.swift
//  Boots
//
//  Created by callum on 2025-03-01.
//

import SwiftUI

struct ProgressBar: View {
    let start_date: Date
    let end_date: Date
    let color: Color = Color(UIColor.systemBlue)
    let height: CGFloat = 12 // Reduced height for a more elegant look
    let cornerRadius: CGFloat = 6 // Half the height for perfect rounded caps

    // Calculate the progress of the progress bar
    var progress: Double {
        let totalTime = end_date.timeIntervalSince(start_date)
        let elapsedTime = Date().timeIntervalSince(start_date)
        return min(max(0, elapsedTime / totalTime), 1.0) // Clamp between 0 and 1
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                // Background track
                RoundedRectangle(cornerRadius: cornerRadius)
                    .frame(width: geometry.size.width, height: height)
                    .foregroundColor(Color(UIColor.systemGray5))
                
                // Progress indicator
                if progress > 0 {
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .frame(width: max(cornerRadius * 2, geometry.size.width * CGFloat(progress)), height: height)
                        .foregroundColor(color)
                }
            }
            .frame(height: height)
            // Center the progress bar vertically in the available space
            .frame(maxHeight: .infinity, alignment: .center)
        }
        // Set a fixed height for the GeometryReader to prevent layout issues
        .frame(height: 30)
    }   
}

#Preview {
}
