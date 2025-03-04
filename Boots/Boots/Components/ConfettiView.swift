//
//  ConfettiView.swift
//  Boots
//
//  Created by callum on 2025-03-03.
//

import SwiftUI

struct ConfettiView: View {
    @State private var confettiPieces = (0..<50).map { _ in ConfettiPiece() }
    
    var body: some View {
        ZStack {
            ForEach(0..<confettiPieces.count, id: \.self) { index in
                ConfettiPieceView(piece: confettiPieces[index])
            }
        }
        .onAppear {
            for i in 0..<confettiPieces.count {
                withAnimation(.easeOut(duration: Double.random(in: 1...3))
                    .delay(Double.random(in: 0...0.2))) {
                    confettiPieces[i].position.y = CGFloat.random(in: 100...300)
                    confettiPieces[i].position.x += CGFloat.random(in: -100...100)
                    confettiPieces[i].rotation = Double.random(in: 0...360)
                    confettiPieces[i].opacity = 0
                }
            }
        }
    }
}

struct ConfettiPiece: Identifiable {
    let id = UUID()
    var position = CGPoint(x: CGFloat.random(in: 120...240), y: 0)
    var rotation = Double.random(in: 0...360)
    var size = CGFloat.random(in: 5...10)
    var color = [Color.blue, Color.red, Color.yellow, Color.green, Color.purple, Color.orange].randomElement()!
    var opacity: Double = 1
}

struct ConfettiPieceView: View {
    let piece: ConfettiPiece
    
    var body: some View {
        Rectangle()
            .fill(piece.color)
            .frame(width: piece.size, height: piece.size)
            .position(piece.position)
            .rotationEffect(.degrees(piece.rotation))
            .opacity(piece.opacity)
    }
}