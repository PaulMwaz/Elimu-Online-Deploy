// 📁 src/pages/GuestResourcePage.js

// Renders a guest-only access page prompting login or registration
export function GuestResourcePage() {
  const section = document.createElement("section");
  section.className =
    "container mx-auto py-20 px-6 flex flex-col items-center text-center";

  // ✅ Page content for unauthenticated users
  section.innerHTML = `
    <h2 class="text-4xl font-bold text-blue-800 mb-6">Resources Access</h2>
    <p class="text-gray-600 text-lg mb-8 max-w-2xl">
      You need to be logged in to view and download educational resources.
      Create an account or login to access Primary School and High School Notes, Exams, E-Books, Lesson Plans, and more!
    </p>

    <!-- 👇 CTA Buttons -->
    <div class="flex gap-6">
      <a href="/login" class="px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
        Login
      </a>
      <a href="/register" class="px-6 py-3 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition">
        Register
      </a>
    </div>
  `;

  return section;
}
