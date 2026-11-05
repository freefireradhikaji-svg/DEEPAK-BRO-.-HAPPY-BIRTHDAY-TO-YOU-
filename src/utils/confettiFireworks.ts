import confetti from 'canvas-confetti';

/**
 * Fires luxury golden fireworks across the screen
 */
export const triggerGoldFireworks = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#FFE79A', '#D4AF37', '#FFF6BD', '#AA771C', '#FF0033', '#FFFFFF'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.4,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

/**
 * Continuous celebration firework salvo
 */
export const startCelebrationFireworks = (durationMs = 5000) => {
  const animationEnd = Date.now() + durationMs;
  const colors = ['#D4AF37', '#FFD700', '#FF0033', '#FFFFFF', '#FFA500'];

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 40 * (timeLeft / durationMs);

    // Left cannon
    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.75 },
      colors,
    });

    // Right cannon
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.75 },
      colors,
    });
  }, 250);
};

/**
 * Floating red and golden hearts shower
 */
export const triggerHeartShower = () => {
  // Use custom shapes or scalar heart colors
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF0033', '#FF4D6D', '#D4AF37', '#FFCCD5'],
    shapes: ['star', 'circle'],
    scalar: 1.4,
  });
};
