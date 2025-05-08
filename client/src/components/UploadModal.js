// 📁 src/components/UploadModal.js
// 📤 Upload modal component for admin to submit new resource files

export function UploadModal(
  subject,
  formClass,
  term,
  category,
  level,
  onClose,
  onSuccess
) {
  // 🔲 Create overlay background
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

  // 📦 Modal container
  const modal = document.createElement("div");
  modal.className = "bg-white rounded-lg p-6 w-full max-w-md shadow-lg";

  // 🏷️ Title
  const title = document.createElement("h2");
  title.className = "text-xl font-bold mb-4 text-center text-blue-700";
  title.textContent = `Upload New File for ${subject}`;

  // 📝 Upload form
  const form = document.createElement("form");
  form.className = "flex flex-col space-y-4";

  // 📂 File input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.required = true;
  fileInput.className = "border p-2 rounded";

  // 💰 Optional price input
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.placeholder = "Price (0 = Free)";
  priceInput.className = "border p-2 rounded";

  // 🚀 Upload button
  const uploadBtn = document.createElement("button");
  uploadBtn.type = "submit";
  uploadBtn.textContent = "Upload";
  uploadBtn.className =
    "bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700";

  // ❌ Cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel";
  cancelBtn.className =
    "bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500";

  // 🔗 Assemble form structure
  form.appendChild(fileInput);
  form.appendChild(priceInput);
  form.appendChild(uploadBtn);
  form.appendChild(cancelBtn);
  modal.appendChild(title);
  modal.appendChild(form);
  overlay.appendChild(modal);

  // 🔄 Cancel modal handler
  cancelBtn.addEventListener("click", () => {
    overlay.remove();
    if (typeof onClose === "function") onClose();
  });

  // 📤 Submit file to backend
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🧪 Check file selected
    if (!fileInput.files.length) {
      alert("Please select a file to upload.");
      return;
    }

    // 🌍 API setup
    const isLocal =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const API_BASE_URL = isLocal
      ? "http://localhost:5555"
      : "https://elimu-online.onrender.com";
    const token = localStorage.getItem("adminToken");

    // 🧾 Prepare FormData for file upload
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("formClass", formClass);
    formData.append("term", term);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", priceInput.value || 0);
    formData.append("file", fileInput.files[0]);

    // ⏳ Disable button during upload
    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";

    try {
      // 🛰️ Submit upload request
      const res = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      // ✅ Handle success
      if (res.ok) {
        alert("✅ File uploaded successfully!");
        overlay.remove();
        if (typeof onSuccess === "function") onSuccess();
      } else {
        alert(`❌ Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      // ❌ Handle unexpected errors
      alert("❌ Server error during upload.");
    } finally {
      // 🔁 Reset upload button
      uploadBtn.disabled = false;
      uploadBtn.textContent = "Upload";
    }
  });

  return overlay;
}
