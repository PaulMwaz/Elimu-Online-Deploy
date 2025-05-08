export function Login() {
  const section = document.createElement("section");
  section.className =
    "min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-24";
  section.style.backgroundImage = "url('/images/slide4.jpg')";

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = user && user.full_name;

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const API_BASE_URL = isLocal
    ? "http://localhost:5555"
    : "https://elimu-online.onrender.com";

  section.innerHTML = `
    <div class="bg-white bg-opacity-90 backdrop-blur-md p-6 md:p-8 rounded shadow-lg w-full max-w-[380px] md:max-w-[420px]">
      <h1 class="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-2">
        Login to Elimu-Online
      </h1>
      <p class="text-sm text-center text-gray-700 mb-6">
        ${
          isLoggedIn
            ? `✅ You are already logged in as <strong>${user.full_name}</strong>.`
            : "Access premium resources by logging in."
        }
      </p>

      <div id="loginForm" class="space-y-4">
        ${
          !isLoggedIn
            ? `
          <input id="loginEmail" type="email" placeholder="Email" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />

          <div class="relative">
            <input id="loginPassword" type="password" placeholder="Password" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            <button type="button" id="togglePassword" class="absolute right-3 top-2 text-gray-500 text-sm">👁️</button>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center">
              <input type="checkbox" id="rememberMe" class="mr-2" />
              Remember me
            </label>
            <a href="/forgot-password" data-link class="text-blue-600 hover:underline">Forgot Password?</a>
          </div>

          <button id="loginBtn" class="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
            Login
          </button>

          <p class="text-center text-sm mt-4">
            Don’t have an account? <a href="/register" data-link class="text-blue-600 hover:underline">Register</a>
          </p>
        `
            : `
          <button id="logoutBtn" class="w-full py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition">Logout</button>
        `
        }

        <div id="loginMessage" class="mt-4 text-sm text-center"></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const msgBox = document.getElementById("loginMessage");

    const toggleBtn = document.getElementById("togglePassword");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const passwordInput = document.getElementById("loginPassword");
        passwordInput.type =
          passwordInput.type === "password" ? "text" : "password";
        toggleBtn.textContent = passwordInput.type === "password" ? "👁️" : "🙈";
      });
    }

    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        msgBox.innerHTML = "Logging in...";

        if (!email || !password) {
          msgBox.innerHTML = `<span class="text-red-600">❌ Please enter both email and password.</span>`;
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const contentType = response.headers.get("Content-Type");

          if (contentType && contentType.includes("application/json")) {
            const result = await response.json();

            if (response.ok && result.token) {
              localStorage.setItem("user", JSON.stringify(result.user));

              if (result.user.is_admin) {
                localStorage.setItem("adminToken", result.token);
              } else {
                localStorage.setItem("token", result.token);
              }

              msgBox.innerHTML = `<span class='text-green-600'>✅ Welcome, ${result.user.full_name}!</span>`;
              sessionStorage.setItem("showToast", "1");

              history.pushState({}, "", "/resources");
              window.dispatchEvent(new Event("popstate"));
            } else {
              msgBox.innerHTML = `<span class='text-red-600'>❌ ${
                result.error || "Login failed"
              }</span>`;
              console.error("❌ Login failed response:", result);
            }
          } else {
            msgBox.innerHTML = `<span class='text-red-600'>❌ Unexpected server response. Please try again.</span>`;
            console.error("❌ Server did not return JSON.");
          }
        } catch (error) {
          msgBox.innerHTML = `<span class='text-red-600'>❌ Network error: ${error.message}</span>`;
          console.error("❌ Login request failed:", error);
        }
      });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");

        history.pushState({}, "", "/login");
        window.dispatchEvent(new Event("popstate"));
      });
    }

    document.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState({}, "", link.getAttribute("href"));
        window.dispatchEvent(new Event("popstate"));
      });
    });
  }, 100);

  return section;
}
