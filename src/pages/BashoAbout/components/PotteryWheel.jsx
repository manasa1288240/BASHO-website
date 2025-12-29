import { motion } from 'framer-motion';

const PotteryWheel = () => {
  return (
    <div className="relative w-64 h-64">
      {/* Outer Wheel */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-terracotta/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Middle Wheel */}
      <motion.div
        className="absolute inset-8 rounded-full border-3 border-cinnamon/40"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner Wheel */}
      <motion.div
        className="absolute inset-16 rounded-full border-2 border-mahogany/50"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Clay Form */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-clay to-mahogany rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          borderRadius: ['50%', '40% 60% 60% 40%', '50%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Hands */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-32 h-32"
        animate={{
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-6 bg-sand/80 rounded-full" />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-6 bg-sand/80 rounded-full" />
      </motion.div>

      {/* Flying Clay Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-terracotta"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, Math.sin(i) * 60, 0],
            y: [0, Math.cos(i) * 60, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default PotteryWheel;
