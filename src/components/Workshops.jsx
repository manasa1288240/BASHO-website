import { Link } from "react-router-dom";
import workshopImg from "../assets/workshop.jpg";

export default function Workshops() {
  const workshops = [
    {
      img: workshopImg,
      title: "Wheel Throwing",
      duration: "3 Hours",
      description: "Master the fundamentals of throwing on the potter's wheel",
    },
    {
      img: workshopImg,
      title: "Hand-Building Techniques",
      duration: "4 Hours",
      description:
        "Explore coil, slab, and pinch techniques to create unique forms",
    },
    {
      img: workshopImg,
      title: "Glazing Masterclass",
      duration: "2 Hours",
      description: "Learn the art of mixing and applying beautiful glazes",
    },
  ];

  return (
    <section className="collection-section">
      <h2 className="section-title">Workshops</h2>
      <p className="section-subtitle">
        Learn the meditative art of pottery in our hands-on classes
      </p>

      <div className="collection-scroll">
        {workshops.map((workshop, index) => (
          <div key={index} className="collection-card">
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
