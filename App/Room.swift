import Vapor

class Room {
    var connections: [String: WebSocket]

    func bot(_ message: String) throws {
        try send(name: "Bot", message: message)
    }

    func send(name: String, message: String) throws {
        let message = message.truncated(to: 256)

        let text = JSON([
            "username": name,
            "message": message
        ]).serialize()

        for (username, socket) in connections {
            guard username != name else {
                continue
            }

            try socket.send(text)
        }
    }

    init() {
        connections = [:]
    }
}
