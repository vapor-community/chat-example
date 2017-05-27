import Vapor

final class Routes: RouteCollection {
    private let view: ViewRenderer
    
    init(view: ViewRenderer) {
        self.view = view
    }
    
    func build(_ builder: RouteBuilder) throws {
        builder.get("/") { _ in try self.view.make("welcome.html") }
    }
}
