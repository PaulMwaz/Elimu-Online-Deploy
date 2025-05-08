// 📁 src/components/Navbar.js
// 📌 Navigation bar component for both guest and logged-in users

export function Navbar() {
  const nav = document.createElement("nav");
  nav.className = `
    bg-blue-600 text-white px-6 py-4 shadow fixed top-0 left-0 right-0 z-30 w-full
  `;

  // 🧱 Define structure of navbar based on login state
  nav.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="text-xl font-bold whitespace-nowrap">Elimu-Online</span>

      <div class="flex items-center gap-4">
        ${
          isLoggedIn()
            ? `<button id="sidebarToggle" class="text-white text-2xl md:hidden focus:outline-none">☰</button>`
            : `<button id="mobileMenuToggle" class="text-white text-2xl md:hidden focus:outline-none">☰</button>`
        }

        <div id="navLinks" class="hidden md:flex gap-4 items-center text-sm font-medium">
          ${
            isLoggedIn()
              ? `
                <span class="flex items-center gap-2">
                  👋 <span class="font-semibold">Welcome, ${getUserName()}</span>
                </span>
                <button id="logoutBtn" class="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition">Logout</button>
              `
              : `
                <a href="/" data-link class="hover:text-blue-200 transition">Home</a>
                <a href="/about" data-link class="hover:text-blue-200 transition">About</a>
                <a href="/resources" data-link class="hover:text-blue-200 transition">Resources</a>
                <a href="/login" data-link class="hover:text-blue-200 transition">Login</a>
                <a href="/register" data-link class="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded hover:bg-blue-200 transition">Register</a>
              `
          }
        </div>
      </div>
    </div>

    ${
      !isLoggedIn()
        ? `<div id="mobileMenu" class="md:hidden hidden flex-col gap-2 mt-4 text-sm font-medium">
              <a href="/" data-link class="block hover:text-blue-200">Home</a>
              <a href="/about" data-link class="block hover:text-blue-200">About</a>
              <a href="/resources" data-link class="block hover:text-blue-200">Resources</a>
              <a href="/login" data-link class="block hover:text-blue-200">Login</a>
              <a href="/register" data-link class="block bg-white text-blue-700 font-semibold px-4 py-1.5 rounded hover:bg-blue-200 transition">Register</a>
          </div>`
        : ""
    }
  `;

  setTimeout(() => {
    // 🌐 Enable client-side routing (SPA behavior)
    nav.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        history.pushState({}, "", href);
        window.dispatchEvent(new Event("popstate"));
      });
    });

    // 🔐 Attach logout logic
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", handleLogout);
    }

    // 📱 Sidebar toggle (admin mobile)
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        const sidebar = document.getElementById("mainSidebar");
        if (sidebar) sidebar.classList.toggle("-translate-x-full");
      });
    }

    // 📱 Mobile nav toggle (guest)
    const mobileToggle = document.getElementById("mobileMenuToggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        document.getElementById("mobileMenu")?.classList.toggle("hidden");
      });
    }
  }, 50);

  return nav;
}

// 🚪 Handles both guest and admin logout functionality
function handleLogout() {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const API_BASE_URL = isLocal
    ? "http://localhost:5555"
    : "https://elimu-online.onrender.com";

  const isAdmin = !!localStorage.getItem("adminToken");

  if (isAdmin) {
    fetch(`${API_BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    });
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  }
}

// 🧠 Check login state from localStorage
function isLoggedIn() {
  return localStorage.getItem("user") !== null;
}

// 🧾 Extracts the first name from user object
function getUserName() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const fullName = user?.full_name || "User";
    return fullName.split(" ")[0];
  } catch {
    return "User";
  }
}
