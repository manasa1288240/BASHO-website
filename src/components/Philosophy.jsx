import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Philosophy.css";

// Assets
import pot1 from "../assets/wabisabi.jpeg";
import pot2 from "../assets/ma.jpg";
import pot3 from "../assets/omentashi.jpeg";

gsap.registerPlugin(ScrollTrigger);

function Philosophy() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Skip GSAP animation on mobile - clear any inline styles
    if (window.innerWidth <= 768) {
      // Don't set up any GSAP animations for mobile
      return;
    }

    const ctx = gsap.context(() => {
      const textBlocks = gsap.utils.toArray(".reveal-text-item");
      const images = gsap.utils.toArray(".philosophy-image");

      // Initial state: Show the first text block and first image immediately
      gsap.set(textBlocks.slice(1), { opacity: 0, y: 30 });
      gsap.set(textBlocks[0], { opacity: 1, y: 0 });
      
      gsap.set(images, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(images[0], { clipPath: "inset(0% 0% 0% 0%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", // Adjusted for 4 remaining slides
          pin: true,
          scrub: 1,
        }
      });

      textBlocks.forEach((text, i) => {
        if (i === 0) return;

        // Text transitions
        tl.to(textBlocks[i - 1], { opacity: 0, y: -30, duration: 0.5 }, i)
          .to(text, { opacity: 1, y: 0, duration: 0.5 }, i);

        // Image transitions for slides that have images
        const hasImage = !!philosophyData[i].img;
        if (hasImage) {
          const imgIndex = philosophyData.filter((d, idx) => idx <= i && d.img).length - 1;
          if (images[imgIndex]) {
            tl.to(images[imgIndex], { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, i);
          }
        }
        
        // Hide the image stack only for the final quote
        if (philosophyData[i].type === "quote") {
          tl.to(".philosophy-right-stack", { opacity: 0, duration: 0.3 }, i);
        } else {
          tl.to(".philosophy-right-stack", { opacity: 1, duration: 0.3 }, i);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const philosophyData = [
    { 
      title: "Wabi-Sabi", 
      desc: "Finding beauty in imperfection, simplicity, and authenticity. It celebrates the natural cycle of growth, change, and decay—reminding us that nothing is permanent, nothing is complete, and nothing is perfect, yet everything has its own quiet beauty.", 
      img: pot1 
    },
    { 
      title: "Ma (間)", 
      desc: "The art of negative space and meaningful silence. Ma is about creating harmony through emptiness—allowing moments of pause, breathing room, and balance so that what is present feels more intentional and powerful.", 
      img: pot2 
    },
    { 
      title: "Omotenashi", 
      desc: "The spirit of wholehearted hospitality. It reflects thoughtful care, sincerity, and attention to the smallest details—anticipating needs and creating warm, seamless experiences without expecting anything in return.", 
      img: pot3 
    },
    {
      title: "\"Basho is more than a physical space—it's an atmosphere where every element is intentionally curated to spark joy, foster creativity, and provide comfort in our increasingly digital world.\"",
      desc: "— FOUNDERS OF BASHO",
      type: "quote"
    }
  ];

  return (
    <>
      <div className="philosophy-intro-header">
        <h1 className="header-title">Our Philosophy</h1>
        <div className="title-divider"></div>
        <p className="header-subtitle">Inspired by Japanese aesthetics and the art of mindful living</p>
      </div>

      <section className="philosophy-fixed-section" ref={containerRef}>
        <div className="philosophy-flex-container">
          <div className="philosophy-left-stack">
            {philosophyData.map((item, i) => (
              <div key={i} className={`reveal-text-item item-${i} ${item.type || ""}`}>
                <h2 className="reveal-title">{item.title}</h2>
                <div className="title-divider"></div>
                <p className="reveal-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="philosophy-right-stack">
            <div className="image-frame">
              {philosophyData.filter(d => d.img).map((item, i) => (
                <img key={i} src={item.img} className="philosophy-image" alt={item.title} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Philosophy;