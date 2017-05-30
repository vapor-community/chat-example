import PackageDescription

let package = Package(
    name: "VaporChat",
    targets: [
        Target(name: "App"),
        Target(name: "Run", dependencies: ["App"])
    ],
    dependencies: [
        .Package(url: "https://github.com/vapor/vapor.git", majorVersion: 2),
    ],
    exclude: [
        "Config",
        "Database",
        "Public",
        "Resources",
    ]
)
