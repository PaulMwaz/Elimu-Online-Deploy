import { UploadForm } from "../components/UploadForm.js";
import { FileCard } from "../components/FileCard.js";

// Renders the resource listing page based on level and category
export function ResourceCategoryPage(level = "", category = "") {
  const section = document.createElement("section");
  section.className = "max-w-6xl mx-auto px-4 py-10";

  const params = new URLSearchParams(window.location.search);
  if (!level || !category) {
    level = params.get("level") || "primary";
    category = params.get("category") || "notes";
  }

  if (!level || !category) {
    section.innerHTML = `
      <h2 class="text-3xl font-bold text-center text-blue-800 mb-10">Resources</h2>
      <div class="text-center text-red-500 text-lg mt-6">
        ❌ Invalid resource category. Please use the sidebar to navigate.
      </div>`;
    return section;
  }

  const title = `${capitalize(level)} ${capitalize(category)}`;
  const heading = document.createElement("h2");
  heading.className = "text-3xl font-bold text-center text-blue-800 mb-10";
  heading.textContent = title;
  section.appendChild(heading);

  const isAdmin = !!localStorage.getItem("adminToken");

  if (level === "highschool") {
    renderGenericTermSections(section, category, isAdmin, [
      "Form 2",
      "Form 3",
      "Form 4",
    ]);
  } else if (level === "primary") {
    renderGenericTermSections(section, category, isAdmin, [
      "PP1",
      "PP2",
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6",
      "Grade 7",
      "Grade 8",
      "Grade 9",
    ]);
  }

  return section;
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderGenericTermSections(section, category, isAdmin, levels) {
  const hasTerms = !["notes", "ebooks"].includes(category);
  const terms = ["Term 1", "Term 2", "Term 3"];

  levels.forEach((grade) => {
    if (hasTerms) {
      terms.forEach((term) => {
        renderTermBlock(section, grade, term, category, isAdmin);
      });
    } else {
      renderTermBlock(section, grade, "", category, isAdmin);
    }
  });
}

function renderTermBlock(section, grade, term = "", category, isAdmin) {
  const level = grade.includes("Form") ? "highschool" : "primary";
  const sectionWrapper = document.createElement("div");
  sectionWrapper.className = "mb-10";

  const termTitle = document.createElement("h3");
  termTitle.className = "text-2xl font-bold mb-4 text-blue-700";
  termTitle.textContent = `${grade} ${capitalize(category)}${
    term ? ` - ${term}` : ""
  }`;
  sectionWrapper.appendChild(termTitle);

  const filesContainer = document.createElement("div");
  filesContainer.className =
    "flex flex-col space-y-4 bg-white rounded-lg shadow-md p-4";

  if (isAdmin) {
    const uploadFormWrapper = document.createElement("div");
    uploadFormWrapper.className = "mb-4";

    const uploadButton = document.createElement("button");
    uploadButton.className =
      "bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700";
    uploadButton.textContent = "Upload New File";

    uploadButton.addEventListener("click", () => {
      const uploadForm = UploadForm(
        "General",
        grade,
        term,
        category,
        level,
        () =>
          refreshFiles("General", grade, term, level, category, fileListWrapper)
      );
      uploadFormWrapper.innerHTML = "";
      uploadFormWrapper.appendChild(uploadForm);
    });

    filesContainer.appendChild(uploadButton);
    filesContainer.appendChild(uploadFormWrapper);
  }

  const fileListWrapper = document.createElement("div");
  fileListWrapper.className = "flex flex-col gap-2";
  filesContainer.appendChild(fileListWrapper);

  sectionWrapper.appendChild(filesContainer);
  section.appendChild(sectionWrapper);

  refreshFiles("General", grade, term, level, category, fileListWrapper);
}

// Fetches resource files and populates them using FileCard components
async function refreshFiles(subject, form, term, level, category, container) {
  container.innerHTML = "Loading files...";

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const queryURL = `${API_BASE_URL}/api/resources?subject=${subject}&formClass=${form}&level=${level}&term=${term}&category=${category}`;

  console.log("📡 Fetching files from:", queryURL);

  try {
    const res = await fetch(queryURL);
    const contentType = res.headers.get("Content-Type");

    console.log("📥 Response content-type:", contentType);

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      const files = data.resources || [];

      container.innerHTML = "";

      if (files.length > 0) {
        files.forEach((file) => {
          const fileCard = FileCard(file);
          container.appendChild(fileCard);
        });
      } else {
        container.innerHTML = `<div class="text-gray-400">No files uploaded yet.</div>`;
      }
    } else {
      const rawText = await res.text();
      console.error("❌ Non-JSON response received:", rawText);
      container.innerHTML = `<div class="text-red-500">❌ Invalid response from server. Check backend logs.</div>`;
    }
  } catch (err) {
    console.error("🔥 Failed to fetch files:", err);
    container.innerHTML = `<div class="text-red-500">❌ Error loading files.</div>`;
  }
}
