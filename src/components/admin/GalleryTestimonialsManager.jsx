import GalleryManager from "./GalleryManager";
import TestimonialManager from "./TestimonialManager";
import VideoTestimonialManager from "./VideoTestimonialManager";

export default function GalleryTestimonialsManager() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <GalleryManager />
      <TestimonialManager />
      <VideoTestimonialManager />
    </div>
  );
}
