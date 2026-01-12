// import { motion } from 'framer-motion';
// import { useInView } from 'framer-motion';
// import { useRef } from 'react';

// const MissionVision = () => {
//   const containerRef = useRef(null);
//   const isInView = useInView(containerRef, { once: true, amount: 0.3 });

//   const values = [
//     {
//       icon: '🕊️',
//       title: 'Authenticity',
//       description:
//         'Honest craftsmanship with no shortcuts, honoring traditional techniques',
//       color: 'from-terracotta/20 to-cinnamon/20',
//     },
//     {
//       icon: '🌱',
//       title: 'Sustainability',
//       description: 'Eco-conscious materials that respect our planet',
//       color: 'from-mahogany/20 to-clay/20',
//     },
//     {
//       icon: '🧘',
//       title: 'Mindfulness',
//       description: 'Creating with intention, presence, and quiet focus',
//       color: 'from-cinnamon/20 to-terracotta/20',
//     },
//   ];

//   const principles = [
//     {
//       number: '01',
//       principle: 'Every crack tells a story',
//       line: 'We celebrate imperfections as markers of journey',
//     },
//     {
//       number: '02',
//       principle: 'Time is the best craftsman',
//       line: 'We create pieces meant to age with grace',
//     },
//     {
//       number: '03',
//       principle: 'Less is truly more',
//       line: 'We believe in the power of intentional emptiness',
//     },
//   ];

//   return (
//     <motion.section
//       ref={containerRef}
//       className="basho-about-section basho-about-mission"
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.3 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="basho-about-inner">
//         {/* Section Title */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           className="text-center mb-20"
//         >
//           <div className="inline-flex items-center space-x-4 mb-6">
//             <div className="h-px w-12 bg-terracotta"></div>
//             <span className="text-clay/60 font-japanese">理念と使命</span>
//             <div className="h-px w-12 bg-terracotta"></div>
//           </div>
//           <h2 className="text-5xl md:text-6xl font-japanese text-mahogany mb-6">
//             Our Guiding Stars
//           </h2>
//           <p className="text-xl text-clay/70 max-w-3xl mx-auto">
//             The principles that shape every curve, every texture, every moment of
//             creation
//           </p>
//         </motion.div>

//         {/* Mission & Vision Cards */}
//         <div className="grid lg:grid-cols-2 gap-4 mb-10">
//           {/* Mission Card */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={isInView ? { opacity: 1, x: 0 } : {}}
//             transition={{ delay: 0.2 }}
//             className="group"
//           >
//             <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-sand hover:shadow-3xl transition-all duration-500 h-full">
//               <div className="text-5xl mb-6 basho-mission-emoji">🎯</div>
//               <div className="flex items-center mb-6">
//                 <div className="w-12 h-1 bg-gradient-to-r from-terracotta to-cinnamon mr-4"></div>
//                 <h3 className="text-3xl font-japanese text-mahogany basho-mission-heading">Mission</h3>
//               </div>
//               <p className="text-lg text-clay/80 leading-relaxed mb-8 basho-mission-body">
//                 To craft ceramic pieces that serve as daily reminders of
//                 Wabi-Sabi—objects that celebrate imperfection, honor natural
//                 materials, and bring mindful beauty into contemporary living
//                 spaces.
//               </p>
//               <div className="text-terracotta text-sm font-medium">Core Purpose</div>
//             </div>
//           </motion.div>

//           {/* Vision Card */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={isInView ? { opacity: 1, x: 0 } : {}}
//             transition={{ delay: 0.4 }}
//             className="group"
//           >
//             <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-sand hover:shadow-3xl transition-all duration-500 h-full">
//               <div className="text-5xl mb-6 basho-mission-emoji">🔮</div>
//               <div className="flex items-center mb-6">
//                 <div className="w-12 h-1 bg-gradient-to-r from-cinnamon to-mahogany mr-4"></div>
//                 <h3 className="text-3xl font-japanese text-mahogany basho-mission-heading">Vision</h3>
//               </div>
//               <p className="text-lg text-clay/80 leading-relaxed mb-8 basho-mission-body">
//                 To establish Bashō as the bridge between centuries-old Japanese
//                 craftsmanship and modern global living—creating heirlooms that
//                 inspire mindfulness, conversations, and a deeper connection to
//                 the present moment.
//               </p>
//               <div className="text-terracotta text-sm font-medium">
//                 Future Aspiration
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Core Values */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ delay: 0.6 }}
//           className="mb-24"
//         >
//           <h3 className="text-3xl font-japanese text-center text-mahogany mb-16">
//             Core Values
//           </h3>

//           <div className="grid md:grid-cols-3 gap-3">
//             {values.map((value, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={isInView ? { opacity: 1, y: 0 } : {}}
//                 transition={{ delay: 0.8 + index * 0.1 }}
//                 whileHover={{ y: -10 }}
//                 className="group"
//               >
//                 <div
//                   className={`bg-gradient-to-br ${value.color} rounded-2xl p-8 h-full transition-all duration-500 group-hover:shadow-xl`}
//                 >
//                   <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
//                     {value.icon}
//                   </div>
//                   <h4 className="text-2xl font-japanese text-mahogany mb-4">
//                     {value.title}
//                   </h4>
//                   <p className="text-clay/80">{value.description}</p>
//                   <div className="mt-6 pt-6 border-t border-clay/10">
//                     <div className="h-1 w-0 group-hover:w-full bg-terracotta transition-all duration-700"></div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Guiding Principles */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={isInView ? { opacity: 1 } : {}}
//           transition={{ delay: 1 }}
//           className="relative"
//         >
//           <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-terracotta/30 to-transparent transform -translate-x-1/2"></div>

//           <div className="grid gap-4">
//             {principles.map((principle, index) => (
//               <motion.div
//                 key={index}
//                 initial={{
//                   opacity: 0,
//                   x: index % 2 === 0 ? -30 : 30,
//                 }}
//                 animate={isInView ? { opacity: 1, x: 0 } : {}}
//                 transition={{ delay: 1.2 + index * 0.2 }}
//                 className={`flex items-center ${
//                   index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
//                 }`}
//               >
//                 <div className="w-1/2 px-8">
//                   <div
//                     className={`p-8 rounded-2xl ${
//                       index % 2 === 0 ? 'bg-white/80' : 'bg-clay/5'
//                     }`}
//                   >
//                     <div className="text-terracotta text-5xl font-japanese mb-4 basho-principle-number">
//                       {principle.number}
//                     </div>
//                     <h4 className="text-2xl font-japanese text-mahogany mb-3">
//                       {principle.principle}
//                     </h4>
//                     <p className="text-clay/70">{principle.line}</p>
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <div className="w-6 h-6 rounded-full bg-terracotta border-4 border-sand"></div>
//                   {index < principles.length - 1 && (
//                     <div className="absolute top-6 left-1/2 w-px h-24 bg-gradient-to-b from-terracotta to-transparent transform -translate-x-1/2"></div>
//                   )}
//                 </div>

//                 <div className="w-1/2"></div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Closing Statement */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={isInView ? { opacity: 1, scale: 1 } : {}}
//           transition={{ delay: 2, type: 'spring' }}
//           className="basho-about-mission-closing"
//         >
//           <div className="basho-about-pill">
//             <div className="basho-about-pill-inner">
//               <p className="basho-about-mission-quote">
//                 "We don't create perfect pieces; we create honest ones."
//               </p>
//               <div className="basho-about-accent-text">— Bashō Philosophy</div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.section>
//   );
// };

// export default MissionVision;

// -------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// import React, { useRef } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { Target, Lightbulb } from "lucide-react";

// export default function MissionVission() {
//   const ref = useRef(null);

//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end end"],
//   });

//   const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
//   const opacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);

//   return (
    
//     <section
//       ref={ref}
//       className="min-h-[200vh] bg-[#FDFBF9] flex items-center justify-center px-6"
//     >
//       <motion.div
//         style={{ scale, opacity }}
//         className="max-w-7xl w-full bg-[#F3EDE7]
//                    rounded-[80px] p-20
//                    shadow-[0_60px_160px_rgba(166,139,124,0.25)]"
//       >
//         {/* TITLE */}
//         <div className="text-center mb-24">
//           <h2 className="text-[#3E332B] text-6xl font-serif mb-6">
//             Our Guiding Stars
//           </h2>
//           <div className="w-32 h-px bg-[#A68B7C]/40 mx-auto" />
//         </div>

//         {/* GOLD PLATES */}
//         <div className="grid md:grid-cols-2 gap-24">
//           <GoldPlate
//             icon={<Target />}
//             label="MISSION"
//             text="To craft ceramic pieces that serve as daily reminders of Wabi-Sabi—honoring imperfection, celebrating natural materials, and bringing mindful beauty into contemporary living spaces."
//           />

//           <GoldPlate
//             icon={<Lightbulb />}
//             label="VISION"
//             text="To establish Bashō as a bridge between centuries-old Japanese craftsmanship and modern global living—creating heirlooms that inspire presence, reflection, and connection."
//           />
//         </div>
//       </motion.div>
//     </section>
//   );
// }

// /* ---------------- GOLD PLATE ---------------- */

// function GoldPlate({ icon, label, text }) {
//   return (
//     <div
//       className="relative bg-[#F3EDE7] rounded-[70px]
//                  p-20 text-center
//                  border border-white
//                  shadow-[0_80px_200px_rgba(166,139,124,0.3)]
//                  overflow-hidden"
//     >
//       {/* Light sweep */}
//       <motion.div
//         className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
//         animate={{ x: ["-120%", "120%"] }}
//         transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
//       />

//       <div className="relative z-10">
//         <div className="w-16 h-16 mx-auto mb-12 rounded-full bg-[#FCFAF8]
//                         flex items-center justify-center">
//           {React.cloneElement(icon, {
//             size: 30,
//             className: "text-[#A68B7C]",
//           })}
//         </div>

//         <span className="block tracking-[0.4em] text-[13px]
//                          font-bold text-[#A68B7C] mb-12">
//           {label}
//         </span>

//         <p className="font-serif text-[#3E332B]
//                       text-[34px] leading-snug">
//           {text}
//         </p>
//       </div>
//     </div>
//   );
// }
// ---------------------------------------------------------------------------

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
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h2 className="text-[#3D342E] text-5xl md:text-6xl mb-6 font-medium">
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
                "To thoughtfully craft ceramic pieces that serve as enduring companions in everyday life — quiet yet powerful reminders of Wabi-Sabi.Each creation honors the beauty of imperfection, the honesty of natural materials, and the marks left by time, touch, and process. Through intentional form, texture, and restraint, our work invites slower living, mindful rituals, and a deeper appreciation for the imperfect moments that shape contemporary life."
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
  className="
    basho-gold-plate 
    basho-gold-plate--small
    rounded-[28px] 
    p-10 
    flex 
    flex-col 
    items-center 
    text-center
  "
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

        {/* Core Values — untouched */}
        <motion.h3
  variants={itemVariants}
  className="basho-core-values-heading"
>
  Core Values
</motion.h3>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Authenticity", icon: <Flower2 />, sub: "Every crack tells a story" },
            { title: "Sustainability", icon: <Sprout />, sub: "Time is the best craftsman" },
            { title: "Mindfulness", icon: <Footprints />, sub: "Less is truly more" }
          ].map((val, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-[#FAF7F4] rounded-[28px] p-8 flex flex-col items-center text-center shadow-sm border border-white/60"
            >
              <div className="basho-gold-icon">{val.icon}
              </div>
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

