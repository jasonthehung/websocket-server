import { Host } from "./host.js"
import { User } from "./user.js"

const socketInfoMap = new Map()

export function getSocketRole(socketId) {
    return socketInfoMap.get(socketId)?.role
}

export function getUser(socketId) {
    return socketInfoMap.get(socketId)
}

export function instantiateUser(socket, socketId, name) {
    socketInfoMap.set(socketId, new User(socket, name))
    return socketInfoMap.get(socketId)
}

export function instantiateHost(socket, socketId) {
    socketInfoMap.set(socketId, new Host(socket))
    return socketInfoMap.get(socketId)
}

export function getHost(socketId) {
    return socketInfoMap.get(socketId)
}
