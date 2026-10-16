import React, { useEffect } from 'react';

/**
 * Orquestrador de animações editoriais:
 * - Scroll Reveal escalonado (data-reveal="h" | "p" | "ctn" | "slide")
 * - Parallax suave em fotografias de grande formato (data-parallax-w / data-parallax-img)
 * - Botões magnéticos em telas desktop (data-magnetic)
 * - Animação de recorte progressivo no CTA final (data-cta-scroll)
 */
export const MotionController: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const root = document.documentElement;

    // Em ambientes com IntersectionObserver real (navegador), ativa revelação progressiva
    const hasIntersectionObserver = typeof window.IntersectionObserver === 'function';
    if (hasIntersectionObserver) {
      root.classList.add('motion-ready');
    }

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );

    // Calcula atraso escalonado (stagger) entre elementos irmãos dentro do mesmo bloco
    revealElements.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const siblings = Array.from(parent.children).filter((child) =>
        child.hasAttribute('data-reveal')
      );
      const idx = siblings.indexOf(el);
      if (idx > 0) {
        el.style.transitionDelay = `${Math.min(idx * 90, 360)}ms`;
      }
    });

    let observer: IntersectionObserver | null = null;
    if (hasIntersectionObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.classList.add('is-revealed');
              observer?.unobserve(target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -6% 0px',
        }
      );

      revealElements.forEach((el) => observer?.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
    }

    // Parallax suave e animação do CTA final via requestAnimationFrame
    const parallaxWrappers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax-w]')
    );
    const ctaScroll = document.querySelector<HTMLElement>('[data-cta-scroll]');

    let rafId = 0;
    let ticking = false;

    const updateScrollEffects = () => {
      ticking = false;
      const vh = window.innerHeight || 1;

      // 1. Parallax nas imagens full-bleed
      for (const wrapper of parallaxWrappers) {
        const img = wrapper.querySelector<HTMLElement>('[data-parallax-img]');
        if (!img) continue;
        const rect = wrapper.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) continue;

        const amp = Number(wrapper.dataset.parallaxAmp) || 6;
        // Progresso de -1 (entrando por baixo) a +1 (saindo por cima)
        const progress = ((vh - rect.top) / (vh + rect.height)) * 2 - 1;
        const clamped = Math.max(-1, Math.min(1, progress));
        const yPercent = (clamped * amp).toFixed(2);
        img.style.transform = `translate3d(0, ${yPercent}%, 0)`;
      }

      // 2. Efeito de moldura no CTA final (inspirado no cta-scroll do concorrente)
      if (ctaScroll) {
        const clipEl = ctaScroll.querySelector<HTMLElement>('[data-cta-clip]');
        const contentEl = ctaScroll.querySelector<HTMLElement>('[data-cta-content]');
        const rect = ctaScroll.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          // Progresso conforme a seção entra na tela
          const raw = 1 - Math.max(0, Math.min(1, rect.top / (vh * 0.85)));
          const isMobile = window.innerWidth < 992;
          const vInset = (raw * (isMobile ? 3.5 : 6)).toFixed(2);
          const hInset = (raw * (isMobile ? 4.5 : 14)).toFixed(2);
          if (clipEl) {
            clipEl.style.clipPath = `inset(${vInset}% ${hInset}% ${vInset}% ${hInset}% round 4px)`;
          }
          if (contentEl) {
            const scale = (0.92 + raw * 0.08).toFixed(3);
            contentEl.style.transform = `scale(${scale})`;
          }
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(updateScrollEffects);
      }
    };

    updateScrollEffects();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // 3. Efeito magnético sutil nos botões principais em desktop
    const isDesktop =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(min-width: 992px) and (hover: hover)').matches;

    const magneticCleanups: Array<() => void> = [];

    if (isDesktop) {
      const magneticElements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-magnetic]')
      );

      magneticElements.forEach((el) => {
        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
          const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.26;
          el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
        };
        const onLeave = () => {
          el.style.transform = 'translate3d(0, 0, 0)';
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        magneticCleanups.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
      magneticCleanups.forEach((fn) => fn());
      root.classList.remove('motion-ready');
    };
  }, []);

  return null;
};
