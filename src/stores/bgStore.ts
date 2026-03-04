import { atom } from 'nanostores';

export const slides = [
  {
    id: 1,
    image: '/R-C (7).jpg',
    title: '探索无限可能',
    subtitle: 'Explore Infinite Possibilities',
    desc: '设计与科技的完美融合，为您呈现极致的数字体验。',
    position: 'center',
  },
  {
    id: 2,
    image: '/g4603.jpg',
    title: '极简美学',
    subtitle: 'Minimalist Aesthetics',
    desc: '少即是多，用最纯粹的线条勾勒出最动人的画面。',
    position: 'center',
  },
  {
    id: 3,
    image: '/bg-light.jpg',
    title: '自然灵感',
    subtitle: 'Inspired by Nature',
    desc: '从自然中汲取灵感，让界面呼吸，让交互流畅。',
    position: 'center',
  },
  {
    id: 4,
    image: '/bg-dark.jpg',
    title: '暗夜微光',
    subtitle: 'Glimmer in the Dark',
    desc: '在深邃的暗色模式中，感受不一样的沉浸体验。',
    position: 'center',
  },
];

export const currentIndex = atom(0);
export const isPaused = atom(false);

export const nextSlide = () => {
  currentIndex.set((currentIndex.get() + 1) % slides.length);
};

export const prevSlide = () => {
  currentIndex.set((currentIndex.get() - 1 + slides.length) % slides.length);
};

export const setSlide = (index: number) => {
  currentIndex.set(index);
};
