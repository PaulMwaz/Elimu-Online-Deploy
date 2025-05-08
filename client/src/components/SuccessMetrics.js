// 📁 src/components/SuccessMetrics.js
// 📊 Displays animated metrics to highlight platform impact (students, teachers, resources)

export function SuccessMetrics() {
  // 🧱 Create section container
  const section = document.createElement("section");
  section.className = "relative bg-light py-20 text-center bg-cover bg-center";
  section.style.backgroundImage = "url('/images/impact-bg.jpg')";

  // 🖼️ Insert static content with placeholders for animated metrics
  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-900 mb-12">Our Impact</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <!-- Metric 1: Students Served -->
        <div class="flex flex-col items-center">
          <div class="relative w-24 h-24">
            <svg class="w-full h-full transform rotate-[-90deg]">
              <circle cx="48" cy="48" r="40" stroke="#e5e7eb" stroke-width="10" fill="none" />
              <circle class="progress-ring" cx="48" cy="48" r="40" stroke="#2563eb" stroke-width="10" fill="none" stroke-dasharray="251.2" stroke-dashoffset="251.2" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-blue-600 text-xl font-bold count" data-target="10000">0</div>
          </div>
          <div class="text-3xl mt-2">👨‍🎓</div>
          <p class="text-gray-700 font-medium mt-2">Students Served</p>
        </div>

        <!-- Metric 2: Teachers Supported -->
        <div class="flex flex-col items-center">
          <div class="relative w-24 h-24">
            <svg class="w-full h-full transform rotate-[-90deg]">
              <circle cx="48" cy="48" r="40" stroke="#e5e7eb" stroke-width="10" fill="none" />
              <circle class="progress-ring" cx="48" cy="48" r="40" stroke="#2563eb" stroke-width="10" fill="none" stroke-dasharray="251.2" stroke-dashoffset="251.2" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-blue-600 text-xl font-bold count" data-target="500">0</div>
          </div>
          <div class="text-3xl mt-2">🧑‍🏫</div>
          <p class="text-gray-700 font-medium mt-2">Teachers Supported</p>
        </div>

        <!-- Metric 3: Resources Available -->
        <div class="flex flex-col items-center">
          <div class="relative w-24 h-24">
            <svg class="w-full h-full transform rotate-[-90deg]">
              <circle cx="48" cy="48" r="40" stroke="#e5e7eb" stroke-width="10" fill="none" />
              <circle class="progress-ring" cx="48" cy="48" r="40" stroke="#2563eb" stroke-width="10" fill="none" stroke-dasharray="251.2" stroke-dashoffset="251.2" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-blue-600 text-xl font-bold count" data-target="2000">0</div>
          </div>
          <div class="text-3xl mt-2">📚</div>
          <p class="text-gray-700 font-medium mt-2">Resources Available</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12">
        <h3 class="text-lg font-semibold text-gray-800">Join our growing community today!</h3>
        <a href="/register" class="mt-3 inline-block bg-secondary text-white px-6 py-2 rounded hover:bg-blue-700 transition">Get Started</a>
      </div>
    </div>
  `;

  // 📈 Animate counters and ring progress bars
  setTimeout(() => {
    const counters = section.querySelectorAll(".count");
    const rings = section.querySelectorAll(".progress-ring");

    counters.forEach((counter, i) => {
      const target = +counter.getAttribute("data-target"); // Target value from HTML
      const ring = rings[i];
      let count = 0;
      const step = Math.ceil(target / 80); // Speed of increment
      const dashArray = 251.2; // Circumference of SVG circle

      // ⏱️ Function to increment counter and animate ring
      const update = () => {
        count += step;
        if (count >= target) count = target;
        counter.innerText = count.toLocaleString();

        // Update SVG stroke to match percentage
        const offset = dashArray - (count / target) * dashArray;
        ring.setAttribute("stroke-dashoffset", offset);

        if (count < target) setTimeout(update, 30);
      };

      update(); // Start animation
    });
  }, 300);

  return section;
}
