// 📁 src/components/UploadForm.js
// 📤 Renders a form that allows admin users to upload resource files with optional pricing

export function UploadForm(subject, form, term, category, level, onSuccess) {
  // 🔧 Create the outer wrapper
  const formWrapper = document.createElement("div");
  formWrapper.className =
    "bg-gray-100 p-4 rounded mt-4 shadow w-full max-w-md mx-auto";

  // 🏷️ Form Heading
  const heading = document.createElement("h5");
  heading.className = "text-md font-semibold mb-2 text-blue-700";
  heading.textContent = `Upload New File for ${subject}`;
  formWrapper.appendChild(heading);

  // 📝 Main form
  const uploadForm = document.createElement("form");
  uploadForm.className = "flex flex-col space-y-4 text-sm sm:text-base";

  // 📂 File input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.required = true;
  fileInput.className = "border rounded p-2 bg-white w-full";

  // 💵 Price input
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.placeholder = "Price (0 = Free)";
  priceInput.className = "border rounded p-2 bg-white w-full";

  // 🚀 Submit button
  const uploadBtn = document.createElement("button");
  uploadBtn.type = "submit";
  uploadBtn.textContent = "Upload File";
  uploadBtn.className =
    "bg-green-600 text-white rounded p-2 hover:bg-green-700 w-full";

  // 🧩 Append to form
  uploadForm.appendChild(fileInput);
  uploadForm.appendChild(priceInput);
  uploadForm.appendChild(uploadBtn);
  formWrapper.appendChild(uploadForm);

  // 🧠 Upload logic
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!fileInput.files.length) {
      alert("❌ Please select a file to upload.");
      return;
    }

    const isLocal =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const API_BASE_URL = isLocal
      ? "http://localhost:5555"
      : "https://elimu-online-backend.onrender.com";

    const token = localStorage.getItem("adminToken");
    const file = fileInput.files[0];
    const price = priceInput.value || 0;

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("formClass", form);
    formData.append("category", category.toLowerCase());
    formData.append("level", level.toLowerCase());
    formData.append("price", price);
    formData.append("file", file);

    const normalizedCategory = category.toLowerCase();
    if (term && !["notes", "ebooks", "e-books"].includes(normalizedCategory)) {
      formData.append("term", term);
    }

    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";

    try {
      console.log("📤 Uploading file with data:", {
        subject,
        form,
        term,
        category,
        level,
        price,
        fileName: file.name,
      });

      const res = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        console.log("✅ Upload success response:", result);
        alert("✅ File uploaded successfully!");
        if (typeof onSuccess === "function") onSuccess();
        fileInput.value = "";
        priceInput.value = "";
      } else {
        console.error("❌ Upload error:", result);
        alert(`❌ Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("🔥 Upload failed due to network/server error:", err);
      alert("❌ Server error while uploading.");
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.textContent = "Upload File";
    }
  });

  return formWrapper;
}
