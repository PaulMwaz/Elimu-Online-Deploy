// 📁 src/components/RenameModal.js
// 📝 Modal for renaming a file in the admin interface

export function RenameModal(file, API_BASE_URL, token, onRenameSuccess) {
  // 📦 Create the modal wrapper
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  // 🧱 Insert modal structure
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md animate-fade-in">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">Rename File</h2>
      <input id="newFileName" 
             class="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring focus:border-blue-400" 
             type="text" 
             placeholder="New filename (e.g., notes.pdf)" 
             value="${file.filename}" />

      <div class="flex justify-end gap-4">
        <button id="cancelRename" 
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition">
          Cancel
        </button>
        <button id="confirmRename" 
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
          Rename
        </button>
      </div>
    </div>
  `;

  // ⏳ Wait for DOM rendering
  setTimeout(() => {
    const cancelBtn = document.getElementById("cancelRename");
    const confirmBtn = document.getElementById("confirmRename");
    const input = document.getElementById("newFileName");

    // 🚫 Cancel rename action
    cancelBtn.onclick = () => {
      modal.remove();
    };

    // ✅ Confirm and submit rename request
    confirmBtn.onclick = async () => {
      const newName = input.value.trim();

      // 🔎 Validate input format
      if (!newName || newName.length < 3 || !newName.includes(".")) {
        alert("❌ Please enter a valid new file name (e.g., exam_term2.pdf)");
        input.focus();
        return;
      }

      // 🔄 Update UI to reflect processing state
      confirmBtn.disabled = true;
      confirmBtn.textContent = "Renaming...";

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/rename`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: file.id, newName }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("✅ File renamed successfully!");
          if (typeof onRenameSuccess === "function") onRenameSuccess();
          modal.remove();
        } else {
          alert(`❌ Rename failed: ${result.error || "Unknown server error."}`);
        }
      } catch (err) {
        alert("❌ Rename failed: Unexpected network/server error.");
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Rename";
      }
    };
  }, 50);

  return modal;
}
