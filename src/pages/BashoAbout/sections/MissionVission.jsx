
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Flower2, Sprout, Footprints } from 'lucide-react';

const MissionVision = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: "easeOut" } }
  };

  return (
    <section className="basho-about-section basho-about-mission basho-mission-plates">
      <motion.div
        className="basho-about-inner"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="basho-mission-header">
          <h2 className="basho-mission-title">
            Our Guiding Stars
          </h2>
          <div className="section-divider"></div>
        </motion.div>

        {/* Mission + Vision Plates */}
        <div className="basho-mission-plate-grid">
          {[
            {
              title: "MISSION",
              icon: <Target className="w-7 h-7" />,
              text:
                "To thoughtfully craft ceramic pieces that serve as enduring companions in everyday life — quiet yet powerful reminders of Wabi-Sabi. Each creation honors the beauty of imperfection, the honesty of natural materials, and the marks left by time, touch, and process. Through intentional form, texture, and restraint, our work invites slower living, mindful rituals, and a deeper appreciation for the imperfect moments that shape contemporary life."
            },
            {
              title: "VISION",
              icon: <Lightbulb className="w-7 h-7" />,
              text:
                "To establish Bashō as a meaningful bridge between centuries-old Japanese craftsmanship and modern global living. We envision a world where thoughtfully made objects transcend function — becoming heirlooms that foster presence, spark conversation, and reconnect people to the richness of the present moment. By preserving tradition while embracing modern sensibilities, we aspire to create pieces that are lived with, remembered, and passed on through generations."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="basho-mission-plate"
            >
              <div className="basho-mission-plate-inner">
                <div className="basho-mission-plate-header">
                  {item.icon}
                  <h3>{item.title}</h3>
                </div>

                <p className="basho-mission-plate-text">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Values */}
        <motion.h3
          variants={itemVariants}
          className="basho-core-values-heading"
        >
          Core Values
        </motion.h3>

        <div className="basho-core-values-grid">
          {[
            { title: "Authenticity", icon: <Flower2 />, sub: "Every crack tells a story" },
            { title: "Sustainability", icon: <Sprout />, sub: "Time is the best craftsman" },
            { title: "Mindfulness", icon: <Footprints />, sub: "Less is truly more" }
          ].map((val, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="basho-gold-plate basho-gold-plate--value"
            >
              <div className="basho-gold-icon">{val.icon}</div>
              <h4 className="basho-gold-title">{val.title}</h4>
              <p className="basho-gold-body basho-gold-body--small">{val.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default MissionVision;

