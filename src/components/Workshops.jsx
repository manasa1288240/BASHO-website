import { Link } from "react-router-dom";
import workshopImg from "../assets/workshop.jpg";

export default function Workshops() {
  const workshops = [
    {
      img: workshopImg,
      title: "Wheel Throwing",
      duration: "3 hours",
      description: "Master the fundamentals of throwing on the potter's wheel",
    },
    {
      img: workshopImg,
      title: "Hand-Building Techniques",
      duration: "4 hours",
      description: "Explore coil, slab, and pinch techniques to create unique forms",
    },
    {
      img: workshopImg,
      title: "Glazing Masterclass",
      duration: "2 hours",
      description: "Learn the art of mixing and applying beautiful glazes",
    },
  ];

  return (
    <section id="workshops" className="workshops-section">
      <h2 className="section-title">Workshops</h2>
      <p className="section-subtitle">
        Learn the meditative art of pottery in our hands-on classes
      </p>

      <div className="workshops-grid">
        {workshops.map((workshop, index) => (
          <div key={index} className="workshop-card">
            <div className="workshop-image-wrapper">
              <img
                src={workshop.img}
                alt={workshop.title}
                className="workshop-image"
              />
            </div>
            <div className="workshop-info">
              <h3>{workshop.title}</h3>
              <p className="workshop-duration">{workshop.duration}</p>
              <p className="workshop-description">{workshop.description}</p>
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