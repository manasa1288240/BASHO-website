import { Link } from "react-router-dom";
import { useCardStackScroll } from "../hooks/useCardStackScroll";
import workshopImg from "../assets/workshop.jpg";
import potter1 from "../assets/potter1.jpeg";
import potter2 from "../assets/potter2.jpeg";
import potter3 from "../assets/potter3.jpeg";

export default function Workshops() {
  const containerRef = useCardStackScroll();

  const workshops = [
    {
      img: potter1,
      title: "Pottery Date",
      duration: "",
      description: "A cozy pottery date for two. Create something special together, laugh, get messy, and take home a handmade memory.",
    },
    {
      img: potter3,
      title: "One-on-One Pottery Session",
      duration: "",
      description:
        "A personalized pottery session just for you. Learn at your own pace with full guidance and create a piece that feels truly yours.",
    },
    {
      img: potter2,
      title: "Group Pottery Event",
      duration: "",
      description: "Perfect for friends, teams, and celebrations. A fun group pottery experience filled with creativity, bonding, and lots of clay magic.",
    },
  ];

  return (
    <section className="collection-section">
      <h2 className="section-title">Workshops</h2>
      <p className="section-subtitle">
        Learn the meditative art of pottery in our hands-on classes
      </p>

      <div className="collection-scroll card-stack-container" ref={containerRef}>
        {workshops.map((workshop, index) => (
          <div key={index} className="collection-card card-stack-item">
            <img src={workshop.img} alt={workshop.title} />

            <div className="collection-info">
              <h3>{workshop.title}</h3>
              <span className="collection-price">{workshop.duration}</span>
              <p>{workshop.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-button-wrapper">
        <Link to="/workshops" className="more-button">
          View All Workshops
        </Link>
      </div>
    </section>
  );
}
