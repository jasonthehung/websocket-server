import { emitSuccess } from "../../../utils/emitter.js"
import { event_user } from "../../../utils/debugger.js"

export class User {
    #socket
    #name
    #roomId
    #status
    #role

    constructor(socket, name) {
        this.#socket = socket
        this.#name = name
        this.#roomId = null
        this.#status = "pending"
        this.#role = "user"

        emitSuccess(socket, "user:create", {
            name: this.#name,
            status: this.#status,
        })

        event_user(`User: ${this.#name}, Socket ID: ${this.#socket.id} created`)
    }

    get name() {
        return this.#name
    }

    get roomId() {
        return this.#roomId
    }

    get status() {
        return this.#status
    }

    get role() {
        return this.#role
    }

    join(io, roomId) {
        this.#socket.join(roomId)
        this.#roomId = roomId
        this.#status = "ready"

        io.to(this.#roomId).emit("user:join:room", {
            result: "success",
            response: {
                roomId: this.#roomId,
                message: `User ${this.#name} joined room ${this.#roomId}`,
            },
        })

        event_user(
            `User: ${this.#name}, Socket ID: ${this.#socket.id} joined room: ${
                this.#roomId
            }`
        )
    }

    leave(io) {
        const roomId = this.#roomId
        const socketId = this.#socket.id

        this.#socket.leave(roomId)
        this.#roomId = null
        this.#status = "pending"

        io.to(roomId).emit("user:leave:room", {
            result: "success",
            response: {
                name: this.#name,
                roomId: roomId,
                message: `User ${this.#name} left room ${roomId}`,
            },
        })

        io.to(socketId).emit("user:leave:room", {
            result: "success",
            response: {
                name: this.#name,
                roomId: roomId,
                message: `You left room ${roomId}`,
            },
        })

        event_user(
            `User: ${this.#name}, Socket ID: ${
                this.#socket.id
            } left room: ${roomId}`
        )
    }
}
