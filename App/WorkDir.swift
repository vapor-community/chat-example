#if os(Linux)
let workDir = "./"
#else
var workDir: String {
    let parent = #file.characters.split(separator: "/").map(String.init).dropLast().joined(separator: "/")
    let path = "/\(parent)/.."
    return path
    }
#endif
