// 📁 src/components/FileCard.js
// 📦 Renders a file card with actions like View, Download, and Admin options (Rename/Delete)

export function FileCard(file) {
  const card = document.createElement("div");

  // 📦 Container styling for each file card
  card.className =
    "flex flex-col md:flex-row md:items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition";

  // 📝 File info section (filename as a clickable link)
  const fileInfo = document.createElement("div");
  fileInfo.className = "mb-2 md:mb-0";
  fileInfo.innerHTML = `
    <a href="${file.file_url}" target="_blank" class="font-semibold text-blue-600 hover:underline truncate max-w-xs block">
      ${file.filename}
    </a>
  `;

  // 🔘 Action buttons container
  const actions = document.createElement("div");
  actions.className = "flex gap-2 flex-wrap justify-end";

  // 🔍 View button
  const viewBtn = document.createElement("a");
  viewBtn.href = file.file_url;
  viewBtn.target = "_blank";
  viewBtn.className =
    "px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm";
  viewBtn.textContent = "View";

  // 📥 Download button
  const downloadBtn = document.createElement("a");
  downloadBtn.href = file.file_url;
  downloadBtn.download = file.filename;
  downloadBtn.className =
    "px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm";
  downloadBtn.textContent = "Download";

  actions.append(viewBtn, downloadBtn);

  // 🔐 Show admin controls (Rename/Delete) only if admin token is available
  const isAdmin = !!localStorage.getItem("adminToken");

  if (isAdmin) {
    // ✏️ Rename Button
    const renameBtn = document.createElement("button");
    renameBtn.className =
      "px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm";
    renameBtn.textContent = "Rename";

    renameBtn.addEventListener("click", async () => {
      const newName = prompt("✏️ Enter new file name:", file.filename);
      if (!newName || newName === file.filename) return;

      const token = localStorage.getItem("adminToken");
      const isLocal =
        location.hostname === "localhost" || location.hostname === "127.0.0.1";
      const API_BASE_URL = isLocal
        ? "http://localhost:5555"
        : "https://elimu-online.onrender.com";

      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/rename`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: file.id, newName }),
        });

        if (res.ok) {
          alert("✅ File renamed successfully!");
          window.location.reload();
        } else {
          const err = await res.json();
          alert(`❌ Rename failed: ${err.error || "Unknown error"}`);
        }
      } catch (err) {
        alert("❌ Server error during rename.");
      }
    });

    // 🗑️ Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.className =
      "px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", async () => {
      const confirmDelete = confirm(
        `⚠️ Are you sure you want to delete "${file.filename}"?`
      );
      if (!confirmDelete) return;

      const token = localStorage.getItem("adminToken");
      const isLocal =
        location.hostname === "localhost" || location.hostname === "127.0.0.1";
      const API_BASE_URL = isLocal
        ? "http://localhost:5555"
        : "https://elimu-online.onrender.com";

      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/delete/${file.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          alert("✅ File deleted successfully!");
          window.location.reload();
        } else {
          const err = await res.json();
          alert(`❌ Delete failed: ${err.error || "Unknown error"}`);
        }
      } catch (err) {
        alert("❌ Server error during delete.");
      }
    });

    actions.append(renameBtn, deleteBtn);
  }

  // 🧩 Combine info and actions into the card
  card.append(fileInfo, actions);
  return card;
}
