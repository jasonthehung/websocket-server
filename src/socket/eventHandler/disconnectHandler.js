import { getSocketRole, getHost, getUser } from "../classes/controller.js"
import { event_server } from "../../../utils/debugger.js"

const disconnectHandler = (io, socket) => {
    const onDisconnect = async () => {
        const role = getSocketRole(socket.id)

        if (role === "host") {
            const host = getHost(socket.id)
            const socketList = await io.in(host.roomId).fetchSockets()

            handleHostDisconnect(socketList)
            event_server(`Host: ${socket.id} disconnected`)
            return
        }

        if (role === "user") {
            const user = getUser(socket.id)
            const socketList = await io.in(user.roomId).fetchSockets()

            handleUserDisconnect(socket, socketList)
            event_server(
                `User: ${user.name}, Socket ID: ${socket.id} disconnected`
            )
            return
        }

        socket.disconnect()

        event_server(`Socket ID: ${socket.id} disconnected`)
    }

    const handleHostDisconnect = (socketList) => {
        const host = getHost(socket.id)
        const roomId = host.roomId

        if (roomId) {
            host.closeRoom(socketList)

            socketList.forEach((socket) => {
                io.to(socket.id).emit("user:disconnect", {
                    result: "success",
                    response: {
                        message: `Room ID: ${roomId} closed, due to host disconnected`,
                    },
                })
            })
        }
    }

    const handleUserDisconnect = () => {
        const user = getUser(socket.id)
        const roomId = user.roomId

        if (roomId) {
            user.leave()
        }
    }

    socket.on("disconnect", onDisconnect)
}

export default disconnectHandler
