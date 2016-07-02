import Vapor

extension WebSocket {
    func send(_ json: JSON) throws {
        let js = try JSON.serialize(json)
        try send(js.string)
    }
}
