
/*
File: gameLogic.js

Description:
This file encapsulates the game logic for managing quiz sessions. It includes functions for creating games, loading quizzes, adding players, advancing through game phases, processing player answers, and retrieving results. These functions should be used to update game components. The classes and utility functions required for the game logic are imported from the 'gameComponents' and 'calculateScore' files in the same directory.

General TODOs:
- Consider organizing questions in order rather than depending on a round ID.
- Evaluate the need to keep track of the "phase" of the game.
- Decide whether to send the entire quiz to clients at the start or send questions individually during events.
*/

import { Game, Question, Quiz } from "./gameComponents.js"
import { calculateScore } from "./calculateScore.js"
import axios from "axios"

/**
 * Creates a new game.
 *
 * @param {string} id - The unique identifier for the game.
 * @param {string} host - The host of the game.
 * @param {string} quizId - The identifier for the chosen quiz.
 * @returns {Game} The newly created game.
 */
export async function createGame(quizId) {
    const quiz = await getQuiz(quizId)
    const newGame = new Game(quizId, quiz)
    return newGame
}

// TODO: Return real data from the database instead of hardcoded dummy data. 
/**
 * Loads a quiz from the database.
 *
 * @param {string} quizId - The identifier for the quiz.
 * @returns {Quiz} The loaded quiz.
 */
async function getQuiz(quizId) {
    // Check if quizId is undefined
    if (quizId == null) {
        return null
    }

    //TODO: Remove when not testing
    quizId = 1

    try {
        const response = await axios.get(`http://localhost:3000/api/quiz?quizid=${quizId}`)
        const quizData = response.data

        let quiz

        if (quizData.length > 0) {
            let questions = []
            for (const question of quizData) {
                if (question.questionid != null) {
                    questions.push(new Question({
                        id: question.questionid,
                        question: question.question,
                        answers: question.alternatives,
                        type: question.type,
                        correctAnswer: question.answer,
                        round: question.roundid
                    }))
                }
            }

            quiz = new Quiz({
                id: quizData[0].quizid,
                name: quizData[0].title,
                description: quizData[0].description,
                questions: questions,
                answerTime: null
            })

            console.log(quiz)
            return quiz
        } else {
            console.log("Quiz length is zero")
            return null
        }
    } catch (error) {
        // Handle errors
        console.error('Error:', error)
        return null
    }
}


/**
 * Adds a player to a game with an initial score of zero.
 *
 * @param {Game} game - The game to join.
 * @param {string} playerId - The unique identifier for the player.
 * @param {string} playerName - The name of the player.
 * @returns {Player} The added player.
 */
export function joinGame(game, playerId, playerName) {
    return game.addPlayer(playerId, playerName)
}

/**
 * Updates the game state and returns the next question.
 *
 * @param {Game} game - The current game.
 * @returns {Question} The next question.
 */
export function nextQuestion(game) {
    const round = game.state.startQuestionPhase()
    const question = game.quiz.getQuestion(round)
    return question
}

/**
 * Processes a player's answer and updates the scoreboard.
 *
 * @param {Game} game - The current game.
 * @param {string} playerId - The unique identifier for the player.
 * @param {string} playerAnswer - The player's answer to the current question.
 * @param {number} answerTime - The time taken by the player to answer.
 * @returns {number} The updated score for the player.
 */
export function processPlayerAnswer(game, playerId, playerAnswer, answerTime) {
    const question = game.getCurrentQuestion()
    const score = calculateScore(question, playerAnswer, answerTime)
    const player = game.getPlayer(playerId)
    const updatedScore = player.updateScore(score)
    return updatedScore
}

/**
 * Returns the current scoreboard.
 *
 * @param {Game} game - The current game.
 * @returns {Player[]} The current scoreboard.
 */
export function getResult(game) {
    game.state.startResultPhase()
    const scoreboard = game.players
    return scoreboard
}
