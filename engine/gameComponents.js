
/*
File: gameComponents.js

Description:
This file contains the game components used for managing a game. 
It includes classes for Question, Quiz, Player, GameState, and Game.
*/

/**
 * Class representing a quiz question.
 * @class
 * @methods
 * - constructor(id, question, answers, type, correctAnswer, round)
 */
export class Question {
    constructor({id, question, answers, type, correctAnswer, round}) {
        this.id = id
        this.question = question
        this.answers = answers
        this.type = type
        this.correctAnswer = correctAnswer
        this.round = round
    }
}

/**
 * Class representing a quiz.
 * @class
 * @methods
 * - constructor(id, name, description, questions, answerTime)
 * - getQuestion(round)
 */
export class Quiz {
    constructor({id, name, description, questions, answerTime}) {
        this.id = id
        this.name = name
        this.description = description
        this.questions = questions
        this.answerTime = answerTime
    }

    getQuestion(round) {
        return this.questions.find(question => question.round === round)
    }

    addQuestion(questions) {
        for (question in questions)
            this.questions.push(question)
    }
}


/**
 * Class representing a quiz.
 * @class
 * @methods
 * - constructor(id, name, description, questions, answerTime)
 * - getQuestion(round)
 */
export class Player {
    constructor(id, name) {
        this.id = id
        this.name = name
        this.score = 0
    }

    updateScore(score) {
        return this.score += score
    }
}

/**
 * Class representing the state of a game.
 * @class
 * @methods
 * - constructor(totalQuestions)
 * - startQuestionPhase()
 * - startResultPhase()
 */
export class GameState {
    constructor(totalQuestions) {
        this.phase = "waiting"
        this.currentRound = 0
        this.totalQuestions = totalQuestions
    }

    // Internal method
    _updatePhase(newPhase, validPreviousPhases) {
        if (validPreviousPhases.includes(this.phase)) {
            this.phase = newPhase
        } else {
            throw new Error(`Invalid state transition. Cannot move to '${newPhase}'. The current phase is '${this.phase}'.`)
        }
    }

    // External methods
    startQuestionPhase() {
        this._updatePhase("question", ["waiting", "result"])
        this.currentRound += 1
        return this.currentRound
    }

    startResultPhase() {
        this._updatePhase("result", ["question"])
    }
}

/**
 * Class representing a game.
 * @class
 * @methods
 * - constructor(id, host, quiz)
 * - addPlayer(playerId, playerName)
 * - removePlayer(playerId)
 * - getCurrentQuestion()
 * - getPlayer(playerId)
 */
// TODO: Is the host field/attribute needed?
export class Game {
    constructor(id, quiz) {
        this.id = id
        this.host = "TODO"
        this.quiz = quiz
        this.players = {}
        this.state = new GameState(quiz.questions.length, quiz.answerTime)
    }

    addPlayer(playerId, playerName) {

        // Check if id already exists
        if (this.players.hasOwnProperty(playerId)) {
            console.error(`Player with ID ${playerId} already exists in the game.`)
            return
        }

        // Check if name already exists
        const existingPlayer = Object.values(this.players).find(player => player.name === playerName)
        if (existingPlayer) {
            console.error(`Player with name '${playerName}' already exists in the game.`)
            return
        }

        // Add the new player
        this.players[playerId] = new Player(playerId, playerName)
    }

    removePlayer(playerId) {

        // Check if player exists
        if (!this.players.hasOwnProperty(playerId)) {
            console.error(`Player with ID ${playerId} does not exist in the game.`)
            return
        }

        // Remove the player
        delete this.players[playerId]
    }

    getCurrentQuestion() {
        const currentRound = this.state.currentRound
        const currentQuestion = this.quiz.getQuestion(currentRound)
        return currentQuestion
    }

    getPlayer(playerId) {

        // Check if player exists
        if (!this.players.hasOwnProperty(playerId)) {
            console.error(`Player with ID ${playerId} does not exist in the game.`)
            return
        }

        // Update player score
        return this.players[playerId]
    }
}
