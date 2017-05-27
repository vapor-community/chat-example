import Foundation

extension String {
    func truncated(to max: Int) -> String {
        if characters.count > max {
            return substring(
                to: index(
                    startIndex,
                    offsetBy: max
                )
            )
        }

        return self
    }
}
