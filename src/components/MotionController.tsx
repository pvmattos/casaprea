import React, { useEffect } from 'react';

/**
 * Orquestrador de animações editoriais:
 * - Scroll Reveal escalonado (data-reveal="h" | "p" | "ctn" | "slide") imune a re-renders do React
 * - Parallax pronunciado e suave em fotografias de grande formato (data-parallax-w / data-parallax-img)
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
    const hasIntersectionObserver = typeof window.IntersectionObserver === 'function';
    if (hasIntersectionObserver) {
      root.classList.add('motion-ready');
    }

    const markRevealed = (el: HTMLElement) => {
      el.setAttribute('data-revealed', 'true');
      el.classList.add('is-revealed');
    };

    let io: IntersectionObserver | null = null;
    if (hasIntersectionObserver) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              markRevealed(target);
              io?.unobserve(target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px -4% 0px',
        }
      );
    }

    const registerRevealElements = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed="true"])')
      );

      elements.forEach((el) => {
        const parent = el.parentElement;
        if (parent && !el.style.transitionDelay) {
          const siblings = Array.from(parent.children).filter((child) =>
            child.hasAttribute('data-reveal')
          );
          const idx = siblings.indexOf(el);
          if (idx > 0) {
            el.style.transitionDelay = `${Math.min(idx * 70, 280)}ms`;
          }
        }

        if (!io) {
          markRevealed(el);
          return;
        }

        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        if (rect.top < vh * 0.96 && rect.bottom > 0) {
          requestAnimationFrame(() => markRevealed(el));
        } else {
          io.observe(el);
        }
      });
    };

    registerRevealElements();

    let mo: MutationObserver | null = null;
    if (typeof window.MutationObserver === 'function') {
      mo = new MutationObserver(() => {
        registerRevealElements();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    let rafId = 0;
    let ticking = false;

    const updateScrollEffects = () => {
      ticking = false;
      const vh = window.innerHeight || 1;

      // 1. Parallax pronunciado nas seções de fotografia única
      const parallaxWrappers = document.querySelectorAll<HTMLElement>('[data-parallax-w]');
      parallaxWrappers.forEach((wrapper) => {
        const img = wrapper.querySelector<HTMLElement>('[data-parallax-img]');
        if (!img) return;
        const rect = wrapper.getBoundingClientRect();
        if (rect.bottom < -150 || rect.top > vh + 150) return;

        const amp = Number(wrapper.dataset.parallaxAmp) || 15;
        const progress = ((vh - rect.top) / (vh + rect.height)) * 2 - 1;
        const clamped = Math.max(-1, Math.min(1, progress));
        const yPercent = (clamped * amp).toFixed(2);
        img.style.transform = `translate3d(0, ${yPercent}%, 0)`;
      });

      // 2. Efeito de moldura no CTA final
      const ctaScroll = document.querySelector<HTMLElement>('[data-cta-scroll]');
      if (ctaScroll) {
        const clipEl = ctaScroll.querySelector<HTMLElement>('[data-cta-img]');
        const rect = ctaScroll.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          const raw = 1 - Math.max(0, Math.min(1, rect.top / (vh * 0.85)));
          const isMobile = window.innerWidth < 992;
          const vInset = ((1 - raw) * (isMobile ? 3 : 5)).toFixed(2);
          const hInset = ((1 - raw) * (isMobile ? 4 : 8)).toFixed(2);
          if (clipEl) {
            clipEl.style.clipPath = `inset(${vInset}% ${hInset}% ${vInset}% ${hInset}% round 4px)`;
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

    return () => {
      io?.disconnect();
      mo?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
      root.classList.remove('motion-ready');
    };
  }, []);

  return null;
};
