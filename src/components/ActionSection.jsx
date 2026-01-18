import { useState } from "react";
import { Clock, Users, Home, Palette, Package, Gift } from "lucide-react";
import "./ActionSection.css";
import workshopImg from "../assets/workshop.jpg";
import Modal from "./Modal";

export default function ActionSection() {
  const [activeModal, setActiveModal] = useState(null);

  const hostChips = [
    { icon: Clock, label: "2–3 hrs" },
    { icon: Users, label: "5–20 people" },
    { icon: Home, label: "In-studio" }
  ];

  const collabChips = [
    { icon: Palette, label: "Custom branding" },
    { icon: Package, label: "Bulk orders" },
    { icon: Gift, label: "Corporate gifting" }
  ];

  return (
    <>
      <section className="action-section">
        <div className="section-header">
          <h2 className="section-heading">Let's Create Together</h2>
          <p className="section-desc">Workshops, private events & brand collaborations.</p>
        </div>

        <div className="cards-container">
          {/* Host an Event Card */}
          <div className="premium-card">
            <div className="card-badge">Most Booked</div>
            <div className="card-image-wrapper">
              <img src={workshopImg} alt="Host an Event" className="card-image" />
            </div>
            
            <div className="card-body">
              <h3 className="card-title">Host an Event</h3>
              <p className="card-subtitle">Perfect for birthdays, team outings & private sessions</p>
              
              <div className="chips-container">
                {hostChips.map((chip, idx) => {
                  const IconComponent = chip.icon;
                  return (
                    <div key={idx} className="chip">
                      <IconComponent size={16} />
                      <span>{chip.label}</span>
                    </div>
                  );
                })}
              </div>

              <button 
                className="card-button primary"
                onClick={() => setActiveModal("event")}
              >
                Book for an Event
              </button>
            </div>
          </div>

          {/* Collaborate With Us Card */}
          <div className="premium-card">
            <div className="card-badge secondary-badge">For Brands</div>
            <div className="card-image-wrapper">
              <img src={workshopImg} alt="Collaborate" className="card-image" />
            </div>
            
            <div className="card-body">
              <h3 className="card-title">Collaborate With Us</h3>
              <p className="card-subtitle">Bulk orders, gifting & custom branded ceramics</p>
              
              <div className="chips-container">
                {collabChips.map((chip, idx) => {
                  const IconComponent = chip.icon;
                  return (
                    <div key={idx} className="chip">
                      <IconComponent size={16} />
                      <span>{chip.label}</span>
                    </div>
                  );
                })}
              </div>

              <button 
                className="card-button secondary"
                onClick={() => setActiveModal("collab")}
              >
                Collaborate
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeModal && (
        <Modal type={activeModal} close={() => setActiveModal(null)} />
      )}
    </>
  );
}