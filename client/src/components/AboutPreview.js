// 📁 src/components/AboutPreview.js
// 🔍 Renders the "About Us" preview section for the homepage with title, description, and image.

export function AboutPreview() {
  const section = document.createElement("section");

  // Apply background and padding for light/dark mode
  section.className = "bg-white dark:bg-gray-900 py-12";

  // HTML structure: two-column grid (text + image)
  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
      
      <!-- ℹ️ Left Column: About Text -->
      <div>
        <h2 class="text-3xl font-bold text-secondary mb-4">About Us</h2>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Empowering Learners Everywhere
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          Elimu-Online provides curriculum-aligned digital content for students and educators. 
          We believe access to quality education is a right, not a privilege. Our goal is to bridge 
          the gap with free and premium learning resources tailored for Kenya's Primary and Secondary learners.
        </p>
        <a href="/about" class="inline-block bg-secondary text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Learn More
        </a>
      </div>

      <!-- 🖼️ Right Column: Image -->
      <div>
        <img 
          src="/images/about.jpg" 
          alt="About Elimu-Online" 
          class="rounded-lg shadow-md w-full h-auto object-cover" 
        />
      </div>
    </div>
  `;

  return section;
}
