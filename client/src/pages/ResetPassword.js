// Renders the Reset Password UI and handles password reset logic
export function ResetPassword(token) {
  const section = document.createElement("section");
  section.className =
    "min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24";

  // Determine environment and API endpoint
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const API_BASE_URL = isLocal
    ? "http://localhost:5555"
    : "https://elimu-online.onrender.com";

  // Inject HTML structure for password reset form
  section.innerHTML = `
    <div class="bg-white shadow-xl p-6 md:p-8 rounded-lg w-full max-w-md relative">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-4">Reset Your Password</h2>
      <p class="text-sm text-center text-gray-600 mb-6">Enter and confirm your new password below.</p>

      <div class="relative mb-4">
        <input id="newPassword" type="password" placeholder="New Password"
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
        <span id="toggleNew" class="absolute right-3 top-2.5 cursor-pointer text-gray-500">👁️</span>
        <div id="strengthMeter" class="text-xs mt-1 pl-1 font-medium"></div>
      </div>

      <div class="relative mb-4">
        <input id="confirmPassword" type="password" placeholder="Confirm Password"
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
        <span id="toggleConfirm" class="absolute right-3 top-2.5 cursor-pointer text-gray-500">👁️</span>
      </div>

      <button id="resetBtn"
        class="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">
        Reset Password
      </button>

      <div id="resetMessage" class="mt-4 text-sm text-center"></div>
    </div>
  `;

  // Initialize interactive logic after DOM loads
  setTimeout(() => {
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const resetBtn = document.getElementById("resetBtn");
    const msgBox = document.getElementById("resetMessage");
    const toggleNew = document.getElementById("toggleNew");
    const toggleConfirm = document.getElementById("toggleConfirm");
    const strengthMeter = document.getElementById("strengthMeter");

    // Toggle new password visibility
    toggleNew.addEventListener("click", () => {
      const type = newPasswordInput.type === "password" ? "text" : "password";
      newPasswordInput.type = type;
      toggleNew.textContent = type === "text" ? "🙈" : "👁️";
    });

    // Toggle confirm password visibility
    toggleConfirm.addEventListener("click", () => {
      const type =
        confirmPasswordInput.type === "password" ? "text" : "password";
      confirmPasswordInput.type = type;
      toggleConfirm.textContent = type === "text" ? "🙈" : "👁️";
    });

    // Password strength meter logic
    newPasswordInput.addEventListener("input", () => {
      const val = newPasswordInput.value;
      const strength = getStrength(val);
      strengthMeter.textContent = `Strength: ${strength.label}`;
      strengthMeter.style.color = strength.color;
    });

    // Evaluate password strength score
    function getStrength(password) {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[@$!%*?&#]/.test(password)) score++;

      if (score >= 4) return { label: "Strong", color: "green" };
      if (score >= 2) return { label: "Medium", color: "orange" };
      return { label: "Weak", color: "red" };
    }

    // Handle reset button click
    resetBtn.addEventListener("click", async () => {
      const newPassword = newPasswordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();

      msgBox.innerHTML = "";

      // Validate inputs
      if (!newPassword || !confirmPassword) {
        msgBox.innerHTML = `<span class='text-red-600'>❌ Please fill in both password fields.</span>`;
        return;
      }

      if (newPassword !== confirmPassword) {
        msgBox.innerHTML = `<span class='text-red-600'>❌ Passwords do not match.</span>`;
        return;
      }

      msgBox.textContent = "Resetting password...";

      try {
        const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, new_password: newPassword }),
        });

        const result = await res.json();

        // Display success or failure
        if (res.ok) {
          msgBox.innerHTML = `<span class="text-green-600">✅ Password updated successfully! Redirecting to login...</span>`;
          setTimeout(() => {
            history.pushState({}, "", "/login");
            window.dispatchEvent(new Event("popstate"));
          }, 3000);
        } else {
          msgBox.innerHTML = `<span class="text-red-600">❌ ${
            result.error || "Something went wrong."
          }</span>`;
        }
      } catch (err) {
        msgBox.innerHTML = `<span class="text-red-600">❌ Network error: ${err.message}</span>`;
      }
    });
  }, 100);

  return section;
}
