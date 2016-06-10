import Vapor

class HTMLRender: RenderDriver {
    func render(template: String, context: [String: Any]) throws -> String {
        return template
    }
}
