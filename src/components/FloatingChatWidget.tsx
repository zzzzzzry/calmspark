import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingChatWidget() {
  const handleClick = () => {
    window.location.href = '/chat';
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 p-4 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-700"
    >
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  );
}
