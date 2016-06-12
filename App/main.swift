import Vapor

var stargazers = 0
var activeSockets: [WebSocket] = []
View.renderers["html"] = HTMLRender()

let app = Application(workDir: workDir)

// MARK: Visit

app.get { req in
    var msg = JSON.object([:])
    msg["type"] = JSON("visit")
    msg["ip"] = req.headers["X-Forwarded-For"].flatMap { JSON($0) }
    try activeSockets.forEach { ws in try ws.send(msg) }

    return try app.view("welcome.html")
}

app.get("chat") { req in
    return try req.upgradeToWebSocket { ws in
//        ws.onFrame = { ws, frame in
//            print("Got payload: \(frame.payload.string)")
//            try ws.send("Hi From Sockets")
//        }
        ws.onText = { ws, text in
            print("Got text: \(text)")
            try ws.send("HIYA")
        }
        ws.onClose = { ws in
            print("CLOSED")
        }
        print("Here")
    }
}

/*
 STYLE SOURCE:
 http://codepen.io/supah/pen/jqOBqp?utm_source=bypeople
 */

// MARK: Web Hook

app.post("gh-webhook") { req in
    guard
        let stars = req.data["repository", "stargazers_count"].int,
        let repo = req.data["repository", "name"]?.string
        else { return Response(status: .ok) } // ok to gh ping
    stargazers = stars

    var msg = JSON.object([:])
    msg["type"] = JSON("stars")
    msg["count"] = JSON(stars)
    msg["repo-name"] = JSON(repo)
    try activeSockets.forEach { ws in try ws.send(msg) }

    return Response(status: .ok)
}

// MARK: Socket Listeners

app.get("updates") { req in
    return try req.upgradeToWebSocket { ws in
        activeSockets.append(ws)
        ws.onClose = { _ in
            activeSockets = activeSockets.filter { $0 !== ws }
        }
    }
}

app.start()

