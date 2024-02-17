import { rooms } from "../classes/room.js"
import { emitError } from "../../../utils/emitter.js"
import { getHost, instantiateHost } from "../classes/controller.js"
import { validateRoomId } from "../../../utils/inputValidator.js"
import { createGame } from "../../../engine/gameLogic.js"

const hostHandler = (io, socket) => {
    const createRoom = ({ roomId }) => {
        // * Input validation
        const result = validateRoomId(roomId)
        if (result.error)
            return emitError(socket, "host:create:room", result.error.message)

        const host = getHost(socket.id)

        if (!host)
            return emitError(
                socket,
                "host:create:room",
                "Only host can create a room"
            )

        if (host.roomId)
            return emitError(
                socket,
                "host:create:room",
                "The host already created a room"
            )

        if (rooms.has(roomId))
            return emitError(
                socket,
                "host:create:room",
                "Room ID already exists"
            )

        // // TODO: For Jason to do what he wants with
        // const quizId = 1
        // const game = createGame(quizId)
        // console.log(game)

        host.createRoom(roomId)
    }

    const createHost = () => {
        let host = getHost(socket.id)
        if (host)
            return emitError(
                socket,
                "host:create",
                `The socket ID: ${socket.id}, is already a host.`
            )

        host = instantiateHost(socket, socket.id)
    }

    const closeRoom = async () => {
        const host = getHost(socket.id)
        if (!host)
            return emitError(socket, "host:close:room", "Host does not exist")

        if (!host.roomId)
            return emitError(
                socket,
                "host:close:room",
                "Host does not have a room"
            )

        const socketList = await io.in(host.roomId).fetchSockets()
        host.closeRoom(io, socketList)
    }

    socket.on("host:create", createHost)
    socket.on("host:create:room", createRoom)
    socket.on("host:close:room", closeRoom)
}

export default hostHandler
