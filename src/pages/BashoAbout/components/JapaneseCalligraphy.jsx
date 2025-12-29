import { motion } from 'framer-motion';

const JapaneseCalligraphy = ({ text, size = 'text-5xl' }) => {
  return (
    <motion.div
      className={`font-japanese ${size} text-mahogany relative inline-block`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      {text}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </motion.div>
  );
};

export default JapaneseCalligraphy;
