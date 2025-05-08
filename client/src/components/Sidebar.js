// 📁 src/components/Sidebar.js
// 📚 Sidebar navigation component for Primary and High School resource categories

export function Sidebar() {
  // 🧱 Create sidebar container
  const aside = document.createElement("aside");
  aside.className = `
    fixed top-[64px] left-0 w-64 h-[calc(100vh-64px)]
    bg-blue-800 text-white z-40 transition-transform duration-300
    transform -translate-x-full md:translate-x-0 shadow-lg overflow-y-auto
  `;
  aside.id = "mainSidebar";

  // 🔍 Determine active link for styling
  const currentPath = window.location.pathname;
  const isActive = (path) => (currentPath === path ? "bg-blue-700" : "");

  // 🧩 Generate sidebar link HTML
  function linkHTML(path, icon, label) {
    return `
      <a href="${path}" data-link
        class="flex items-center gap-2 p-2 rounded hover:bg-blue-700 ${isActive(
          path
        )}">
        ${icon} <span class="hidden md:inline">${label}</span>
      </a>
    `;
  }

  // 📋 Sidebar content
  aside.innerHTML = `
    <div class="px-4 py-4">
      <button id="closeSidebar" class="text-white text-2xl mb-4 md:hidden">&times;</button>
      <nav class="space-y-2">
        <!-- Primary School Links -->
        <div>
          <h3 class="text-sm font-semibold uppercase mb-1 text-gray-300">Primary School</h3>
          ${linkHTML("/resources/primary/notes", "📘", "Notes")}
          ${linkHTML("/resources/primary/exams", "✅", "Exams")}
          ${linkHTML("/resources/primary/ebooks", "📚", "E-Books")}
          ${linkHTML("/resources/primary/schemes", "🗂️", "Schemes")}
          ${linkHTML("/resources/primary/lessons", "🧠", "Lesson Plans")}
        </div>

        <!-- High School Links -->
        <div class="mt-4">
          <h3 class="text-sm font-semibold uppercase mb-1 text-gray-300">High School</h3>
          ${linkHTML("/resources/highschool/notes", "📘", "Notes")}
          ${linkHTML("/resources/highschool/exams", "✅", "Exams")}
          ${linkHTML("/resources/highschool/ebooks", "📚", "E-Books")}
          ${linkHTML("/resources/highschool/schemes", "🗂️", "Schemes")}
          ${linkHTML("/resources/highschool/lessons", "🧠", "Lesson Plans")}
        </div>
      </nav>
    </div>
  `;

  // 🔗 SPA routing + Sidebar toggle handling
  setTimeout(() => {
    // 🚦 SPA navigation handler
    document.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        history.pushState({}, "", href);
        window.dispatchEvent(new Event("popstate"));

        // 📱 Auto-close on mobile after navigation
        if (window.innerWidth < 768) {
          aside.classList.add("-translate-x-full");
        }
      });
    });

    // ❌ Close button handler (mobile only)
    const closeBtn = document.getElementById("closeSidebar");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        aside.classList.add("-translate-x-full");
      });
    }

    // ☰ Hamburger menu toggle for sidebar
    const hamburger = document.getElementById("sidebarToggle");
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        aside.classList.toggle("-translate-x-full");
      });
    }
  }, 50);

  return aside;
}
