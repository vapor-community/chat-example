import Vapor

extension WebSocket {
    func send(_ json: JSON) throws {
        let js = json.serialize(.PrettyPrint)
        try send(js)
    }
}
