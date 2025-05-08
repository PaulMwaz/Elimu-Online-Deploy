// 📌 Layout wrapper for dashboard pages (includes sidebar push)
export function DashboardLayout(contentFn, titleText = "") {
  // 📦 Layout container: vertical on small screens, horizontal on md+
  const layout = document.createElement("div");
  layout.className = "flex flex-col md:flex-row min-h-screen";

  // 🧱 Main content wrapper with left padding when sidebar is present
  const main = document.createElement("main");
  main.className = "flex-grow p-4 md:ml-64";

  // 📌 If a title is provided, render it at the top of the page
  if (titleText) {
    const title = document.createElement("h1");
    title.className = "text-2xl font-bold text-secondary mb-4";
    title.textContent = titleText;
    main.appendChild(title);
  }

  // 🧩 Append page content if valid
  const content = contentFn();
  if (content instanceof HTMLElement) {
    main.appendChild(content);
  } else {
    // ❗ Developer warning if content is invalid (optional to keep for dev use)
    console.error("❌ contentFn() did not return an HTMLElement.");
  }

  // ✅ Assemble the layout
  layout.appendChild(main);
  return layout;
}
