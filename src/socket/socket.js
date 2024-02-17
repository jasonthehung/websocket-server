import { Server } from "socket.io"
import { event_server } from "../../utils/debugger.js"
import express from "express"
import http from "http"
import { instrument } from "@socket.io/admin-ui"
import registerDisconnectHandler from "./eventHandler/disconnectHandler.js"
import registerHostHandler from "./eventHandler/hostHandler.js"
import registerUserHandler from "./eventHandler/userHandler.js"
import registerGameHandler from "./eventHandler/gameHandler.js"

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: "*",
    },
})

const onConnection = (socket) => {
    event_server(`Socket ID: ${socket.id} connected`)

    // * Host event handler
    registerHostHandler(io, socket)

    // * User event handler
    registerUserHandler(io, socket)

    // * Game event handler
    registerGameHandler(io, socket)

    // * Disconnect event handler
    registerDisconnectHandler(io, socket)
}

instrument(io, {
    auth: {
        type: "basic",
        username: "admin",
        password:
            "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS",
    },
})

io.on("connection", onConnection)

export { io, app, server }
