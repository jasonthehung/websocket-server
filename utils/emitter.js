export const emitError = (socket, errorEvent, errorMessage) => {
    socket.emit(errorEvent, {
        result: "error",
        message: errorMessage,
    })
}

export const emitSuccess = (socket, successEvent, payload) => {
    socket.emit(successEvent, {
        result: "success",
        response: payload,
    })
}
