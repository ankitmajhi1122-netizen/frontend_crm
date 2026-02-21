import { useSpring } from '@react-spring/web';

export function usePageTransition() {
  return useSpring({
    from: { opacity: 0, transform: 'translateY(16px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 24 },
  });
}

export function useModalScale() {
  return useSpring({
    from: { opacity: 0, transform: 'scale(0.92)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 320, friction: 22 },
  });
}

export function useFadeIn() {
  return useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 200 },
  });
}
