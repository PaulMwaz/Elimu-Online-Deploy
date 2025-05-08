// 📁 src/components/MeetTeam.js
// 👥 Displays a grid of team members with images, names, and roles

export function MeetTeam() {
  const section = document.createElement("section");
  section.className = "py-12 bg-white dark:bg-gray-900";

  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 text-center">
      <!-- 📌 Section Heading -->
      <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">Meet the Team</h2>

      <!-- 👤 Team Members Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        ${[
          {
            img: "team1.jpg",
            name: "Kevin Ochieng",
            role: "Lead Frontend Developer",
          },
          {
            img: "team2.jpg",
            name: "Anita Njeri",
            role: "Head of Design",
          },
          {
            img: "team3.jpg",
            name: "Collins Mutua",
            role: "Backend & DevOps Engineer",
          },
        ]
          .map(
            (member) => `
              <!-- 🧑‍💻 Individual Team Member Card -->
              <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow text-center transition duration-300">
                <img src="/images/${member.img}" alt="${member.name}" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-secondary" />
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white">${member.name}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">${member.role}</p>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  return section;
}
