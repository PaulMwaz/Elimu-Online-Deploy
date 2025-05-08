// 📁 src/components/HeroSlider.js
// 📸 Full-width responsive image slider for the homepage hero section

export function HeroSlider() {
  const section = document.createElement("section");
  section.className =
    "relative w-full h-[300px] md:h-[500px] lg:h-[650px] overflow-hidden";

  section.innerHTML = `
    <!-- 📝 Overlay Text Layer -->
    <div class="absolute inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center text-center px-4">
      <h1 class="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
        Welcome to Elimu-Online<br/>
        Empowering Learners with Digital Resources
      </h1>
    </div>

    <!-- 🖼️ Background Slide Images -->
    <div class="relative h-full w-full">
      <img src="/images/slide1.jpg" class="hero-slide opacity-100" />
      <img src="/images/slide2.jpg" class="hero-slide opacity-0" />
      <img src="/images/slide3.jpg" class="hero-slide opacity-0" />
    </div>
  `;

  // 🎨 Inject base styling for slide images
  const style = document.createElement("style");
  style.textContent = `
    .hero-slide {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: opacity 1s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // ⏱️ Start image autoplay after initial render
  setTimeout(() => {
    const slides = section.querySelectorAll(".hero-slide");
    let index = 0;

    setInterval(() => {
      // Reset visibility on all slides
      slides.forEach((slide, i) => {
        slide.classList.remove("opacity-100");
        slide.classList.add("opacity-0");
        if (i === index) {
          slide.classList.add("opacity-100");
        }
      });
      index = (index + 1) % slides.length;
    }, 5000); // 🔁 Change slide every 5 seconds
  }, 100);

  return section;
}
