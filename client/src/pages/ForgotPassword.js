// 📌 Component: ForgotPassword - Handles password reset requests via email
export function ForgotPassword() {
  const section = document.createElement("section");
  section.className =
    "min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24";

  // 🔧 Detect environment (local or production)
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const API_BASE_URL = isLocal
    ? "http://localhost:5555"
    : "https://elimu-online.onrender.com";

  // 🧱 Form UI structure
  section.innerHTML = `
    <div class="bg-white bg-opacity-95 backdrop-blur-md p-6 md:p-8 rounded-lg shadow-md w-full max-w-md animate-fade-in">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-2">Forgot Password</h2>
      <p class="text-sm text-gray-600 text-center mb-6">Enter your email to receive a password reset link.</p>

      <form id="forgotForm" class="space-y-4">
        <input 
          id="emailInput" 
          type="email" 
          placeholder="Enter your email address"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button 
          type="submit"
          id="submitBtn"
          class="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200"
        >
          Send Reset Link
        </button>
      </form>

      <div id="messageBox" class="mt-4 text-center text-sm"></div>
    </div>
  `;

  // 🛠️ Bind form submission logic after DOM is rendered
  setTimeout(() => {
    const form = document.getElementById("forgotForm");
    const emailInput = document.getElementById("emailInput");
    const msgBox = document.getElementById("messageBox");
    const submitBtn = document.getElementById("submitBtn");

    // 🔁 Submit handler: send email to backend for reset
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      msgBox.innerHTML = `<span class="text-gray-600">Sending reset link...</span>`;
      submitBtn.disabled = true;

      try {
        const res = await fetch(`${API_BASE_URL}/api/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const result = await res.json();

        if (res.ok) {
          msgBox.innerHTML = `<span class='text-green-600'>${result.message}</span>`;
        } else {
          msgBox.innerHTML = `<span class='text-red-600'>${result.error}</span>`;
        }
      } catch (err) {
        msgBox.innerHTML = `<span class='text-red-600'>Network error: ${err.message}</span>`;
      } finally {
        submitBtn.disabled = false;
      }
    });
  }, 100);

  return section;
}
