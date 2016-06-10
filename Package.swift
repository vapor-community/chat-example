import PackageDescription

let package = Package(
    name: "VaporApp",
    dependencies: [
        .Package(url: "https://github.com/loganwright/vapor.git", majorVersion: 0, minor: 42),
    ],
    exclude: [
	    "Config",
      "Database",
      "Localization",
      "Public",
      "Resources",
		  "Tests",
    ]
)
