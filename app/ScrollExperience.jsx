'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollExperience({ sections, children }) {
  const [activeSection, setActiveSection] = useState(0);
  const [incomingSection, setIncomingSection] = useState(null);
  const [direction, setDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => {
    const getCurrentPage = () => document.querySelector('.slide-page.is-current');
    const move = (step) => {
      if (isTransitioning) return;
      const next = activeSection + step;
      if (next < 0 || next >= sections.length) return;
      setDirection(step > 0 ? 'next' : 'previous');
      setIsTransitioning(true);
      setIncomingSection(next);
      window.setTimeout(() => {
        setActiveSection(next);
        setIncomingSection(null);
        setIsTransitioning(false);
      }, 1000);
    };
    const onWheel = (event) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) < 8 || isTransitioning) return;
      const currentPage = getCurrentPage();
      const canScrollInside = currentPage?.dataset.scrollable !== 'false' || window.matchMedia('(max-width: 800px)').matches;
      const maxScroll = currentPage ? currentPage.scrollHeight - currentPage.clientHeight : 0;
      const atBottom = !currentPage || currentPage.scrollTop >= maxScroll - 2;
      const atTop = !currentPage || currentPage.scrollTop <= 2;
      if (canScrollInside && event.deltaY > 0 && !atBottom) {
        currentPage.scrollTop = Math.min(maxScroll, currentPage.scrollTop + event.deltaY);
        return;
      }
      if (canScrollInside && event.deltaY < 0 && !atTop) {
        currentPage.scrollTop = Math.max(0, currentPage.scrollTop + event.deltaY);
        return;
      }
      move(event.deltaY > 0 ? 1 : -1);
    };
    const onNavigate = (event) => {
      const target = event.detail;
      if (target === activeSection || target < 0 || target >= sections.length || isTransitioning) return;
      setDirection(target > activeSection ? 'next' : 'previous');
      setIsTransitioning(true);
      setIncomingSection(target);
      window.setTimeout(() => {
        setActiveSection(target);
        setIncomingSection(null);
        setIsTransitioning(false);
      }, 1000);
    };
    const onInternalLink = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const target = sections.indexOf(link.getAttribute('href').slice(1));
      if (target === -1) return;
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('navigate-section', { detail: target }));
    };
    const onKeyDown = (event) => {
      if (['ArrowDown', 'PageDown', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(1); }
      if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(event.key)) { event.preventDefault(); move(-1); }
    };
    const onTouchStart = (event) => { touchStart.current = event.touches[0].clientY; };
    const onTouchEnd = (event) => {
      if (touchStart.current === null) return;
      const distance = touchStart.current - event.changedTouches[0].clientY;
      if (Math.abs(distance) > 45) {
        const currentPage = getCurrentPage();
        const canScrollInside = currentPage?.dataset.scrollable !== 'false' || window.matchMedia('(max-width: 800px)').matches;
        const maxScroll = currentPage ? currentPage.scrollHeight - currentPage.clientHeight : 0;
        const atBottom = !currentPage || currentPage.scrollTop >= maxScroll - 2;
        const atTop = !currentPage || currentPage.scrollTop <= 2;
        if (canScrollInside && distance > 0 && !atBottom) currentPage.scrollTop = Math.min(maxScroll, currentPage.scrollTop + distance);
        else if (canScrollInside && distance < 0 && !atTop) currentPage.scrollTop = Math.max(0, currentPage.scrollTop + distance);
        else move(distance > 0 ? 1 : -1);
      }
      touchStart.current = null;
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('navigate-section', onNavigate);
    window.addEventListener('click', onInternalLink);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('navigate-section', onNavigate);
      window.removeEventListener('click', onInternalLink);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [activeSection, isTransitioning, sections.length]);

  return <div className="experience-shell" data-direction={direction}><div className="section-stage">{children(activeSection, incomingSection, isTransitioning)}</div><div className={`curtain ${isTransitioning ? 'is-moving' : ''}`} aria-hidden="true" /><div className="section-counter">0{incomingSection === null ? activeSection + 1 : incomingSection + 1}<span>/ 0{sections.length}</span></div></div>;
}
