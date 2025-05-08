// 📁 src/index.js

// Import layout components and route-based pages
import { Navbar } from "./components/Navbar.js";
import { Footer } from "./components/Footer.js";
import { Sidebar } from "./components/Sidebar.js";
import { Home } from "./pages/Home.js";
import { About } from "./pages/About.js";
import { Login } from "./pages/Login.js";
import { Register } from "./pages/Register.js";
import { ForgotPassword } from "./pages/ForgotPassword.js";
import { ResetPassword } from "./pages/ResetPassword.js";
import { Dashboard } from "./pages/Dashboard.js";
import { LevelDetailPage } from "./pages/LevelDetailPage.js";
import { ResourceCategoryPage } from "./pages/ResourceCategoryPage.js";
import { GuestResourcePage } from "./pages/GuestResourcePage.js";
import { DashboardLayout } from "./layouts/DashboardLayout.js";

// Wait for the DOM to load before routing
window.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) {
    console.error("❌ #app container not found in index.html");
    return;
  }

  // Apply base layout styles
  document.body.classList.add(
    "flex",
    "flex-col",
    "min-h-screen",
    "bg-light",
    "text-textMain"
  );
  app.classList.add("flex-grow");

  handleRouting();
  window.addEventListener("popstate", handleRouting); // Enable SPA-style navigation
});

// Main router logic
function handleRouting() {
  const app = document.getElementById("app");
  const path = window.location.pathname;

  // Check authentication status
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedIn = !!user || !!localStorage.getItem("adminToken");
  const appIsAdmin = !!localStorage.getItem("adminToken");

  // Clear previous content and layout elements
  app.innerHTML = "";
  document.querySelector("nav")?.remove();
  document.querySelector("aside")?.remove();
  document.querySelector("footer")?.remove();

  // Sidebar for authenticated users only
  if (loggedIn) {
    const sidebar = Sidebar();
    document.body.insertBefore(sidebar, app);
  }

  // Navbar is always visible
  const navbar = Navbar();
  document.body.insertBefore(navbar, app);

  // Route resolution logic
  switch (path) {
    case "/":
    case "/home":
      app.appendChild(Home());
      break;

    case "/about":
      app.appendChild(About());
      break;

    case "/login":
      app.appendChild(Login());
      break;

    case "/register":
      app.appendChild(Register());
      break;

    case "/forgot-password":
      app.appendChild(ForgotPassword());
      break;

    case "/reset-password":
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      app.appendChild(ResetPassword(token));
      break;

    case "/dashboard":
      app.appendChild(DashboardLayout(() => Dashboard()));
      break;

    case "/resources":
      if (loggedIn) {
        app.appendChild(DashboardLayout(() => ResourceCategoryPage()));
      } else {
        app.appendChild(GuestResourcePage());
      }
      break;

    case "/resources/primary":
      app.appendChild(DashboardLayout(() => LevelDetailPage("primary")));
      break;

    case "/resources/highschool":
      app.appendChild(DashboardLayout(() => LevelDetailPage("highschool")));
      break;

    default:
      // Handle category-level dynamic routing
      const match = path.match(
        /^\/resources\/(primary|highschool)\/(notes|exams|ebooks|schemes|lessons)$/
      );

      if (match) {
        const [, level, category] = match;
        app.appendChild(
          DashboardLayout(() => ResourceCategoryPage(level, category))
        );
      } else {
        app.innerHTML = `<div class="text-center py-20 text-red-600 text-xl">404 - Page Not Found</div>`;
      }
  }

  // Append the footer after page content
  const footer = Footer();
  document.body.appendChild(footer);

  // Enable dark mode toggle if present
  setupDarkModeToggle();

  // Animate the footer when it comes into view
  animateFooterOnScroll();
}

// Handles toggling of dark mode via UI switch
function setupDarkModeToggle() {
  const toggle = document.getElementById("darkToggle");
  const root = document.documentElement;
  if (toggle) {
    toggle.addEventListener("change", () => {
      root.classList.toggle("dark", toggle.checked);
    });
  }
}

// Adds a fade-in effect to footer on scroll
function animateFooterOnScroll() {
  const footer = document.getElementById("main-footer");
  if (!footer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add("visible");
          observer.unobserve(footer);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(footer);
}
