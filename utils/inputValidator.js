import Joi from "joi"

const roomIdSchema = Joi.object({
    roomId: Joi.string().length(4).required(),
})

const nameSchema = Joi.object({
    name: Joi.string().required(),
})

export function validateRoomId(roomId) {
    return roomIdSchema.validate({ roomId })
}

export function validateName(name) {
    return nameSchema.validate({ name })
}
