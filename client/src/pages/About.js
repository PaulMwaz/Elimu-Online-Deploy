// 📌 Renders the About Us page section with platform description
export function About() {
  // 🧱 Create the main section wrapper
  const section = document.createElement("section");
  section.className = "container py-12 mt-28 text-center"; // Adds vertical spacing at the top

  // 📝 Define inner HTML content including title and description
  section.innerHTML = `
    <h1 class="text-3xl font-bold mb-4 text-secondary">About Elimu-Online</h1>
    <p class="text-lg max-w-xl mx-auto text-gray-700 dark:text-gray-300">
      Elimu-Online is a digital learning platform designed to empower students and teachers
      by offering accessible, curriculum-aligned resources. We believe in the power of technology
      to make education inclusive, engaging, and effective.
    </p>
  `;

  // ✅ Return the fully composed section
  return section;
}
