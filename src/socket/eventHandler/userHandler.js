import { emitError } from "../../../utils/emitter.js"
import { validateName, validateRoomId } from "../../../utils/inputValidator.js"
import { getUser, instantiateUser } from "../classes/controller.js"
import { rooms } from "../classes/room.js"

const userHandler = (io, socket) => {
    const createUser = ({ name }) => {
        // * Input validation
        const result = validateName(name)
        if (result.error)
            return emitError(socket, "user:create", result.error.message)

        let user = getUser(socket.id)

        if (user)
            return emitError(
                socket,
                "user:create",
                `User name ${socket.id}, is already a user.`
            )

        user = instantiateUser(socket, socket.id, name)
    }

    const joinRoom = ({ roomId }) => {
        // * Input validation
        const result = validateRoomId(roomId)
        if (result.error)
            return emitError(socket, "user:join:room", result.error.message)

        const user = getUser(socket.id)

        if (!user)
            return emitError(socket, "user:join:room", "User does not exist")

        if (!rooms.has(roomId))
            return emitError(socket, "user:join:room", "Room ID does not exist")

        if (user?.roomId)
            return emitError(socket, "user:join:room", "User already in a room")

        user.join(io, roomId)
    }

    const leaveRoom = () => {
        const user = getUser(socket.id)

        if (!user)
            return emitError(socket, "user:leave:room", "User does not exist")

        if (!user.roomId)
            return emitError(socket, "user:leave:room", "User is not in a room")

        user.leave(io)
    }

    socket.on("user:create", createUser)
    socket.on("user:join:room", joinRoom)
    socket.on("user:leave:room", leaveRoom)
}

export default userHandler
