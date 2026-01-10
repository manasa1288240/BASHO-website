import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './GalleryPreview.css';

import img1 from "../assets/gallery/img1.png";
import img2 from "../assets/gallery/img2.png";
import img3 from "../assets/gallery/img3.png";
import img4 from "../assets/gallery/img4.png";
import img5 from "../assets/gallery/img5.png";
import img6 from "../assets/gallery/img6.png";
import img7 from "../assets/gallery/img7.png";
import img8 from "../assets/gallery/img8.png";
import img9 from "../assets/gallery/img9.png";
import img10 from "../assets/gallery/img10.png";
import img11 from "../assets/gallery/img11.png";
import img12 from "../assets/gallery/img12.png";
import img13 from "../assets/gallery/img13.png";
import img14 from "../assets/gallery/img14.png";
import img15 from "../assets/gallery/img15.png";
import img16 from "../assets/gallery/img16.png";
import img17 from "../assets/gallery/img17.png";
import img18 from "../assets/gallery/img18.png";


const GalleryPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="gallery-preview">
      <div className="section-header">
        <h2>The BASHO Collection</h2>
        <button onClick={() => navigate('/gallery')}>Explore Full Gallery</button>
      </div>
      
      <div className="preview-grid" onClick={() => navigate('/gallery')}>
        <div className="grid-item tall">
          <img src={img1} alt="Artisan Pottery" />
        </div>
        <div className="grid-item">
          <img src={img2} alt="Functional Art" />
        </div>
        <div className="grid-item">
          <img src={img3} alt="Creative Ceramics" />
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
