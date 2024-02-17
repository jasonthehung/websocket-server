import { rooms } from "./room.js"
import { getUser } from "./controller.js"
import { emitSuccess } from "../../../utils/emitter.js"
import { event_host } from "../../../utils/debugger.js"

export class Host {
    #socket
    #roomId
    #status
    #role

    constructor(socket) {
        this.#socket = socket
        this.#roomId = null
        this.#status = "pending"
        this.#role = "host"

        emitSuccess(this.#socket, "host:create", {
            status: this.#status,
        })

        event_host(`Socket ID: ${this.#socket.id} created as host`)
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

    createRoom(roomId) {
        this.#socket.join(roomId)
        this.#roomId = roomId
        this.#status = "ready"

        rooms.add(roomId)

        emitSuccess(this.#socket, "host:create:room", {
            roomId: this.#roomId,
        })

        event_host(`Host ${this.#socket.id} created room: ${this.#roomId}`)
    }

    closeRoom(io, socketList) {
        const roomId = this.#roomId

        socketList
            .filter((socket) => socket.id !== this.#socket.id)
            .forEach((socket) => {
                const user = getUser(socket.id)
                console.log(user)
                user.leave(io)
            })

        this.#socket.leave(this.#roomId)
        this.#roomId = null
        this.#status = "pending"

        rooms.remove(roomId)

        emitSuccess(this.#socket, "host:close:room", {
            roomId: roomId,
        })

        event_host(`Host ${this.#socket.id} closed room: ${roomId}`)
    }
}
