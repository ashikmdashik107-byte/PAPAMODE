/**
 * Safe High-Impact Confetti & Jackpot Celebration Explosion Utility
 * Guarantees zero runtime crashes in any environment or iframe.
 */

import confetti from 'canvas-confetti';

/**
 * Triggers a multi-stage JACKPOT confetti explosion specifically designed
 * to celebrate 9x jackpot wins with fireworks, side cannons, and gold showers!
 */
export function triggerJackpotCelebration(targetCanvas?: HTMLCanvasElement | null) {
  try {
    const fireCanon = (opts: confetti.Options) => {
      try {
        if (targetCanvas && typeof targetCanvas.getBoundingClientRect === 'function') {
          const myConfetti = confetti.create(targetCanvas, {
            resize: true,
            useWorker: false
          });
          myConfetti(opts);
        } else if (typeof confetti === 'function') {
          confetti({ ...opts, disableForReducedMotion: true });
        }
      } catch (e) {
        console.warn('Canvas confetti wave error:', e);
      }
    };

    const jackpotColors = ['#ffd000', '#ff2a4b', '#ffffff', '#bf00ff', '#00ff88', '#ff9900'];

    // Wave 1: Immediate massive central explosion
    fireCanon({
      particleCount: 180,
      spread: 120,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.5 },
      colors: jackpotColors,
      ticks: 250
    });

    // Wave 2: Left & Right Crossfire Cannons
    setTimeout(() => {
      fireCanon({
        particleCount: 100,
        angle: 60,
        spread: 75,
        startVelocity: 55,
        origin: { x: 0.05, y: 0.65 },
        colors: jackpotColors,
        ticks: 300
      });
      fireCanon({
        particleCount: 100,
        angle: 120,
        spread: 75,
        startVelocity: 55,
        origin: { x: 0.95, y: 0.65 },
        colors: jackpotColors,
        ticks: 300
      });
    }, 220);

    // Wave 3: Golden Star / Sparkle Fountain from bottom
    setTimeout(() => {
      fireCanon({
        particleCount: 140,
        angle: 90,
        spread: 100,
        startVelocity: 60,
        origin: { x: 0.5, y: 0.9 },
        colors: ['#ffd000', '#fffb00', '#ffffff', '#ffaa00'],
        ticks: 320
      });
    }, 500);

    // Wave 4: Finale Celebration Cascade
    setTimeout(() => {
      fireCanon({
        particleCount: 120,
        spread: 140,
        origin: { x: 0.5, y: 0.4 },
        colors: jackpotColors,
        ticks: 280
      });
    }, 850);
  } catch (err) {
    console.warn('Confetti trigger handled gracefully:', err);
    fallbackDomJackpotBurst();
  }
}

/**
 * Standard Win celebration burst
 */
export function triggerWinCelebration(targetCanvas?: HTMLCanvasElement | null) {
  try {
    const fireCanon = (opts: confetti.Options) => {
      if (targetCanvas && typeof targetCanvas.getBoundingClientRect === 'function') {
        const myConfetti = confetti.create(targetCanvas, {
          resize: true,
          useWorker: false
        });
        myConfetti(opts);
      } else if (typeof confetti === 'function') {
        confetti({ ...opts, disableForReducedMotion: true });
      }
    };

    fireCanon({
      particleCount: 90,
      spread: 75,
      startVelocity: 40,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#00ff88', '#00e5ff', '#ffffff', '#ffd000'],
      ticks: 200
    });
  } catch (err) {
    console.warn('Win confetti trigger handled gracefully:', err);
    fallbackDomBurst(['#00ff88', '#00e5ff', '#ffd000']);
  }
}

/**
 * High-Density DOM Fallback for Jackpot Explosion
 */
function fallbackDomJackpotBurst() {
  try {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '99999';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    const colors = ['#ffd000', '#ff2a4b', '#bf00ff', '#00ff88', '#ffffff', '#ff9900'];
    const count = 75;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      const color = colors[i % colors.length];
      const isGold = i % 3 === 0;
      const size = isGold ? 12 : Math.random() * 8 + 6;
      
      piece.style.position = 'absolute';
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 0.8}px`;
      piece.style.backgroundColor = color;
      piece.style.left = '50%';
      piece.style.top = '45%';
      piece.style.borderRadius = isGold ? '50%' : '2px';
      piece.style.boxShadow = isGold ? '0 0 10px rgba(255,208,0,0.8)' : 'none';
      piece.style.transform = 'translate(-50%, -50%)';
      piece.style.transition = 'all 1.6s cubic-bezier(0.12, 0.8, 0.32, 1)';
      container.appendChild(piece);

      const angle = (i / count) * 360 + (Math.random() * 30 - 15);
      const rad = (angle * Math.PI) / 180;
      const distance = Math.random() * 380 + 120;
      const destX = Math.cos(rad) * distance;
      const destY = Math.sin(rad) * distance + (Math.random() * 150);

      requestAnimationFrame(() => {
        piece.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 1080}deg)`;
        piece.style.opacity = '0';
      });
    }

    setTimeout(() => {
      container.remove();
    }, 2000);
  } catch {
    // Non-critical fallback
  }
}

function fallbackDomBurst(colors: string[]) {
  try {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '99999';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    const count = 35;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      const color = colors[i % colors.length];
      const size = Math.random() * 8 + 6;
      const left = Math.random() * 80 + 10;
      
      piece.style.position = 'absolute';
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 0.7}px`;
      piece.style.backgroundColor = color;
      piece.style.left = `${left}%`;
      piece.style.top = '40%';
      piece.style.borderRadius = '2px';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
      container.appendChild(piece);

      requestAnimationFrame(() => {
        const destX = (Math.random() - 0.5) * 300;
        const destY = Math.random() * 300 + 100;
        piece.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 720}deg)`;
        piece.style.opacity = '0';
      });
    }

    setTimeout(() => {
      container.remove();
    }, 1400);
  } catch {
    // Non-critical fallback
  }
}
