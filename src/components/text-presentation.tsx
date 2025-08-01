import { useTypewriter } from '@/hooks/use-type-witer';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTimeSinceRender } from '@/utilities/useTimeSinceRender';

export function TextPresentation() {
  const shouldRender = useTimeSinceRender();
  console.log('shouldRender', shouldRender);
  const alientPresentationText =
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
    <motion.div
      className={cn(
        'bg-ash-gray/85 mx-16 my-4 flex h-full flex-col items-center  justify-center space-y-2 rounded-xl p-2',
        shouldRender() ? '' : 'hidden',
      )}
    >
      <p className={'text-alien-glow font-semibold rounded-md text-center text-xs sm:text-xl'}>
        {' '}
        {useTypewriter({
          text: alientPresentationText,
          startTyping: true,
          speed: 30,
          delay: 10000,
        })}
      </p>
      <p className={'text-alien-glow font-semibold text-center text-xs sm:text-xl'}>
        {' '}
        {useTypewriter({
          text: presentationText,
          startTyping: true,
          speed: 30,
          delay: 15940,
        })}
      </p>
    </motion.div>
  );
}
