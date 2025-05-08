// 📁 src/components/Testimonials.js
// 📢 Renders a horizontally scrollable testimonial slider with user feedback

export function Testimonials() {
  // 📦 Create outer section container
  const section = document.createElement("section");
  section.className = "bg-gray-50 py-10";

  // 🖼️ Inject HTML structure and mapped testimonial cards
  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-8 text-gray-800">What Our Users Say</h2>

      <!-- Horizontally scrollable card container -->
      <div class="flex overflow-x-auto gap-4 px-2 sm:px-4 snap-x snap-mandatory justify-center">
        ${[
          {
            name: "Liam Otieno",
            img: "/images/test1.jpg",
            text: "As a young learner, I love how simple and colorful this platform is. Learning is now fun!",
          },
          {
            name: "Grace Mwikali",
            img: "/images/test2.jpg",
            text: "As a teacher, Elimu-Online makes it easy to share and access curriculum-aligned content.",
          },
          {
            name: "Brian Muthomi",
            img: "/images/test3.jpg",
            text: "Elimu-Online gave me the confidence to revise for exams with the best digital resources.",
          },
        ]
          .map(
            (user) => `
            <div class="flex-none w-80 bg-white p-6 rounded-lg shadow snap-center transition duration-300 text-center">
              <img src="${user.img}" alt="${user.name}" class="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-secondary" />
              <h4 class="font-semibold text-lg">${user.name}</h4>
              <p class="text-sm text-gray-600 mt-2">"${user.text}"</p>
            </div>
          `
          )
          .join("")}
      </div>
    </div>
  `;

  return section;
}
