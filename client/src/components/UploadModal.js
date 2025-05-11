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
  console.log("🟦 UploadModal opened with:", {
    subject,
    formClass,
    term,
    category,
    level,
  });

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

  const modal = document.createElement("div");
  modal.className = "bg-white rounded-lg p-6 w-full max-w-md shadow-lg";

  const title = document.createElement("h2");
  title.className = "text-xl font-bold mb-4 text-center text-blue-700";
  title.textContent = `Upload New File for ${subject}`;

  const form = document.createElement("form");
  form.className = "flex flex-col space-y-4";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.required = true;
  fileInput.className = "border p-2 rounded";

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.placeholder = "Price (0 = Free)";
  priceInput.className = "border p-2 rounded";

  const uploadBtn = document.createElement("button");
  uploadBtn.type = "submit";
  uploadBtn.textContent = "Upload";
  uploadBtn.className =
    "bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel";
  cancelBtn.className =
    "bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500";

  form.appendChild(fileInput);
  form.appendChild(priceInput);
  form.appendChild(uploadBtn);
  form.appendChild(cancelBtn);
  modal.appendChild(title);
  modal.appendChild(form);
  overlay.appendChild(modal);

  cancelBtn.addEventListener("click", () => {
    console.log("❎ Upload cancelled by user");
    overlay.remove();
    if (typeof onClose === "function") onClose();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!fileInput.files.length) {
      alert("Please select a file to upload.");
      return;
    }

    const isLocal =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const API_BASE_URL = isLocal
      ? "http://localhost:5555"
      : "https://elimu-online.onrender.com";

    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("❌ No admin token found. Please log in again.");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("formClass", formClass);
    formData.append("term", term);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", priceInput.value || 0);
    formData.append("file", file);

    console.log("📤 Uploading file with metadata:", {
      subject,
      formClass,
      term,
      category,
      level,
      price: priceInput.value || 0,
      fileName: file.name,
    });

    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      console.log("📡 Server response:", result);

      if (res.ok) {
        alert("✅ File uploaded successfully!");
        overlay.remove();
        if (typeof onSuccess === "function") onSuccess();
      } else {
        alert(`❌ Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("🔥 Upload error:", err);
      alert("❌ Server error during upload.");
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.textContent = "Upload";
    }
  });

  return overlay;
}
