import Vapor
import Foundation

let app = Application(workDir: workDir)

// MARK: Visit

app.get { req in
    // Design from: http://codepen.io/supah/pen/jqOBqp?utm_source=bypeople
    return try app.view("welcome.html")
}

// MARK: Sockets

let room = Room()

app.socket("chat") { req, ws in
    var username: String? = nil

    ws.onText = { ws, text in
        let json = try JSON.deserialize(text)

        if let u = json["username"]?.string {
            username = u
            room.connections[u] = ws
            try room.bot("\(u) has joined. 👋")
        }

        if let u = username, let m = json["message"]?.string {
            try room.send(name: u, message: m)
        }
    }

    ws.onClose = { ws, _, _, _ in
        guard let u = username else {
            return
        }

        try room.bot("\(u) has left")
        room.connections.removeValue(forKey: u)
    }
}

app.start()

