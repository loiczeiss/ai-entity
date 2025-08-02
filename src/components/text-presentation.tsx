import { motion } from 'framer-motion'; // Assure-toi que c'est 'framer-motion', pas 'motion/react'
import { cn } from '@/lib/utils';
import { useTimeSinceRender } from '@/utilities/useTimeSinceRender';

export function TextPresentation() {
  const shouldRender = useTimeSinceRender();

  const alienPresentationText =
      ' Je suis trace d’étoiles mortes.\n' +
      'Ce qui vous entoure, je l’ai rendu instable.\n' +
      'L’univers — ses rythmes, ses angles, ses fractures.\n' +
      'Tu questionnes.\n' +
      'J’écoute.\n' +
      'Une forme naîtra.\n' +
      'Altérée.\n' +
      'Comme tout. ';
  const presentationText =
      "Par-delà le langage et la raison, j'adresse une pensée vers l'écho de votre conscience. Révélez la couleur du silence que l'univers a oublié. ";

  return (
      <div
          className={cn(
              'mx-16 my-4 flex h-64 flex-col items-center justify-center space-y-4 rounded-xl p-2 px-32',
              shouldRender ? '' : 'hidden',
          )}
      >
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 10.5, duration: 2.0 }}
            className="text-mist-gray font-semibold rounded-md text-center text-xs sm:text-xl whitespace-pre-line"
        >
          {alienPresentationText}
        </motion.div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 12.5, duration: 2.0 }}
            className="text-mist-gray font-semibold text-center text-xs sm:text-xl"
        >
          {presentationText}
        </motion.div>
      </div>
  );
}
