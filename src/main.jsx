import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const getFrameDirectory = () => {
  const renderScale = Math.min(window.devicePixelRatio || 1, 2);
  const neededPixels = Math.max(window.innerWidth, window.innerHeight) * renderScale;
  if (neededPixels <= 1280) return 'frames';
  if (neededPixels <= 1920) return 'frames-hd';
  return 'frames-4k';
};
const frameUrl = (index, directory) => '/' + directory + '/ezgif-frame-' + String(index + 1).padStart(3, '0') + '.jpg';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const featuredFilm = { youtubeId: 'QbrYyD3Sm1s', title: 'Nethravathi Trek...' };
const getYouTubeId = (value = '') => {
  const input = String(value).trim();
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0] || '';
    if (url.hostname.endsWith('youtube.com') || url.hostname.endsWith('youtube-nocookie.com')) {
      return url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1] || '';
    }
  } catch {
    return '';
  }
  return '';
};

const portfolioProjects = [
  { slug: 'tenco', name: 'TENCO CAFE POS', mark: 'TENCO', logo: '/project-logos/tenco-cream.png', category: 'CAFE POINT OF SALE', role: 'WEBSITE DEVELOPER / TECHNICAL TEAM', stack: 'REACT / VITE / SUPABASE', status: 'IN PRODUCTION / ACTIVE DEVELOPMENT', description: 'A point-of-sale platform for cafes, developed with the technical team at Tenco.', featured: true },
  { slug: 'kairo', name: 'KAIRO', mark: 'KAIRO', logo: '/project-logos/kairo-maskable.png', category: 'FITNESS TRACKING', role: 'FOUNDER / DEVELOPER', stack: 'REACT / VITE / FIREBASE', status: 'PERSONAL PROJECT', description: 'A fitness-tracking app I started building for my own training and progress.', featured: true },
  { slug: 'roadsafe', name: 'ROADSAFE INDIA', mark: 'ROADSAFE', logo: '/project-logos/roadsafe-india.png', category: 'INTERACTIVE MAP / ROAD SAFETY', role: 'PROJECT DEVELOPER', stack: 'REACT / VITE', status: 'COLLEGE PROJECT / EXPANDING', description: 'A map project focused on accident hotspots in major Indian cities, with plans to grow into a more interactive experience.', featured: true },
  { slug: 'prana', name: 'PRANA', mark: 'PRANA', logo: '/project-logos/prana.png', category: 'ANIMAL HEALTH / HACKATHON', role: 'DEVELOPMENT TEAM MEMBER', stack: 'REACT / VITE / SUPABASE', status: 'HACKATHON PROJECT / FUTURE DEVELOPMENT', description: 'An animal disease outbreak detector app created with a hackathon team, with plans to explore its next stage.', featured: true },
  { slug: 'ayco', name: 'AYCO CRUSTO', mark: 'AYCO', logo: '/project-logos/ayco-crusto.jpeg', category: 'QR MENU / HOSPITALITY', role: 'DEVELOPER', stack: 'REACT / VITE / FIREBASE', status: 'LIVE-UPDATING MENU', description: 'A QR-based cafe menu for AYCO CRUSTO, designed to update live.', featured: false },
  { slug: 'wish-sites', name: 'WISH WEBSITES', mark: 'WISH', cover: '/project-covers/wish-websites.png', category: 'PERSONAL WEB EXPERIENCES', role: 'DEVELOPER', stack: 'REACT / VITE', status: 'SMALL WEB BUILDS', description: 'Custom little websites for birthdays, weddings, and other moments worth celebrating.', featured: false },
];

const collectionPages = {
  '/photography': {
    title: ['LIGHT, FOUND', 'IN PASSING.'],
    description: 'Everyday details, color, and places captured on the phone I carry.',
    items: [
      { title: 'LAST LIGHT / COAST', src: '/photos/coast-at-sunset.jpeg', alt: 'A fishing boat and rocky shoreline silhouetted against a glowing orange sunset.' },
      { title: 'DOME AT DUSK', src: '/photos/dome-at-dusk.jpeg', alt: 'Ornate domes framed against a soft peach sunset sky.' },
      { title: 'FOG ON THE TRAIL', src: '/photos/foggy-trail.jpeg', alt: 'A narrow trail crossing a green hillside disappearing into fog.' },
    ],
  },
  '/videography': {
    title: ['LET THE SCENE', 'BREATHE.'],
    description: 'I shoot and edit slow-paced cinematic videos, mostly on my Pixel 8 Pro and iPhones. I look for light, movement, and the small details that let a scene breathe.',
    items: ['SLOW STUDY / LIGHT', 'CINEMATIC CUT / PHONE', 'MOMENT IN MOTION'],
    emptyLabel: 'A MOMENT, TAKING SHAPE',
    emptyTitle: ['FIRST CUT', 'COMING SOON'],
    note: 'SHOT BY JASSIM / EDITED IN DAVINCI OR CAPCUT',
  },
  '/my-work': {
    title: ['BUILT TO', 'SOLVE REAL NEEDS.'],
    description: 'A growing collection of products, college work, and small web experiences—built with a problem in mind.',
    items: portfolioProjects,
  },
};

function SmoothScrollRail({ children, mode, label }) {
  const slides = React.Children.toArray(children);
  const viewportRef = useRef(null);
  const slideNodes = useRef([]);
  const requestFrameRef = useRef(null);
  const motion = useRef({ width: 0, slideWidth: 0, gap: 0, step: 0, max: 0, current: 0, target: 0, reduced: false });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const state = motion.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    state.reduced = motionPreference.matches;
    const onMotionPreference = (event) => { state.reduced = event.matches; scheduleFrame(); };
    let raf = 0;
    let last = 0;
    const tick = (now) => {
      raf = 0;
      const delta = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;
      if (!state.width || !state.step) return;
      const scrollEase = state.reduced ? 1 : 1 - Math.pow(1 - 0.075, delta * 60);
      state.current += (state.target - state.current) * scrollEase;
      if (Math.abs(state.target - state.current) < 0.08) state.current = state.target;

      const start = (state.width - state.slideWidth) / 2;
      for (let index = 0; index < slides.length; index += 1) {
        const node = slideNodes.current[index];
        if (!node) continue;
        const left = start + index * state.step - state.current;
        const distance = left + state.slideWidth / 2 - state.width / 2;
        const scale = state.reduced
          ? 1
          : distance > 0
            ? Math.min(2.5, 1 + distance / state.width)
            : Math.max(0.1, 1 + distance / state.width);
        const push = !state.reduced && distance > 0 ? (scale - 1) * state.slideWidth * 0.75 : 0;
        const dim = !state.reduced && scale < 1
          ? 1 - ((1 - scale) / 0.9) * 0.65
          : 1;
        node.style.transform = `translate3d(${left + push}px, -50%, 0) scale(${scale})`;
        node.style.opacity = '1';
        node.style.filter = dim < 0.999 ? `brightness(${dim})` : 'none';
        node.style.zIndex = String(1000 + Math.round(scale * 100));
      }

      const stillMoving = Math.abs(state.target - state.current) >= 0.08;
      if (stillMoving) raf = requestAnimationFrame(tick);
    };
    const scheduleFrame = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    requestFrameRef.current = scheduleFrame;

    const measure = () => {
      const firstSlide = slideNodes.current[0];
      if (!firstSlide) return;
      state.width = viewport.clientWidth;
      // offsetWidth is the untransformed layout width; getBoundingClientRect()
      // includes the animated scale and makes spacing drift during motion.
      state.slideWidth = firstSlide.offsetWidth;
      state.gap = window.innerWidth <= 760 ? 16 : 28;
      state.step = state.slideWidth + state.gap;
      state.max = Math.max(0, (slides.length - 1) * state.step);
      state.target = clamp(state.target, 0, state.max);
      scheduleFrame();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    motionPreference.addEventListener?.('change', onMotionPreference);
    measure();

    const onWheel = (event) => {
      const dominant = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!dominant) return;
      const canMove = dominant > 0 ? state.target < state.max - 0.5 : state.target > 0.5;
      if (!canMove) return;
      event.preventDefault();
      state.target = clamp(state.target + dominant * 1.35, 0, state.max);
      scheduleFrame();
    };
    const onKeyDown = (event) => {
      if (event.target !== viewport) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        state.target = clamp(state.target + state.step, 0, state.max);
        scheduleFrame();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        state.target = clamp(state.target - state.step, 0, state.max);
        scheduleFrame();
      } else if (event.key === 'Home') {
        event.preventDefault();
        state.target = 0;
        scheduleFrame();
      } else if (event.key === 'End') {
        event.preventDefault();
        state.target = state.max;
        scheduleFrame();
      }
    };

    let pointer = null;
    let lastX = 0;
    const onPointerDown = (event) => {
      if (event.target.closest('button, a')) return;
      pointer = event.pointerId;
      lastX = event.clientX;
      viewport.setPointerCapture(event.pointerId);
      scheduleFrame();
    };
    const onPointerMove = (event) => {
      if (pointer === event.pointerId) {
        const dx = event.clientX - lastX;
        lastX = event.clientX;
        state.target = clamp(state.target - dx * 1.15, 0, state.max);
        scheduleFrame();
        return;
      }
    };
    const onPointerUp = (event) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('keydown', onKeyDown);
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    return () => {
      cancelAnimationFrame(raf);
      if (requestFrameRef.current === scheduleFrame) requestFrameRef.current = null;
      observer.disconnect();
      motionPreference.removeEventListener?.('change', onMotionPreference);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('keydown', onKeyDown);
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerUp);
      viewport.removeEventListener('pointercancel', onPointerUp);
    };
  }, [slides.length]);

  const move = (direction) => {
    const state = motion.current;
    state.target = clamp(state.target + direction * state.step, 0, state.max);
    requestFrameRef.current?.();
  };

  return (
    <div className={'collection-rail collection-rail--' + mode}>
      <div className="collection-rail__viewport" ref={viewportRef} role="region" aria-label={label} aria-roledescription="carousel" tabIndex={0}>
        {slides.map((slide, index) => (
          <div className="collection-rail__slide" key={slide.key || index} ref={(node) => { slideNodes.current[index] = node; }} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
            {slide}
          </div>
        ))}
      </div>
      <div className="collection-rail__controls" role="group" aria-label="Carousel controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous slide">←</button>
        <span>SCROLL TO MOVE / DRAG OR USE ARROWS</span>
        <button type="button" onClick={() => move(1)} aria-label="Next slide">→</button>
      </div>
    </div>
  );
}

function CollectionPage({ page }) {
  const mode = page.items[0]?.src ? 'photo' : typeof page.items[0] === 'string' ? 'video' : 'work';
  const [items, setItems] = useState(mode === 'work' ? page.items : []);
  const [loading, setLoading] = useState(mode !== 'work');
  const [playingVideo, setPlayingVideo] = useState('');

  useEffect(() => {
    document.title = page.title.join(' ') + ' — Jazz';
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    if (mode === 'work') return undefined;
    let active = true;
    import('./lib/supabase.js')
      .then(({ loadPortfolioMedia, supabase }) => {
        if (!active) return null;
        if (!supabase) {
          setItems(page.items);
          setLoading(false);
          return null;
        }
        return loadPortfolioMedia(mode === 'photo' ? 'photo' : 'video').then((media) => {
          if (active) {
            setItems(media);
            setLoading(false);
          }
        });
      })
      .catch((error) => {
        console.warn('Could not load the Supabase portfolio gallery:', error.message);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [mode, page.items]);

  const cards = items.map((item, index) => {
    const photo = mode === 'photo' && typeof item === 'object';
    const video = mode === 'video' && typeof item === 'object';
    const project = mode === 'work' && typeof item === 'object';
    const label = photo || video ? item.title : project ? item.name : item;
    const videoId = video ? getYouTubeId(item.youtube_id || item.youtube_url || '') : '';
    const videoCover = video && (item.cover_src || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''));
    return (
      <article className={'collection-tile collection-tile--' + (index + 1) + (photo ? ' collection-tile--image' : project ? ' collection-project collection-project--' + item.slug : ' collection-tile--video')} key={item.id || label}>
        {photo && <img className="collection-tile__image" src={item.src} alt={item.alt} loading="lazy" />}
        {video && videoId && (
          <div className="collection-video">
            {playingVideo === videoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button className="collection-video__play" type="button" onClick={() => setPlayingVideo(videoId)} aria-label={`Play ${item.title}`}>
                <img
                  src={videoCover}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    if (videoId && !event.currentTarget.dataset.fallback) {
                      event.currentTarget.dataset.fallback = 'true';
                      event.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }
                  }}
                />
                <span aria-hidden="true">▶</span>
                <b>PLAY FILM</b>
              </button>
            )}
          </div>
        )}
        {project ? <>
          <span className="collection-tile__index"><b>0{index + 1}</b><i>{item.category}</i></span>
          {item.cover && <img className="collection-project__cover" src={item.cover} alt="Warm editorial still life representing celebratory wish websites." loading="lazy" />}
          <div className="collection-project__body">{item.logo ? <div className={'collection-project__brand-stage collection-project__brand-stage--' + item.slug}><img className={'collection-project__logo collection-project__logo--' + item.slug} src={item.logo} alt={item.name + ' logo'} loading="lazy" /></div> : <span className="collection-project__mark">{item.mark}</span>}<h2>{item.name}</h2><p>{item.description}</p></div>
          <div className="collection-project__meta"><span>{item.role}</span><span>{item.stack}</span><span>{item.status}</span></div>
        </> : <>
          <span className="collection-tile__index">{String(index + 1).padStart(2, '0')} / {photo ? 'PIXEL 8 PRO' : label}</span>
          {photo ? <div className="collection-tile__caption collection-tile__caption--photo"><strong>{item.title}</strong><span>{item.description || item.alt_text}</span></div> : video ? <span className="collection-tile__caption">{item.title} / SHOT &amp; EDITED BY JASSIM</span> : <div className="collection-tile__empty"><span>{page.emptyLabel || 'THE FIRST PIECE'}</span><strong>{page.emptyTitle ? page.emptyTitle.map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>) : <>COMING<br />INTO FOCUS</>}</strong></div>}
          {!photo && !video && <span className="collection-tile__note">{page.note || 'A PLACE FOR THE WORK TO LIVE'}</span>}
        </>}
      </article>
    );
  });

  return (
    <main className="collection-page">
      <header className="collection-topbar">
        <a className="brand-mark" href="/" aria-label="Jazz, home">JAZZ<span>.</span></a>
        <nav aria-label="Portfolio collections">
          <a href="/my-work">MY WORK</a>
          <a href="/videography">VIDEO</a>
          <a href="/photography">PHOTO</a>
          <a href="/#services">SERVICES</a>
          <a href="/#about">ABOUT</a>
          <a href="/#contact">CONTACT</a>
        </nav>
        <a className="collection-back" href="/#work">BACK TO HOME <span>↗</span></a>
      </header>
      <section className="collection-intro">
        <h1>{page.title.map((line) => <span key={line}>{line}</span>)}</h1>
        <p>{page.description}</p>
      </section>
      {loading ? (
        <div className={'collection-loading collection-loading--' + mode} role="status" aria-live="polite">LOADING THE COLLECTION<span /></div>
      ) : items.length ? (
        <SmoothScrollRail mode={mode} label={mode === 'photo' ? 'Photography gallery' : mode === 'video' ? 'Videography preview' : 'Selected projects'}>{cards}</SmoothScrollRail>
      ) : (
        <div className="collection-loading collection-loading--empty" role="status">THE COLLECTION IS BEING PREPARED</div>
      )}
    </main>
  );
}

function App() {
  const portfolioRef = useRef(null);
  const lenisRef = useRef(null);
  const heroRef = useRef(null);
  const heroStageRef = useRef(null);
  const presenceIntroRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [featuredFilmPlaying, setFeaturedFilmPlaying] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactStatus, setContactStatus] = useState('');

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.7, anchors: true });
    lenisRef.current = lenis;
    const syncScrollTrigger = () => ScrollTrigger.update();
    const animateScroll = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', syncScrollTrigger);
    gsap.ticker.add(animateScroll);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(animateScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) return undefined;
    let firstFrame = 0;
    let secondFrame = 0;
    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const id = decodeURIComponent(window.location.hash.slice(1));
        const target = document.getElementById(id);
        if (target) lenisRef.current?.scrollTo(target, { duration: 1.1, offset: 0 });
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      const lines = gsap.utils.toArray('.presence__title-line');
      const summary = presenceIntroRef.current.querySelector('.presence__summary');
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: presenceIntroRef.current,
          start: 'top 68%',
          once: true,
        },
      });
      timeline.fromTo(lines, { autoAlpha: 0, y: 34, filter: 'blur(8px)' }, {
        autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.85, stagger: 0.16, ease: 'power3.out',
      }).fromTo(summary, { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out',
      }, '-=0.36');
    }, presenceIntroRef);

    return () => context.revert();
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      const reveal = (selector, options = {}) => {
        const elements = Array.from(portfolioRef.current.querySelectorAll(selector));
        elements.forEach((element, index) => {
          gsap.fromTo(element, {
            autoAlpha: 0,
            y: options.y ?? 28,
            scale: options.scale ?? 0.99,
          }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: options.duration ?? 0.78,
            delay: (options.stagger ?? 0.06) * index,
            ease: options.ease ?? 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: element,
              start: options.start ?? 'top 86%',
              once: true,
            },
          });
        });
      };

      reveal('.identity-card', { y: 34, scale: 0.975, stagger: 0.08 });
      reveal('.philosophy__copy > *', { y: 24, stagger: 0.07 });
      reveal('.philosophy__visual', { y: 34, scale: 0.975, duration: 1 });
      reveal('.mobile-photo__intro > *', { y: 26, stagger: 0.08 });
      reveal('.mobile-photo__tile', { y: 36, scale: 0.975, stagger: 0.1, duration: 0.9 });
      reveal('.video-feature__intro > *', { y: 26, stagger: 0.08 });
      reveal('.video-feature__visual', { y: 34, scale: 0.975, duration: 0.9 });
      reveal('.display-band > .eyebrow, .display-band h2, .display-band__side', { y: 30, stagger: 0.1 });
      reveal('.projects__head > *, .projects__bottom > *', { y: 24, stagger: 0.08 });
      reveal('.project-card', { y: 34, scale: 0.985, stagger: 0.1, duration: 0.85 });
      reveal('.contact > *', { y: 25, stagger: 0.08 });
    }, portfolioRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const bitmaps = new Map();
    const pending = new Set();
    const controllers = new Map();
    const loadQueue = [];
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    const frameDirectory = getFrameDirectory();
    const cacheRadius = frameDirectory === 'frames-4k' ? 3 : 5;
    let currentFrame = 0;
    let scrollDirection = 1;
    let activeLoads = 0;
    let drawQueued = false;
    let trigger;

    const drawFrame = (target) => {
      let image = bitmaps.get(target);
      if (!image) {
        let nearestDistance = Infinity;
        for (const [frame, bitmap] of bitmaps) {
          const distance = Math.abs(frame - target);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            image = bitmap;
          }
        }
      }
      if (!image) return;

      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * dpr);
      const height = Math.round(bounds.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const scale = Math.max(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      context.clearRect(0, 0, width, height);
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    const paint = () => {
      drawQueued = false;
      drawFrame(currentFrame);
    };
    const queuePaint = () => {
      if (drawQueued) return;
      drawQueued = true;
      requestAnimationFrame(paint);
    };

    const pumpLoads = () => {
      while (!cancelled && activeLoads < 3 && loadQueue.length) {
        const index = loadQueue.shift();
        if (index < 0 || index >= FRAME_COUNT || bitmaps.has(index) || pending.has(index)) continue;

        const controller = new AbortController();
        pending.add(index);
        controllers.set(index, controller);
        activeLoads += 1;
        (async () => {
          try {
            const response = await fetch(frameUrl(index, frameDirectory), { signal: controller.signal });
            if (!response.ok) throw new Error('Frame ' + (index + 1) + ' could not be loaded');
            const bitmap = await createImageBitmap(await response.blob());
            if (cancelled || Math.abs(index - currentFrame) > cacheRadius) {
              bitmap.close();
              return;
            }
            bitmaps.set(index, bitmap);
            if (index === currentFrame) setReady(true);
            for (const [cachedIndex, cachedBitmap] of bitmaps) {
              if (Math.abs(cachedIndex - currentFrame) > cacheRadius) {
                cachedBitmap.close();
                bitmaps.delete(cachedIndex);
              }
            }
            queuePaint();
          } catch {
            // Keep the nearest available frame visible while this one loads.
          } finally {
            pending.delete(index);
            controllers.delete(index);
            activeLoads -= 1;
            pumpLoads();
          }
        })();
      }
    };

    const requestWindow = (target, direction) => {
      // Fast scrolls can make the in-flight frames obsolete. Cancel those
      // downloads immediately so the current frame is not stuck behind them.
      for (const [frame, controller] of controllers) {
        if (Math.abs(frame - target) > cacheRadius) controller.abort();
      }
      const prioritizedFrames = [target];
      for (let offset = 1; offset <= cacheRadius; offset += 1) prioritizedFrames.push(target + (direction * offset));
      for (let offset = 1; offset <= Math.min(2, cacheRadius); offset += 1) prioritizedFrames.push(target - (direction * offset));
      loadQueue.splice(0, loadQueue.length, ...prioritizedFrames.filter((frame) => (
        frame >= 0 && frame < FRAME_COUNT && !bitmaps.has(frame) && !pending.has(frame)
      )));
      for (const [frame, bitmap] of bitmaps) {
        if (Math.abs(frame - target) > cacheRadius) {
          bitmap.close();
          bitmaps.delete(frame);
        }
      }
      pumpLoads();
      queuePaint();
    };

    const onResize = () => {
      queuePaint();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      currentFrame = FRAME_COUNT - 1;
      heroStageRef.current?.style.setProperty('--handoff-darkness', '1');
      requestWindow(currentFrame, -1);
    } else {
      trigger = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.12,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          currentFrame = Math.min(FRAME_COUNT - 1, Math.round(self.progress * (FRAME_COUNT - 1)));
          if (self.direction) scrollDirection = self.direction;
          const handoff = Math.max(0, Math.min(1, (currentFrame - 59) / (FRAME_COUNT - 1 - 59)));
          heroStageRef.current?.style.setProperty('--handoff-darkness', handoff.toFixed(3));
          requestWindow(currentFrame, scrollDirection);
        },
      });
      heroStageRef.current?.style.setProperty('--handoff-darkness', '0');
      requestWindow(0, 1);
    }

    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      trigger?.kill();
      for (const controller of controllers.values()) controller.abort();
      for (const bitmap of bitmaps.values()) bitmap.close();
      bitmaps.clear();
    };
  }, []);

  return (
    <main className="portfolio" ref={portfolioRef}>
      <section className="hero-scroll" ref={heroRef} aria-label="Scroll-driven portrait introduction">
        <div className="hero-stage" ref={heroStageRef}>
          <img className={'hero-stage__poster' + (ready ? ' hero-stage__poster--loaded' : '')} src="/frames/ezgif-frame-001.jpg" alt="" aria-hidden="true" fetchPriority="high" decoding="async" />
          <canvas className="hero-stage__canvas" ref={canvasRef} aria-hidden="true" />
          <div className="hero-stage__shade" aria-hidden="true" />
          <div className="hero-stage__handoff" aria-hidden="true" />
          <header className="hero-topbar">
            <a className="brand-mark" href="#top" aria-label="Muhammed Jassim, known as Jazz, home">JAZZ<span>.</span></a>
            <span className="hero-topbar__center">MUHAMMED JASSIM</span>
            <a className="hero-topbar__right" href="#work">SCROLL TO EXPLORE <span>↘</span></a>
          </header>
          <div className="hero-copy" id="top">
            <p className="eyebrow eyebrow--light"><span>STUDENT</span><i /><span>VIBE CODER</span><i /><span>VIDEO CREATOR</span><i /><span>MOBILE PHOTOGRAPHER</span></p>
            <h1><span className="hero-copy__line hero-copy__line--accent">Ideas into</span><span className="hero-copy__line">real things.</span></h1>
            <p className="hero-copy__note">I’m Muhammed Jassim—Jazz to most. I build with code, make videos, and capture everyday scenes on my phone.</p>
          </div>
          {!ready && <div className="hero-loading" aria-live="polite">LOADING THE PORTRAIT</div>}
        </div>
      </section>

      <section className="presence section-dark" id="work">
        <div className="presence__intro" ref={presenceIntroRef}>
          <h2><span className="presence__title-line">I learn by making.</span><span className="presence__title-line">I make ideas real.</span></h2>
          <p className="presence__summary">I’m a student and creator, exploring code, video, and mobile photography. Each project starts with curiosity and gets better with every version.</p>
        </div>
        <div className="identity-grid" aria-label="Creative practice">
          <article className="identity-card identity-card--orange">
            <span className="identity-card__index">01 / LEARN</span>
            <strong>STUDENT</strong>
            <span className="identity-card__caption">Learning in public. Growing with every project.</span>
          </article>
          <a className="identity-card identity-card--paper identity-card--link" href="/my-work" aria-label="Open my work">
            <span className="identity-card__index">02 / BUILD</span>
            <strong>VIBE<br />CODER</strong>
            <span className="identity-card__caption">Ideas move from prompt to prototype to polish.</span>
            <span className="identity-card__action" aria-hidden="true">↗</span>
          </a>
          <a className="identity-card identity-card--portrait identity-card--link" href="/videography" aria-label="Open videography">
            <span className="identity-card__index">03 / CREATE</span>
            <strong>VIDEO<br />CREATOR</strong>
            <span className="identity-card__caption">Short stories, shaped one cut at a time.</span>
            <span className="identity-card__action" aria-hidden="true">↗</span>
          </a>
          <a className="identity-card identity-card--photo identity-card--link" href="/photography" aria-label="Open photography">
            <span className="identity-card__index">04 / NOTICE</span>
            <strong>MOBILE<br />PHOTO<br />GRAPHER</strong>
            <span className="identity-card__caption">Everyday moments, framed on the phone in my pocket.</span>
            <span className="identity-card__action" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="philosophy section-dark" id="about">
        <div className="philosophy__copy">
          <h2>I build to<br />solve real<br /><span>problems.</span></h2>
          <p>I’m Muhammed Jassim, a third-year AI and Data Science engineering student at MES College of Engineering in Kuttippuram, Malappuram. I taught myself to code by solving problems—often by building apps for needs of my own.</p>
          <p>I build with React and Vite, using Codex, Claude, Gemini, GPT, and Cursor to develop ideas. Video editing, mobile photography, and poster design are the hobbies I keep coming back to, with CapCut, DaVinci Resolve, Lightroom, Canva, and Adobe Express in the mix.</p>
          <a className="round-link round-link--light philosophy__cta" href="#contact" aria-label="Have a problem? Let's solve it. Contact me.">HAVE A PROBLEM? LET’S SOLVE IT <span aria-hidden="true">↗</span></a>
        </div>
        <div className="philosophy__visual">
          <img src="/frames-4k/ezgif-frame-120.jpg" alt="Muhammed Jassim, known as Jazz, in a red and teal portrait study" loading="lazy" />
          <span>LEARNING / MAKING / REPEATING</span>
        </div>
      </section>

      <section className="mobile-photo section-dark" id="photography">
        <div className="mobile-photo__intro">
          <h2>Moments,<br /><span>as they feel.</span></h2>
          <p>I shoot portraits, nature, animals, and everyday scenes on my Pixel 8 Pro, looking for the feeling inside the frame—not just the view.</p>
          <a className="video-feature__link mobile-photo__link" href="/photography">EXPLORE PHOTOGRAPHY <span>↗</span></a>
        </div>
        <div className="mobile-photo__gallery" aria-label="Mobile photography gallery">
          <div className="mobile-photo__tile mobile-photo__tile--light"><img src="/photos/foggy-trail.jpeg" alt="A foggy trail crossing a green hillside." loading="lazy" /><span>FOG ON THE TRAIL / 01</span></div>
          <div className="mobile-photo__tile mobile-photo__tile--shape"><img src="/photos/dome-at-dusk.jpeg" alt="Ornate domes silhouetted against a sunset sky." loading="lazy" /><span>DOME AT DUSK / 02</span></div>
          <div className="mobile-photo__tile mobile-photo__tile--night"><img src="/photos/coast-at-sunset.jpeg" alt="A boat at sea beneath a vivid orange sun." loading="lazy" /><span>LAST LIGHT / COAST / 03</span></div>
        </div>
      </section>
      <section className="video-feature section-dark" id="video-work">
        <div className="video-feature__intro">
          <h2>Let the scene<br /><span>breathe.</span></h2>
          <p>Slow-paced cinematic videos, shaped around light, movement, and the feeling of a moment.</p>
          <a className="video-feature__link" href="/videography">EXPLORE VIDEOGRAPHY <span>↗</span></a>
        </div>
        <div className="video-feature__visual" role="group" aria-label="Featured film: Nethravathi Trek">
          {featuredFilmPlaying ? (
            <div className="video-feature__embed">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${featuredFilm.youtubeId}?autoplay=1&rel=0`}
                title={featuredFilm.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <button className="video-feature__close" type="button" onClick={() => setFeaturedFilmPlaying(false)} aria-label="Close featured video">×</button>
            </div>
          ) : <>
            <img
              src={`https://img.youtube.com/vi/${featuredFilm.youtubeId}/maxresdefault.jpg`}
              alt="Preview thumbnail for Nethravathi Trek."
              loading="lazy"
              onError={(event) => {
                if (!event.currentTarget.dataset.fallback) {
                  event.currentTarget.dataset.fallback = 'true';
                  event.currentTarget.src = `https://img.youtube.com/vi/${featuredFilm.youtubeId}/hqdefault.jpg`;
                }
              }}
            />
            <span className="video-feature__index">FEATURED FILM / NETHRAVATHI TREK</span>
            <strong>{featuredFilm.title}</strong>
            <button className="video-feature__play" type="button" onClick={() => setFeaturedFilmPlaying(true)} aria-label={`Play ${featuredFilm.title}`}>
              <span aria-hidden="true">▶</span>
            </button>
          </>}
        </div>
      </section>
      <section className="projects" id="projects">
        <div className="projects__head">
          <div>
            <h2>Things I’ve<br /><span>built.</span></h2>
          </div>
          <p className="projects__intro">Products, college work, and personal builds—each one starting with a problem worth solving.</p>
        </div>
        <div className="project-grid">
          {portfolioProjects.filter((project) => project.featured).map((project, index) => (
            <article className="project-card" key={project.slug}>
              <div className={'project-art project-art--portfolio project-art--' + project.slug}>
                <div className="project-art__head"><span className="project-art__number">0{index + 1}</span><span className="project-art__kicker">{project.category}</span></div>
                {project.logo ? <div className={'project-art__brand-stage project-art__brand-stage--' + project.slug}><img className={'project-art__logo project-art__logo--' + project.slug} src={project.logo} alt={project.name + ' logo'} loading="lazy" /></div> : <strong>{project.mark}</strong>}
                <span className="project-art__status">{project.status}</span>
              </div>
              <div className="project-meta"><span>{project.role}</span><span>{project.stack}</span></div>
              <h3>{project.name} <a href="/my-work" aria-label={'View ' + project.name + ' on My Work'}>↗</a></h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
        <div className="projects__bottom"><a className="text-link" href="/my-work">VIEW ALL PROJECTS <span>↗</span></a></div>
      </section>

      <section className="services section-dark" id="services">
        <div className="services__head">
          <h2>Good ideas<br /><span>made real.</span></h2>
          <p>I like working from a real need or a small spark of an idea—and shaping it into something people can use, watch, or keep.</p>
        </div>
        <div className="services__grid">
          <a className="service-card" href="/my-work">
            <span className="service-card__index">01 / DIGITAL</span>
            <h3>Websites &amp; apps</h3>
            <p>Useful websites, prototypes, and small apps built around real problems.</p>
            <span className="service-card__link">EXPLORE MY WORK <b>↗</b></span>
          </a>
          <a className="service-card" href="/videography">
            <span className="service-card__index">02 / MOTION</span>
            <h3>Cinematic video</h3>
            <p>Slow-paced scenes, shot on phone and edited with care.</p>
            <span className="service-card__link">WATCH THE VIDEO PAGE <b>↗</b></span>
          </a>
          <a className="service-card" href="/photography">
            <span className="service-card__index">03 / STILL</span>
            <h3>Mobile photography</h3>
            <p>Portraits, nature, and everyday moments captured on my Pixel 8 Pro.</p>
            <span className="service-card__link">VIEW PHOTOGRAPHY <b>↗</b></span>
          </a>
          <a className="service-card" href="#contact">
            <span className="service-card__index">04 / PERSONAL</span>
            <h3>Posters &amp; wish sites</h3>
            <p>Visual designs and small celebration websites for moments worth sharing.</p>
            <span className="service-card__link">TELL ME YOUR IDEA <b>↗</b></span>
          </a>
        </div>
      </section>

      <section className="contact section-dark" id="contact">
        <div className="contact__layout">
          <div className="contact__intro">
            <h2>Let’s<br /><span>talk.</span></h2>
            <p>Have a project, a creative idea, or a problem you want to solve? Tell me a little about it and let’s figure out a first step.</p>
            <a className="contact__email" href="mailto:jas.ans.knpy@gmail.com">jas.ans.knpy@gmail.com <span>↗</span></a>
            <nav className="contact__socials" aria-label="Find me online">
              <a href="https://github.com/Jassim-007" target="_blank" rel="noreferrer">GITHUB <span>↗</span></a>
              <a href="https://www.linkedin.com/in/muhammed-jassim-b9458732b/" target="_blank" rel="noreferrer">LINKEDIN <span>↗</span></a>
              <a href="https://www.instagram.com/____j_a_z_z_____/" target="_blank" rel="noreferrer">INSTAGRAM <span>↗</span></a>
            </nav>
          </div>
          <form className="contact-form" action="https://docs.google.com/forms/d/e/1FAIpQLSej0BZhsEHE1E7jBVEd0Dxd5kf6d_QGlEn3SC6w_3l7ajs09Q/formResponse" method="POST" target="google-form-response" onSubmit={() => {
            setContactSubmitted(true);
            setContactStatus('SENDING YOUR MESSAGE…');
          }}>
            <h3>Send message</h3>
            <div className="contact-form__row">
              <label>Name<input type="text" name="entry.317437178" placeholder="Your name" autoComplete="name" required /></label>
              <label>Email<input type="email" name="entry.1750913110" placeholder="you@example.com" autoComplete="email" required /></label>
            </div>
            <label>Message<textarea name="entry.628530136" rows="5" placeholder="Tell me what you have in mind…" required /></label>
            <input type="hidden" name="fvv" value="1" />
            <button type="submit">SEND MESSAGE <span>↗</span></button>
            <p className="contact-form__note" aria-live="polite">{contactStatus || 'YOUR MESSAGE GOES STRAIGHT TO MY GOOGLE FORM'}</p>
            <iframe title="Google Forms submission" name="google-form-response" className="contact-form__response" onLoad={() => {
              if (contactSubmitted) setContactStatus('MESSAGE SENT — THANK YOU.');
            }} />
          </form>
        </div>
        <div className="contact__foot"><span>MUHAMMED JASSIM · STUDENT · CREATOR · PHOTOGRAPHER</span><a href="#top">BACK TO TOP ↑</a><span>© 2026</span></div>
      </section>
    </main>
  );
}

const collection = collectionPages[window.location.pathname.replace(/\/$/, '')];
createRoot(document.getElementById('root')).render(collection ? <CollectionPage page={collection} /> : <App />);









