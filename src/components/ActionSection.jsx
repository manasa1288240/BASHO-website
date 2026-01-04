import { useState } from "react";
import "./ActionSection.css";
import workshopImg from "../assets/workshop.jpg";
import Modal from "./Modal";

export default function ActionSection() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <section className="action-section">
        <div className="action-card">
          <img src={workshopImg} alt="Workshop Event" />
          <h3>Host an Event</h3>
          <button onClick={() => setActiveModal("event")}>
            Book for an Event
          </button>
        </div>

        <div className="action-card">
          <img src={workshopImg} alt="Collaborate" />
          <h3>Collaborate With Us</h3>
          <button onClick={() => setActiveModal("collab")}>
            Collaborate
          </button>
        </div>
      </section>

      {activeModal && (
        <Modal type={activeModal} close={() => setActiveModal(null)} />
      )}
    </>
  );
}
