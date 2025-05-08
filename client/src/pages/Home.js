import { HeroSlider } from "../components/HeroSlider.js";
import { MeetTeam } from "../components/MeetTeam.js";
import { Testimonials } from "../components/Testimonials.js";
import { AboutPreview } from "../components/AboutPreview.js";
import { WhyChooseUs } from "../components/WhyChooseUs.js";
import { SuccessMetrics } from "../components/SuccessMetrics.js";

// Renders the full homepage layout with all its key sections
export function Home() {
  const container = document.createElement("div");

  // ✅ Append each homepage section in logical visual order
  container.appendChild(HeroSlider()); // Fullscreen image carousel
  container.appendChild(WhyChooseUs()); // Feature highlights
  container.appendChild(SuccessMetrics()); // Impact statistics
  container.appendChild(AboutPreview()); // Short 'About Us' section
  container.appendChild(Testimonials()); // User feedback carousel
  container.appendChild(MeetTeam()); // Team introduction

  return container;
}
