class Room {
    #rooms
    constructor() {
        this.#rooms = new Set()
    }

    add(roomId) {
        this.#rooms.add(roomId)
    }

    remove(roomId) {
        this.#rooms.delete(roomId)
    }

    has(roomId) {
        return this.#rooms.has(roomId)
    }

    clear() {
        this.#rooms.clear()
    }

    size() {
        return this.#rooms.size
    }
}

export const rooms = new Room()
