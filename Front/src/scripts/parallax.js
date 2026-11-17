document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.getElementById('inicio');
  const parallaxBg = document.getElementById('hero-parallax-bg');

  if (!heroSection || !parallaxBg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const velocidade = 0.25;
  let ticking = false;

  function atualizarParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const deslocamento = (scrollY - heroSection.offsetTop) * velocidade;
    parallaxBg.style.transform = `translate3d(0, ${deslocamento.toFixed(2)}px, 0)`;
    ticking = false;
  }

  function aoRolar() {
    if (!ticking) {
      window.requestAnimationFrame(atualizarParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', aoRolar, { passive: true });

  atualizarParallax();
});