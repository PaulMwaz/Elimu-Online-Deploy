export function Register() {
  const section = document.createElement("section");
  section.className =
    "min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-24";
  section.style.backgroundImage = "url('/images/register-bg.jpg')";

  // ✅ Use Vite environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("🔗 API_BASE_URL:", API_BASE_URL);

  section.innerHTML = `
    <div class="bg-white bg-opacity-90 backdrop-blur-md p-6 md:p-8 rounded shadow-lg w-full max-w-[380px] md:max-w-[420px]">
      <h1 class="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-2">Create Your Account</h1>
      <p class="text-sm text-center text-gray-700 mb-6">Join Elimu-Online to access learning materials.</p>

      <label class="block text-sm font-medium mb-1">Full Name</label>
      <div class="mb-4">
        <input id="registerName" type="text" placeholder="Full Name" class="w-full p-2 border rounded focus:outline-blue-500" autofocus />
      </div>

      <label class="block text-sm font-medium mb-1">Email</label>
      <div class="relative mb-4">
        <span class="absolute top-2.5 left-3 text-gray-400">📧</span>
        <input id="registerEmail" type="email" placeholder="Email" class="w-full pl-10 pr-3 py-2 border rounded focus:outline-blue-500" />
      </div>

      <label class="block text-sm font-medium mb-1">Password</label>
      <div class="relative mb-4">
        <span class="absolute top-2.5 left-3 text-gray-400">🔒</span>
        <input id="registerPassword" type="password" placeholder="Password" class="w-full pl-10 pr-10 py-2 border rounded focus:outline-blue-500" />
        <button type="button" id="togglePassword" class="absolute top-2.5 right-3 text-sm text-blue-600">Show</button>
      </div>

      <label class="block text-sm font-medium mb-1">Confirm Password</label>
      <div class="relative mb-4">
        <span class="absolute top-2.5 left-3 text-gray-400">🔒</span>
        <input id="confirmPassword" type="password" placeholder="Confirm Password" class="w-full pl-10 pr-3 py-2 border rounded focus:outline-blue-500" />
      </div>

      <div class="flex items-center mb-4">
        <input type="checkbox" id="rememberMe" class="mr-2" />
        <label for="rememberMe" class="text-sm">Remember me</label>
      </div>

      <button id="registerBtn" class="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">
        Register
      </button>

      <p class="text-sm mt-4 text-center">
        Already have an account?
        <a href="/login" data-link class="text-blue-600 hover:underline">Login here</a>
      </p>

      <div id="registerMessage" class="mt-4 text-sm text-center"></div>
    </div>
  `;

  setTimeout(() => {
    const toggleBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("registerPassword");
    const confirmInput = document.getElementById("confirmPassword");
    const msgBox = document.getElementById("registerMessage");

    toggleBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      confirmInput.type = isHidden ? "text" : "password";
      toggleBtn.textContent = isHidden ? "Hide" : "Show";
    });

    document.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState({}, "", link.getAttribute("href"));
        window.dispatchEvent(new Event("popstate"));
      });
    });

    document
      .getElementById("registerBtn")
      .addEventListener("click", async () => {
        const full_name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        msgBox.innerHTML = "";

        if (!full_name || !email || !password || !confirmPassword) {
          msgBox.innerHTML = `<span class="text-red-600">❌ Please fill all fields.</span>`;
          return;
        }

        if (password !== confirmPassword) {
          msgBox.innerHTML = `<span class="text-red-600">❌ Passwords do not match.</span>`;
          return;
        }

        msgBox.innerHTML = `<span class="text-gray-600">⏳ Registering...</span>`;

        try {
          const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, email, password }),
          });

          const contentType = response.headers.get("Content-Type");
          console.log("📩 Server responded with Content-Type:", contentType);

          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("📦 JSON response from server:", data);

            if (response.ok) {
              msgBox.innerHTML = `<span class='text-green-600'>🎉 Registration successful! <a href="/login" data-link class="text-blue-600 underline">Login</a>.</span>`;
              document.getElementById("registerName").value = "";
              document.getElementById("registerEmail").value = "";
              passwordInput.value = "";
              confirmInput.value = "";
              document.getElementById("rememberMe").checked = false;
            } else {
              msgBox.innerHTML = `<span class='text-red-600'>❌ ${
                data.error || "Registration failed."
              }</span>`;
              console.error("❌ Server-side error:", data);
            }
          } else {
            msgBox.innerHTML = `<span class='text-red-600'>❌ Unexpected server response. Not JSON.</span>`;
            const rawText = await response.text();
            console.error("❌ Non-JSON response text:", rawText);
          }
        } catch (err) {
          msgBox.innerHTML = `<span class='text-red-600'>❌ ${err.message}</span>`;
          console.error("🔥 Network or parsing error:", err);
        }
      });
  }, 100);

  return section;
}
