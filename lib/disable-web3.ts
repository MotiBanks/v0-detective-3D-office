// This file prevents Web3 conflicts by disabling any automatic Web3 injection
// It runs before any other code to ensure no conflicts with ethereum property

if (typeof window !== "undefined") {
  // Create a non-configurable empty ethereum object if it doesn't exist
  // This prevents other libraries from trying to redefine it
  if (!Object.prototype.hasOwnProperty.call(window, "ethereum")) {
    Object.defineProperty(window, "ethereum", {
      value: null,
      writable: false,
      configurable: false,
    })
  }

  // Also prevent web3 injection
  if (!Object.prototype.hasOwnProperty.call(window, "web3")) {
    Object.defineProperty(window, "web3", {
      value: null,
      writable: false,
      configurable: false,
    })
  }
}

export {}
