// 📁 src/components/Footer.js
// 📦 Renders a dynamic footer based on user authentication status (guest or logged in)

export function Footer() {
  const footer = document.createElement("footer");

  const isLoggedIn = localStorage.getItem("user") !== null;

  if (isLoggedIn) {
    // 🔐 Minimal footer for authenticated users (centered text)
    footer.className =
      "bg-gray-900 text-white text-center text-sm py-6 md:pl-[16rem]";
    footer.innerHTML = `© 2025 Elimu-Online. All rights reserved.`;
  } else {
    // 🌐 Full informational footer for guest users
    footer.className = "bg-gray-900 text-white w-full px-6 pt-10 pb-5";

    footer.innerHTML = `
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12 text-sm text-center md:text-left">
        
        <!-- 📌 Brand Overview Section -->
        <div>
          <h4 class="font-bold text-lg mb-2">Elimu-Online</h4>
          <p class="leading-relaxed mb-3">
            Empowering students and teachers with quality, curriculum-aligned resources.
          </p>
          <div class="flex justify-center md:justify-start gap-4">
            <a href="https://facebook.com" target="_blank" class="hover:text-blue-400">Facebook</a>
            <a href="https://twitter.com" target="_blank" class="hover:text-blue-300">Twitter</a>
            <a href="https://linkedin.com" target="_blank" class="hover:text-blue-500">LinkedIn</a>
          </div>
        </div>

        <!-- 🧭 Navigation Links -->
        <div>
          <h4 class="font-semibold text-lg mb-2">Quick Links</h4>
          <ul class="space-y-2">
            <li><a href="/" data-link class="hover:underline">Home</a></li>
            <li><a href="/about" data-link class="hover:underline">About</a></li>
            <li><a href="/resources" data-link class="hover:underline">Resources</a></li>
          </ul>
        </div>

        <!-- 📞 Contact Information -->
        <div>
          <h4 class="font-semibold text-lg mb-2">Contact</h4>
          <p>Email: <a href="mailto:info@elimu-online.org" class="hover:underline">info@elimu-online.org</a></p>
          <p>Phone: +254 700 000 000</p>
        </div>
      </div>

      <!-- ⚖️ Copyright Bar -->
      <div class="text-center text-xs mt-6 pt-4 border-t border-gray-700">
        © 2025 Elimu-Online. All rights reserved.
      </div>
    `;
  }

  // 🔁 SPA Routing for footer navigation links
  setTimeout(() => {
    footer.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        history.pushState({}, "", href);
        window.dispatchEvent(new Event("popstate"));
      });
    });
  }, 50);

  return footer;
}
