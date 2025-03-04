//
//  GoalCard.swift
//  Boots
//
//  Created by callum on 2025-03-01.
//

import SwiftUI
import AVFoundation

struct GoalCard: View {
    @Binding var goal: GoalCardModel
    @State private var isCompleting = false
    @State private var isResetting = false
    @State private var showConfetti = false
    @State private var offset: CGFloat = 0
    @State private var isSwiping = false
    
    private let swipeThreshold: CGFloat = -100
    private let cardWidth: CGFloat = 362
    
    // Sound player
    private let soundPlayer = try? AVAudioPlayer(
        contentsOf: Bundle.main.url(forResource: "completion_sound", withExtension: "mp3") ?? URL(fileURLWithPath: "")
    )
    
    // Sound effects
    private let completionSound: SystemSoundID = 1407
    private let failureSound: SystemSoundID = 1053
    private let resetSound: SystemSoundID = 1104
    
    var body: some View {
        ZStack(alignment: .center) {
            // Background for swipe indicator (positioned behind the card)
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.red.opacity(offset < 0 ? min(abs(offset) / 100.0, 0.8) : 0))
            
            // X mark icon (only visible during swipe)
            HStack {
                Spacer()
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 24))
                    .foregroundColor(.white)
                    .padding(.trailing, 30)
                    .opacity(offset < 0 ? min(abs(offset) / 100.0, 1.0) : 0)
            }
            .allowsHitTesting(false)
            
            // Card content
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
                            .fixedSize(horizontal: false, vertical: true)
                        
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
                            .fixedSize(horizontal: false, vertical: true) 
                    }
                }
            }
            .padding(20)
            .frame(width: cardWidth, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .foregroundColor(Color(UIColor.secondarySystemBackground))
                    .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
            )
            .offset(x: offset)
            .scaleEffect(isCompleting ? 0.95 : (isResetting ? 0.97 : 1))
            .opacity(isCompleting || isResetting ? 0.9 : 1)
            // .rotation3DEffect(
            //     .degrees(isCompleting ? 2 : (isResetting ? -2 : 0)),
            //     axis: (x: 0, y: 1, z: 0)
            // )
            
            if showConfetti {
                GeometryReader { geo in
                    ConfettiView()
                        .frame(width: geo.size.width, height: geo.size.height)
                }
                .allowsHitTesting(false)
            }
        }
        .frame(width: cardWidth)
        // Apply the drag gesture for swipe functionality
        .gesture(
            DragGesture()
                .onChanged { gesture in
                    if !isSwiping && goal.isCompleted == nil {
                        self.offset = gesture.translation.width
                        // Restrict to left swipe only (negative offset)
                        if self.offset > 0 {
                            self.offset = 0
                        }
                    }
                }
                .onEnded { gesture in
                    if goal.isCompleted == nil {
                        // If swiped far enough to the left, mark as failed
                        if self.offset < self.swipeThreshold {
                            withAnimation(.spring()) {
                                self.isSwiping = true
                                self.offset = -200 // Swipe further for visual effect
                            }
                            
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                                markAsFailed()
                                
                                // Reset the card position with animation
                                withAnimation(.spring()) {
                                    self.offset = 0
                                }
                                
                                // Allow swiping again after delay
                                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                                    self.isSwiping = false
                                }
                            }
                        } else {
                            // If not swiped far enough, reset position
                            withAnimation(.spring()) {
                                self.offset = 0
                            }
                        }
                    }
                }
        )
        .contentShape(Rectangle())
        .onTapGesture {
            if goal.isCompleted == nil && !isSwiping {
                // Incomplete goal - mark as complete
                completeGoal()
            } else if goal.isCompleted != nil && !isSwiping && !isResetting {
                // Completed or failed goal - reset to incomplete
                resetGoal()
            }
        }
    }
    
    private func completeGoal() {
        // Start the completion animation
        withAnimation(.easeInOut(duration: 0.2)) {
            isCompleting = true
        }
        
        // Play completion sound
        playCompletionSound()
        
        // After a short delay, show confetti and update status
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            withAnimation {
                showConfetti = true
            }
            
            // Update goal status after animation
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                updateGoalStatus(isComplete: true)
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                    withAnimation {
                        isCompleting = false
                    }
                    
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                        withAnimation {
                            showConfetti = false
                        }
                    }
                }
            }
        }
    }
    
    private func resetGoal() {
        // Prevent multiple resets
        if isResetting {
            return
        }

        // TODO: send request to reset goal 
        
        // Start the reset animation
        withAnimation(.easeInOut(duration: 0.2)) {
            isResetting = true
        }
        
        // Play reset sound
        AudioServicesPlaySystemSound(resetSound)
        
        // Update goal status after brief animation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            let updatedGoal = GoalCardModel(
                id: goal.id,
                title: goal.title,
                competition: goal.competition,
                description: goal.description,
                icon: goal.icon,
                isCompleted: nil
            )
            
            // Update binding directly to ensure state changes
            goal = updatedGoal
            
            // End animation
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                withAnimation {
                    isResetting = false
                }
            }
        }
    }
    
    private func markAsFailed() {
        AudioServicesPlaySystemSound(failureSound)
        updateGoalStatus(isComplete: false)
    }
    
    private func playCompletionSound() {
        soundPlayer?.play()
        AudioServicesPlaySystemSound(completionSound)
    }
    
    private func updateGoalStatus(isComplete: Bool?) {
        let updatedGoal = GoalCardModel(
            id: goal.id,
            title: goal.title,
            competition: goal.competition,
            description: goal.description,
            icon: goal.icon,
            isCompleted: isComplete
        )
        
        goal = updatedGoal
    }
}
// Import statement for the ConfettiView component
import SwiftUI

// This component has been moved to a separate file: ConfettiView.swift

#Preview {
    struct PreviewWrapper: View {
        @State private var goal = GoalCardModel(
            id: 1,
            title: "7am Wakeup",
            competition: "Bestie Boots",
            description: "Wake up at 7am every day",
            icon: "🥱",
            isCompleted: nil
        )
        
        var body: some View {
            VStack {
                GoalCard(goal: $goal)
                
                Button("Reset") {
                    goal = GoalCardModel(
                        id: 1,
                        title: "7am Wakeup",
                        competition: "Bestie Boots",
                        description: "Wake up at 7am every day",
                        icon: "🥱",
                        isCompleted: nil
                    )
                }
                .padding()
            }
        }
    }
    
    return PreviewWrapper()
}
