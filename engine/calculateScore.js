/*
File: calculateScore.js

Description:
This file provides functionality for correcting different types of questions.
*/

export function calculateScore(question, playerAnswer, answerTime) {
    
    // Switch based on the question type
    switch (question.type) {
        case 'multiple-choice':
            return multipleChoice(playerAnswer, question.correctAnswer)
        case 'multiple-answer':
            return multipleAnswer(playerAnswer, question.correctAnswer)
        case 'map':
            return mapAnswer(playerAnswer, question.correctAnswer)
        default:
            console.error(`Unsupported question type: ${question.type}`)
            return 0
    }
}

// Calculate score for multiple choice question
function multipleChoice(playerAnswer, correctAnswer) {
    return playerAnswer === correctAnswer ? 1 : 0
}

// Calculate score for multiple answer question
function multipleAnswer(playerAnswer, correctAnswer) {
    let score = 0
    for (const answer of playerAnswer) {
        if (answer in correctAnswer) {
            score++
        } else {
            score--
        }
    }
    return score
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

// TODO: Got from the internet!
function calculateDistance(playerAnswer, correctAnswer) {
    const R = 6371 // Earth's radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const playerRadLat = toRadians(playerAnswer.lat)
    const playerRadLong = toRadians(playerAnswer.long)
    const correctRadLat = toRadians(correctAnswer.lat)
    const correctRadLong = toRadians(correctAnswer.long)

    // Calculate the differences in coordinates
    const diffLatitude = playerRadLat - correctRadLat
    const diffLongitude = playerRadLong - correctRadLong

    // Haversine formula
    const a = Math.sin(diffLatitude / 2) * Math.sin(diffLatitude / 2) +
              Math.cos(playerRadLat) * Math.cos(correctRadLat) *
              Math.sin(diffLongitude / 2) * Math.sin(diffLongitude / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    // Distance in kilometers
    const distance = Math.abs(R * c)

    return distance
}

// Calculate score for map question
function mapAnswer(playerAnswer, correctAnswer) {
    const distance = calculateDistance(playerAnswer, correctAnswer)
    const approvedRange = 100

    let score = 0

    if (distance < approvedRange) {
        score = 1 - distance / approvedRange
    }

    return score
}
