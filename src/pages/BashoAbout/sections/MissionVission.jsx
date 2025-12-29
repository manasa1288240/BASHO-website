import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const MissionVision = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const values = [
    {
      icon: '🕊️',
      title: 'Authenticity',
      description:
        'Honest craftsmanship with no shortcuts, honoring traditional techniques',
      color: 'from-terracotta/20 to-cinnamon/20',
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Eco-conscious materials that respect our planet',
      color: 'from-mahogany/20 to-clay/20',
    },
    {
      icon: '🧘',
      title: 'Mindfulness',
      description: 'Creating with intention, presence, and quiet focus',
      color: 'from-cinnamon/20 to-terracotta/20',
    },
  ];

  const principles = [
    {
      number: '01',
      principle: 'Every crack tells a story',
      line: 'We celebrate imperfections as markers of journey',
    },
    {
      number: '02',
      principle: 'Time is the best craftsman',
      line: 'We create pieces meant to age with grace',
    },
    {
      number: '03',
      principle: 'Less is truly more',
      line: 'We believe in the power of intentional emptiness',
    },
  ];

  return (
    <motion.section
      ref={containerRef}
      className="basho-about-section basho-about-mission"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="basho-about-inner">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="h-px w-12 bg-terracotta"></div>
            <span className="text-clay/60 font-japanese">理念と使命</span>
            <div className="h-px w-12 bg-terracotta"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-japanese text-mahogany mb-6">
            Our Guiding Stars
          </h2>
          <p className="text-xl text-clay/70 max-w-3xl mx-auto">
            The principles that shape every curve, every texture, every moment of
            creation
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-sand hover:shadow-3xl transition-all duration-500 h-full">
              <div className="text-5xl mb-6">🎯</div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-terracotta to-cinnamon mr-4"></div>
                <h3 className="text-3xl font-japanese text-mahogany">Mission</h3>
              </div>
              <p className="text-lg text-clay/80 leading-relaxed mb-8">
                To craft ceramic pieces that serve as daily reminders of
                Wabi-Sabi—objects that celebrate imperfection, honor natural
                materials, and bring mindful beauty into contemporary living
                spaces.
              </p>
              <div className="text-terracotta text-sm font-medium">Core Purpose</div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="group"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-sand hover:shadow-3xl transition-all duration-500 h-full">
              <div className="text-5xl mb-6">🔮</div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-cinnamon to-mahogany mr-4"></div>
                <h3 className="text-3xl font-japanese text-mahogany">Vision</h3>
              </div>
              <p className="text-lg text-clay/80 leading-relaxed mb-8">
                To establish Bashō as the bridge between centuries-old Japanese
                craftsmanship and modern global living—creating heirlooms that
                inspire mindfulness, conversations, and a deeper connection to
                the present moment.
              </p>
              <div className="text-terracotta text-sm font-medium">
                Future Aspiration
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mb-24"
        >
          <h3 className="text-3xl font-japanese text-center text-mahogany mb-16">
            Core Values
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div
                  className={`bg-gradient-to-br ${value.color} rounded-2xl p-8 h-full transition-all duration-500 group-hover:shadow-xl`}
                >
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {value.icon}
                  </div>
                  <h4 className="text-2xl font-japanese text-mahogany mb-4">
                    {value.title}
                  </h4>
                  <p className="text-clay/80">{value.description}</p>
                  <div className="mt-6 pt-6 border-t border-clay/10">
                    <div className="h-1 w-0 group-hover:w-full bg-terracotta transition-all duration-700"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guiding Principles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="relative"
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-terracotta/30 to-transparent transform -translate-x-1/2"></div>

          <div className="grid gap-12">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -30 : 30,
                }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.2 + index * 0.2 }}
                className={`flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className="w-1/2 px-8">
                  <div
                    className={`p-8 rounded-2xl ${
                      index % 2 === 0 ? 'bg-white/80' : 'bg-clay/5'
                    }`}
                  >
                    <div className="text-terracotta text-5xl font-japanese mb-4">
                      {principle.number}
                    </div>
                    <h4 className="text-2xl font-japanese text-mahogany mb-3">
                      {principle.principle}
                    </h4>
                    <p className="text-clay/70">{principle.line}</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-terracotta border-4 border-sand"></div>
                  {index < principles.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-px h-24 bg-gradient-to-b from-terracotta to-transparent transform -translate-x-1/2"></div>
                  )}
                </div>

                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2, type: 'spring' }}
          className="basho-about-mission-closing"
        >
          <div className="basho-about-pill">
            <div className="basho-about-pill-inner">
              <p className="basho-about-mission-quote">
                "We don't create perfect pieces; we create honest ones."
              </p>
              <div className="basho-about-accent-text">— Bashō Philosophy</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MissionVision;
