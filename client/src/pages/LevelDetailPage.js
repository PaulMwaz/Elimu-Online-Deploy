// Renders the category selection page for Primary or High School
export function LevelDetailPage(level) {
  const section = document.createElement("section");
  section.className = "container py-12 text-center";

  // Determine the education level title
  const levelTitle = level === "primary" ? "Primary School" : "High School";

  // Create section HTML with clickable resource categories
  section.innerHTML = `
    <h1 class="text-3xl font-bold text-secondary mb-6">${levelTitle} Categories</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      ${["Notes", "Exams", "E-Books", "Tutorials", "Schemes", "Lessons"]
        .map(
          (category) => `
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer category-card"
          data-category="${category.toLowerCase()}"
        >
          <div class="text-xl font-semibold text-secondary mb-2">${category}</div>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Browse ${category.toLowerCase()} for ${levelTitle}.
          </p>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  // 🔁 Add event listeners to handle navigation when a card is clicked
  setTimeout(() => {
    section.querySelectorAll(".category-card").forEach((card) => {
      card.addEventListener("click", () => {
        const category = card.getAttribute("data-category");
        history.pushState({}, "", `/resources/${level}/${category}`);
        window.dispatchEvent(new Event("popstate"));
      });
    });
  }, 50);

  return section;
}
