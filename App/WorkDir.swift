struct WorkDir {
    static var file = fileDirectory()
}

private func fileDirectory() -> String {
    let parent = #file.characters.split(separator: "/").map(String.init).dropLast().joined(separator: "/")
    let path = "/\(parent)/"
    return path + "/.." // Back one directory
}
