import Vapor

View.renderers["html"] = HTMLRender()

let app = Application(workDir: workDir)

// MARK: Visit

app.get { req in
    // Design from: http://codepen.io/supah/pen/jqOBqp?utm_source=bypeople
    return try app.view("welcome.html")
}

var room: [String: WebSocket] = [:]

func bot(_ message: String) throws {
    try send(name: "Bot", message: message)
}

func send(name: String, message: String) throws {
    let json = JSON([
        "username": name,
        "message": message
    ])
    let text = json.serialize()
    print(text)

    for (username, socket) in room {
        guard username != name else {
            continue
        }
        try socket.send(text)
    }
}

app.socket("chat") { req, ws in
    var username: String? = nil

    ws.onText = { ws, text in
        let json = try JSON.deserialize(text)
        print(json)

        if let u = json["username"]?.string {
            username = u
            room[u] = ws
            try bot("\(u) has joined.")
        }

        if let u = username, let m = json["message"]?.string {
            try send(name: u, message: m)
        }
    }

    ws.onClose = { ws, _, _, _ in
        guard let u = username else {
            return
        }

        try bot("\(u) has left")
        room.removeValue(forKey: u)
    }
}

app.start()

