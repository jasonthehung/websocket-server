import { app, server } from "./socket/socket.js"

import { event_server } from "../utils/debugger.js"
import express from "express"

const PORT = 8080

app.use(express.json()) // to parse the incoming requests with JSON payloads (from req.body)

app.get("*", (req, res) => {
    res.send("Hello Quizzy!")
})

server.listen(PORT, () => {
    event_server(`Server is running on port ${PORT}`)
})

 export default app;
