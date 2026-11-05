import { readFile, writeFile } from 'node:fs/promises';

const site = 'https://www.muhammedjassim.me';
const previewDeployment = process.env.VERCEL_ENV === 'preview';
const fullName = 'Muhammed Jassim';
const shortName = 'Jazz';
const personDescription = 'AI and Data Science engineering student at MES College of Engineering in Kuttippuram, Malappuram. I build practical apps and create cinematic videos and mobile photography.';
const socialLinks = [
  'https://github.com/Jassim-007',
  'https://www.linkedin.com/in/muhammed-jassim-b9458732b/',
  'https://www.instagram.com/____j_a_z_z_____/',
];

const projects = [
  ['TENCO CAFE POS', 'A point-of-sale platform for cafes, developed with the technical team at Tenco.'],
  ['KAIRO', 'A fitness-tracking app I started building for my own training and progress.'],
  ['ROADSAFE INDIA', 'A map project focused on accident hotspots in major Indian cities, with plans to grow into a more interactive experience.'],
  ['PRANA', 'An animal disease outbreak detector app created with a hackathon team, with plans to explore its next stage.'],
  ['AYCO CRUSTO', 'A QR-based cafe menu for AYCO CRUSTO, designed to update live.'],
  ['WISH WEBSITES', 'Custom little websites for birthdays, weddings, and other moments worth celebrating.'],
];

const h = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const list = (items) => items.map(([title, description]) => `<li><h2>${h(title)}</h2><p>${h(description)}</p></li>`).join('');
const socialJson = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${site}/#person`,
      name: fullName,
      alternateName: ['Jazz', 'Jassim'],
      url: site,
      jobTitle: 'AI and Data Science Engineering Student, Developer and Creator',
      description: personDescription,
      image: `${site}/og-jazz-portfolio.png`,
      affiliation: { '@type': 'CollegeOrUniversity', name: 'MES College of Engineering' },
      address: { '@type': 'PostalAddress', addressLocality: 'Kuttippuram', addressRegion: 'Malappuram, Kerala', addressCountry: 'IN' },
      knowsAbout: ['Artificial intelligence', 'Data science', 'React', 'Vite', 'Web application development', 'Mobile photography', 'Video editing'],
      sameAs: socialLinks,
    },
    { '@type': 'WebSite', '@id': `${site}/#website`, url: site, image: `${site}/og-jazz-portfolio.png`, name: `${fullName} — ${shortName}`, inLanguage: 'en-IN', publisher: { '@id': `${site}/#person` } },
  ],
}).replaceAll('<', '\\u003c');

const navigation = `<nav class="seo-fallback__nav" aria-label="Main navigation"><a href="/my-work">MY WORK</a><a href="/videography">VIDEO</a><a href="/photography">PHOTO</a><a href="/#services">SERVICES</a><a href="/#about">ABOUT</a><a href="/#contact">CONTACT</a></nav>`;
const homeContent = `
  <div class="seo-fallback seo-fallback--home">
    <img class="seo-fallback__portrait" src="/frames/ezgif-frame-001.jpg" width="1280" height="720" alt="Portrait study of Muhammed Jassim, known as Jazz." fetchpriority="high" />
    <header class="seo-fallback__header"><a class="seo-fallback__brand" href="/">JAZZ<span>.</span></a>${navigation}</header>
    <main class="seo-fallback__main" id="main-content"><a class="seo-fallback__skip" href="#main-content">Skip to content</a>
      <section class="seo-fallback__hero" aria-labelledby="home-title"><p>STUDENT · VIBE CODER · VIDEO CREATOR · MOBILE PHOTOGRAPHER</p><h1 id="home-title">IDEAS INTO<br />REAL THINGS.</h1><p>I’m ${fullName}—${shortName} to most. I build with code, make videos, and capture everyday scenes on my phone.</p><div class="seo-fallback__actions"><a href="/my-work">EXPLORE MY WORK ↗</a><a href="/#contact">GET IN TOUCH ↗</a></div></section>
      <section class="seo-fallback__projects" aria-labelledby="projects-title"><p>SELECTED PROJECTS</p><h2 id="projects-title">I build to solve real problems.</h2><ul>${list(projects)}</ul></section>
      <section class="seo-fallback__about"><h2>About ${fullName}</h2><p>${personDescription} I learn by making, solve problems with software, and tell stories through video and photography.</p><p>My projects include a cafe point-of-sale platform, a personal fitness tracker, an interactive road-safety map, an animal-health prototype, and a live cafe menu.</p></section>
      <footer class="seo-fallback__footer"><a href="/photography">Photography</a><a href="/videography">Videography</a><a href="/my-work">Projects</a><a href="mailto:jas.ans.knpy@gmail.com">Contact Muhammed Jassim</a></footer>
    </main>
  </div>`;

const routePages = {
  '/my-work': {
    title: 'Projects | Muhammed Jassim (Jazz)',
    description: 'Selected projects by Muhammed Jassim (Jazz), an AI and Data Science student building practical apps, tools, and web experiences.',
    heading: 'BUILT TO SOLVE REAL NEEDS.',
    content: `<p>A growing collection of products, college work, and small web experiences—built with a problem in mind.</p><ul class="seo-fallback__work-list">${list(projects)}</ul>`,
  },
  '/photography': {
    title: 'Mobile Photography | Muhammed Jassim (Jazz)',
    description: 'Mobile photography by Muhammed Jassim (Jazz), capturing portraits, nature, people, and passing moments on a Pixel 8 Pro.',
    heading: 'LIGHT, FOUND IN PASSING.',
    content: `<p>Everyday details, color, and places captured on the phone I carry. I use a Pixel 8 Pro to photograph emotion, people, nature, animals, and the moments in between.</p><div class="seo-fallback__photo-list"><figure><img src="/photos/coast-at-sunset.jpeg" width="1495" height="1495" loading="lazy" alt="A fishing boat and rocky shoreline silhouetted against a glowing orange sunset." /><figcaption>LAST LIGHT / COAST</figcaption></figure><figure><img src="/photos/dome-at-dusk.jpeg" width="1530" height="1530" loading="lazy" alt="Ornate domes framed against a soft peach sunset sky." /><figcaption>DOME AT DUSK</figcaption></figure><figure><img src="/photos/foggy-trail.jpeg" width="1204" height="1600" loading="lazy" alt="A narrow trail crossing a green hillside disappearing into fog." /><figcaption>FOG ON THE TRAIL</figcaption></figure></div>`,
  },
  '/videography': {
    title: 'Cinematic Video | Muhammed Jassim (Jazz)',
    description: 'Slow-paced cinematic films shot and edited by Muhammed Jassim (Jazz), using phone cameras and DaVinci Resolve or CapCut.',
    heading: 'LET THE SCENE BREATHE.',
    content: `<p>I shoot and edit slow-paced cinematic videos, mostly on my phone. I look for light, movement, and the small details that let a scene breathe.</p><p>Selected films include phone-shot cinematic studies and personal video work, edited with DaVinci Resolve and CapCut.</p><a class="seo-fallback__cta" href="mailto:jas.ans.knpy@gmail.com">ASK ABOUT A VIDEO PROJECT ↗</a>`,
  },
};

const readTemplate = await readFile('dist/index.html', 'utf8');
const replaceMeta = (html, selector, tag) => {
  const pattern = new RegExp(`<meta ${selector}[^>]*>`, 'i');
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
};

function makePage({ path, title, description, content, noindex = false }) {
  const url = `${site}${path === '/' ? '/' : path}`;
  let html = readTemplate.replace(/<title>[^<]*<\/title>/i, `<title>${h(title)}</title>`);
  html = replaceMeta(html, 'name="description"', `<meta name="description" content="${h(description)}" />`);
  html = replaceMeta(html, 'name="robots"', `<meta name="robots" content="${noindex || previewDeployment ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`);
  html = replaceMeta(html, 'property="og:title"', `<meta property="og:title" content="${h(title)}" />`);
  html = replaceMeta(html, 'property="og:description"', `<meta property="og:description" content="${h(description)}" />`);
  html = replaceMeta(html, 'property="og:url"', `<meta property="og:url" content="${h(url)}" />`);
  if (!/<meta property="og:url"/i.test(html)) html = html.replace('</head>', `    <meta property="og:url" content="${h(url)}" />\n  </head>`);
  html = replaceMeta(html, 'name="twitter:title"', `<meta name="twitter:title" content="${h(title)}" />`);
  html = replaceMeta(html, 'name="twitter:description"', `<meta name="twitter:description" content="${h(description)}" />`);
  html = replaceMeta(html, 'property="og:image"', `<meta property="og:image" content="${site}/og-jazz-portfolio.png" />`);
  html = replaceMeta(html, 'name="twitter:image"', `<meta name="twitter:image" content="${site}/og-jazz-portfolio.png" />`);
  html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${h(url)}" />`);
  html = html.replace('</head>', `    <script type="application/ld+json">${socialJson}</script>\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  return html;
}

const homeDescription = 'Muhammed Jassim (Jazz) is an AI and Data Science student, developer, and creator from Kerala, India, building practical apps and creative work.';
const homeTitle = 'Muhammed Jassim (Jazz) — AI & Data Science Student, Developer & Creator | Kerala';
const generatedPages = [{ path: '/', title: homeTitle, description: homeDescription, content: homeContent }];
for (const [path, page] of Object.entries(routePages)) {
  const content = `<div class="seo-fallback seo-fallback--collection"><a class="seo-fallback__skip" href="#main-content">Skip to content</a><header class="seo-fallback__collection-header"><a class="seo-fallback__brand" href="/">JAZZ<span>.</span></a>${navigation}</header><main class="seo-fallback__collection-main" id="main-content"><p class="seo-fallback__eyebrow">MUHAMMED JASSIM / JAZZ</p><h1>${h(page.heading)}</h1>${page.content}<nav class="seo-fallback__related" aria-label="More portfolio sections"><a href="/my-work">MY WORK</a><a href="/videography">VIDEO</a><a href="/photography">PHOTO</a></nav></main></div>`;
  generatedPages.push({ path, title: page.title, description: page.description, content });
  await writeFile(`dist${path}.html`, makePage({ path, title: page.title, description: page.description, content }));
}
await writeFile('dist/index.html', makePage({ ...generatedPages[0], noindex: previewDeployment }));

const notFoundContent = `<main class="seo-fallback__not-found"><a class="seo-fallback__brand" href="/">JAZZ<span>.</span></a><p>404 / PAGE NOT FOUND</p><h1>This page doesn’t exist.</h1><p>Find your way back to my work, videos, or photography.</p><nav aria-label="Portfolio sections"><a href="/">HOME</a><a href="/my-work">MY WORK</a><a href="/videography">VIDEO</a><a href="/photography">PHOTO</a></nav></main>`;
const notFound = makePage({ path: '/404', title: 'Page not found | Muhammed Jassim (Jazz)', description: 'The page you requested could not be found.', content: notFoundContent, noindex: true }).replace(/\s*<script type="module"[^>]*><\/script>/gi, '');
await writeFile('dist/404.html', notFound);

const today = new Date().toISOString().slice(0, 10);
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${generatedPages.map(({ path }) => `  <url><loc>${site}${path === '/' ? '/' : path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt', previewDeployment
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\nDisallow: /404.html\nSitemap: ${site}/sitemap.xml\n`);
