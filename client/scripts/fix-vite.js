// 📁 scripts/fix-vite.js
// 🔧 Ensures the Vite binary in node_modules is executable on Unix-based systems.
// This script is typically run in postinstall or setup environments to fix permission issues.

import { execSync } from "child_process"; // Used to run shell commands
import { platform } from "os"; // Used to detect the operating system

// Skip permission update if running on Windows
if (platform() !== "win32") {
  try {
    // ✅ Make Vite CLI executable (Unix systems only)
    execSync("chmod +x node_modules/.bin/vite");
  } catch (error) {
    // ❌ Log error if permission setting fails (can assist in diagnosing setup issues)
    console.error("Failed to set execute permission on Vite binary:", error);
  }
} else {
  // ℹ️ No action required for Windows environments
  // (Windows doesn't use Unix-style execution permissions)
}
