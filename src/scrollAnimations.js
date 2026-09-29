import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function mountScrollAnimations() {
  const context = gsap.context(() => {
    gsap.utils.toArray('.reveal').forEach(element => {
      const siblings = [...element.parentElement.querySelectorAll(':scope > .reveal')];
      const delay = siblings.length > 1 ? Math.min(siblings.indexOf(element), 5) * .075 : 0;
      const tween = gsap.fromTo(element,
        { opacity: 0, y: 28, scale: .985 },
        { opacity: 1, y: 0, scale: 1, duration: .85, delay, ease: 'power3.out', paused: true });
      ScrollTrigger.create({ trigger: element, start: 'top 90%', end: 'bottom 10%', onEnter: () => tween.restart(), onEnterBack: () => tween.restart() });
    });

    gsap.utils.toArray('.module-section').forEach(section => {
      const content = section.querySelector(':scope > .container');
      if (!content) return;
      gsap.to(content, { opacity: .76, y: -18, scale: .985, ease: 'none', scrollTrigger: { trigger: section, start: 'bottom 72%', end: 'bottom 28%', scrub: .4 } });
    });

    gsap.utils.toArray('.level-track i').forEach(element => {
      const tween = gsap.fromTo(element, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.out', paused: true });
      ScrollTrigger.create({ trigger: element, start: 'top 90%', end: 'bottom 10%', onEnter: () => tween.restart(), onEnterBack: () => tween.restart() });
    });
  });

  ScrollTrigger.refresh();
  return () => context.revert();
}
