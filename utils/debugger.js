import debugModule from "debug"

export const event_server = new debugModule("event:server")
export const event_host = new debugModule("event:host")
export const event_user = new debugModule("event:user")
export const event_room = new debugModule("event:room")

event_server.enabled = true
event_host.enabled = true
event_user.enabled = true
event_room.enabled = true
