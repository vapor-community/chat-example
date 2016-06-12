import Vapor

View.renderers["html"] = HTMLRender()

let app = Application(workDir: workDir)

// MARK: Visit

app.get { req in

    /*
     STYLE SOURCE:
     http://codepen.io/supah/pen/jqOBqp?utm_source=bypeople
     */
    return try app.view("welcome.html")
}

var chatters: [WebSocket] = []
func sendToChats(_ text: String, except sender: WebSocket) throws {
    try chatters.forEach { ws in
        guard ws !== sender else { return }
        try ws.send(text)
    }
}

app.get("chat") { req in
    return try req.upgradeToWebSocket { ws in
        chatters.append(ws)
        try sendToChats("A new member joined", except: ws)

        ws.onText = { ws, text in
            try sendToChats(text, except: ws)
        }
        ws.onClose = { ws, _, _, _ in
            chatters = chatters.filter { $0 !== ws }
        }
    }
}

app.start()

