import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { regions, regionBySlug } from '../data/regions.mjs';
import { articles, articleBySlug } from '../data/articles.mjs';
import { site } from '../data/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'site');
const assets = path.join(root, 'assets');
const updatedDate = '2026-09-02';

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const slugify = (value) => value.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const mkdir = (dir) => fs.mkdirSync(dir, { recursive: true });
const write = (relative, content) => {
  const target = path.join(out, relative);
  mkdir(path.dirname(target));
  fs.writeFileSync(target, content.trimStart() + '\n');
};
const readAsset = (name) => `/assets/${name}`;

const logo = `
  <a class="brand" href="/" aria-label="GoWeddingPlanner, inicio">
    <span class="brand-mark" aria-hidden="true">GW</span>
    <span class="brand-wordmark">GoWedding<span>Wedding Planner</span></span>
  </a>`;

const navigation = (current = '') => site.nav.map((item) => `
  <a href="${item.href}"${current === item.href ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`).join('');

const footer = () => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        ${logo}
        <p class="footer-intro">${esc(site.tagline)}<br>Diseñamos celebraciones honestas y ponemos orden a todo lo que no se ve.</p>
      </div>
      <div class="footer-col">
        <strong>Explora</strong>
        ${navigation()}
        <a href="/recursos/">Recursos gratuitos</a>
      </div>
      <div class="footer-col">
        <strong>Regiones</strong>
        ${regions.map((region) => `<a href="/${region.slug}/">${esc(region.name)}</a>`).join('')}
      </div>
      <div class="footer-col">
        <strong>Hablemos</strong>
        <a href="mailto:${site.email}">${site.email}</a>
        <a href="/contacto/">Solicitar presupuesto</a>
        <a href="/sobre-nosotros/">Conoce al equipo</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${esc(site.legalName)} · Madrid, España</span>
      <span><a href="/aviso-legal/">Aviso legal</a> · <a href="/politica-privacidad/">Privacidad</a> · <a href="/politica-cookies/">Cookies</a></span>
    </div>
  </div>
</footer>`;

const modal = () => `
<div class="modal" data-success-modal aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal-card">
    <button class="close" type="button" data-modal-close aria-label="Cerrar">×</button>
    <div class="kicker">Solicitud recibida</div>
    <h3 id="modal-title">Gracias por confiar en nosotros.</h3>
    <p>Hemos recibido vuestra información. Revisaremos los detalles y nos pondremos en contacto lo antes posible.</p>
    <button class="btn btn-primary" type="button" data-modal-close>Volver a la página</button>
  </div>
</div>`;

const layout = ({ title, description, path: currentPath = '/', body, current = '', schema = [], image = '/assets/pareja-vinedo.webp', noindex = false }) => {
  const canonical = `${site.url}${currentPath === '/' ? '/' : currentPath}`;
  const graph = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: site.legalName, url: site.url, email: site.email, logo: `${site.url}/assets/brand-mark.svg`, sameAs: [] },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, inLanguage: 'es-ES' },
    ...schema
  ];
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#2d2526">
  ${noindex ? '<meta name="robots" content="noindex,nofollow">' : ''}
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:site_name" content="GoWeddingPlanner">
  <meta property="og:locale" content="es_ES">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(`${site.url}${image}`)}">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${json(graph)}</script>
  <link rel="icon" href="/assets/brand-mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>
  <div class="announcement">Planificar con calma también es una forma de celebrar <a href="/contacto/">Empezad por aquí ↗</a></div>
  <header class="site-header">
    <div class="container navbar">
      ${logo}
      <nav id="main-navigation" class="nav-links" data-nav-links aria-label="Navegación principal">${navigation(current)}</nav>
      <div class="nav-cta"><a class="btn btn-primary" href="/contacto/" data-track="header_cta">Hablar con el equipo</a></div>
      <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="main-navigation" aria-label="Abrir menú"><span></span><span></span><span></span></button>
    </div>
  </header>
  <main id="main">${body}</main>
  ${footer()}
  <button class="back-top" type="button" data-back-top aria-label="Volver arriba">↑</button>
  ${modal()}
  <script>window.GOWEDDING_FORM_ENDPOINTS = ${json(site.formEndpoints)};</script>
  <script src="/site.js" defer></script>
</body>
</html>`;
};

const breadcrumbs = (items) => `<nav class="breadcrumbs" aria-label="Migas de pan">${items.map((item, index) => index === items.length - 1 ? `<span aria-current="page">${esc(item.label)}</span>` : `<a href="${item.href}">${esc(item.label)}</a><span aria-hidden="true">/</span>`).join('')}</nav>`;

const ctaStrip = (label = '¿Hablamos de vuestra boda?') => `
<section class="section-sm section-sage">
  <div class="container section-heading">
    <div><div class="kicker">Primer paso</div><h2>${esc(label)}</h2><p>Una conversación breve para entender qué necesitáis y ver si somos el equipo adecuado para acompañaros.</p></div>
    <a class="btn btn-primary" href="/contacto/" data-track="inline_cta">Solicitar una conversación</a>
  </div>
</section>`;

const leadForm = ({ region = 'madrid', selectedRegion = region, heading = 'Contadnos vuestra idea', intro = 'Cinco minutos para entender qué queréis celebrar y dónde necesitáis ayuda.' } = {}) => `
<div class="form-shell">
  <div class="kicker">Sin compromiso</div>
  <h3>${esc(heading)}</h3>
  <p>${esc(intro)}</p>
  <form data-lead-form action="${esc(site.formEndpoints[region === 'cataluna' ? 'cataluna' : 'madrid'])}" method="post" target="lead-frame">
    <div class="form-grid">
      <div class="field"><label for="lead-name-${region}">Nombre y apellidos</label><input id="lead-name-${region}" name="entry.2072351570" type="text" autocomplete="name" required placeholder="Vuestros nombres"></div>
      <div class="field"><label for="lead-email-${region}">Email</label><input id="lead-email-${region}" name="entry.934898924" type="email" autocomplete="email" required placeholder="hola@ejemplo.com"></div>
      <div class="field"><label for="lead-phone-${region}">Teléfono</label><input id="lead-phone-${region}" name="entry.1240241884" type="tel" autocomplete="tel" required placeholder="+34 600 000 000"></div>
      <div class="field"><label for="lead-date-${region}">Fecha aproximada</label><input id="lead-date-${region}" name="entry.1103406153" type="text" placeholder="Mes y año"></div>
      <div class="field"><label for="lead-region-${region}">Región de la boda</label><select id="lead-region-${region}" data-region-select required><option value="" ${!selectedRegion ? 'selected' : ''} disabled>Elegid una región</option>${regions.map((item) => `<option value="${item.slug}" data-form="${item.form}" ${item.slug === selectedRegion ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select></div>
      <div class="field"><label for="lead-place-${region}">Ciudad o lugar</label><input id="lead-place-${region}" data-place name="entry.1895093121" type="text" placeholder="Ciudad, finca o espacio"></div>
      <div class="field field-full"><label for="lead-story-${region}">Vuestra idea</label><textarea id="lead-story-${region}" name="entry.1310552457" required placeholder="Número de invitados, estilo, lugar o cualquier cosa que queráis contarnos…"></textarea></div>
    </div>
    <label class="check"><input type="checkbox" required><span>Acepto el <a href="/aviso-legal/">aviso legal</a> y la <a href="/politica-privacidad/">política de privacidad</a>. Entiendo que mis datos podrán compartirse con proveedores relevantes para preparar una propuesta.</span></label>
    <button class="btn btn-primary" type="submit">Enviar solicitud <span aria-hidden="true">↗</span></button>
    <p class="form-status" data-form-status aria-live="polite"></p>
    <p class="form-note">Usamos vuestra información solo para responder a esta solicitud. Si necesitáis otra vía, escribid a <a href="mailto:${site.email}">${site.email}</a>.</p>
  </form>
  <iframe class="hidden-frame" name="lead-frame" title="Envío de formulario" aria-hidden="true"></iframe>
</div>`;

const leadSection = ({ region = 'madrid', selectedRegion = region, title = 'Vuestra boda empieza con una conversación.' } = {}) => `
<section class="lead-section" id="solicitar-presupuesto">
  <div class="container lead-grid">
    <div class="lead-copy">
      <div class="kicker">El primer paso</div>
      <h2>${esc(title)}</h2>
      <p>Da igual si estáis en la primera idea o si ya tenéis fecha y espacio. Nos contáis dónde estáis y os ayudamos a ver el siguiente paso.</p>
      <ul class="lead-points"><li>Primera conversación sin compromiso</li><li>Respuestas claras, sin paquetes cerrados</li><li>Un plan adaptado a vuestra forma de celebrar</li></ul>
    </div>
    ${leadForm({ region, selectedRegion })}
  </div>
</section>`;

const home = () => {
  const cards = regions.map((region, index) => `<a class="region-card${index === 0 ? ' featured' : ''}" style="--region-accent:${region.accent};--region-tint:${region.tint}" href="/${region.slug}/"><span class="region-index">0${index + 1} · ${esc(region.shortName)}</span><h3>${esc(region.highlight.split(',')[0])}</h3><p>${esc(region.cities.slice(0, 3).join(' · '))}</p><span class="card-link" aria-hidden="true">↗</span></a>`).join('');
  return `
<section class="hero-home">
  <div class="container hero-grid">
    <div class="hero-copy">
      <div class="eyebrow">WEDDING PLANNER · ESPAÑA</div>
      <h1 class="display">La boda que imagináis.<br><em>El equipo que la hace posible.</em></h1>
      <p class="lede">Diseño, planificación y coordinación para celebrar con intención. Encontramos el lugar, ordenamos las decisiones y cuidamos lo que sucede cuando nadie está mirando.</p>
      <div class="hero-actions"><a class="btn btn-primary" href="#solicitar-presupuesto" data-track="hero_cta">Cuéntanos vuestra boda <span aria-hidden="true">↗</span></a><a class="btn btn-outline" href="/como-funciona/">Ver cómo trabajamos</a></div>
      <div class="microproof"><span class="microproof-mark">✦</span><span>Un acompañamiento sereno, de la primera idea al último baile.</span></div>
    </div>
    <div class="hero-visual"><img src="${readAsset('pareja-vinedo.webp')}" alt="Pareja celebrando su boda entre viñedos" width="1376" height="768"><div class="hero-visual-note"><strong>Vuestra historia, bien contada.</strong><span>Una boda no es una plantilla. Es la suma de las decisiones que sí os representan.</span></div></div>
  </div>
</section>
<section class="hero-strip"><div class="container strip-grid"><div class="strip-item"><strong>01</strong><span>Escuchar antes de proponer</span></div><div class="strip-item"><strong>02</strong><span>Diseñar con sentido</span></div><div class="strip-item"><strong>03</strong><span>Coordinar sin ruido</span></div><div class="strip-item"><strong>04</strong><span>Celebrar de verdad</span></div></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><div class="kicker">Una red que crece con vosotras</div><h2>Una mirada nacional,<br>un criterio local.</h2><p>Trabajamos por regiones para conocer los espacios, ritmos y equipos que hacen que cada territorio tenga su propia manera de celebrar.</p></div><a class="btn btn-text" href="/regiones/">Ver todas las regiones ↗</a></div><div class="region-grid">${cards}</div></div></section>
<section class="section section-paper"><div class="container"><div class="section-heading"><div><div class="kicker">Cómo os ayudamos</div><h2>Menos ruido.<br>Más intención.</h2><p>La planificación no va de llenar una lista. Va de tomar buenas decisiones en el orden correcto.</p></div></div><div class="card-grid"><article class="feature-card"><span class="number">01</span><h3>Encontrar lo que encaja</h3><p>Lugares y proveedores alineados con vuestro estilo, presupuesto y forma de vivir la celebración.</p></article><article class="feature-card"><span class="number">02</span><h3>Dar forma a la experiencia</h3><p>Un concepto visual y un recorrido de invitados que se sienten coherentes, cálidos y vuestros.</p></article><article class="feature-card"><span class="number">03</span><h3>Hacer que todo fluya</h3><p>Un plan de producción y un equipo que se ocupa de los detalles para que vosotros estéis presentes.</p></article></div></div></section>
<section class="section"><div class="container photo-split"><div class="photo-split-photo"><img src="${readAsset('finca.webp')}" alt="Espacio de celebración iluminado al atardecer" width="640" height="427" loading="lazy"></div><div class="photo-split-copy"><div class="kicker kicker-light">El valor está en lo que no se ve</div><h2>Una celebración bonita también puede ser fácil de vivir.</h2><p>Cuando cada decisión tiene un porqué, la boda deja de ser una sucesión de tareas y empieza a convertirse en una experiencia. Para vosotros y para quienes vienen a celebrarla.</p><ul class="bullet-list"><li>Presupuesto con prioridades, no con ruido.</li><li>Proveedores elegidos por encaje, no por inercia.</li><li>Un cronograma que protege los momentos importantes.</li></ul><a class="btn btn-light" href="/servicios/">Descubrir servicios</a></div></div></section>
<section class="section section-sage"><div class="container testimonial-grid"><figure class="quote-card"><blockquote>“Queremos que cuando miréis atrás no recordéis cuánto organizasteis, sino cuánto disfrutasteis.”</blockquote><figcaption>La forma GoWeddingPlanner de trabajar</figcaption></figure><div class="note-card"><span class="big-symbol">“</span><div><div class="kicker">Empezar sin presión</div><h3>La primera conversación es para escuchar.</h3><p>No hace falta tenerlo todo decidido. Solo saber que queréis una boda que se parezca a vosotros.</p><a class="btn btn-text" href="/contacto/">Hablemos ↗</a></div></div></div></section>
${leadSection({ region: 'madrid' })}`;
};

const pageHero = ({ kicker, title, description, current = [] }) => `<section class="page-hero"><div class="container">${breadcrumbs([{ label: 'Inicio', href: '/' }, ...current.map((label) => ({ label }))])}<div class="kicker">${esc(kicker)}</div><h1>${title}</h1><p class="lede">${esc(description)}</p></div></section>`;

const howItWorks = () => `${pageHero({ kicker: 'El proceso', title: 'Organizar bien también es una forma de disfrutar.', description: 'Un método claro para que cada decisión llegue a tiempo, tenga sentido y no se convierta en una carga.', current: ['Cómo funciona'] })}
<section class="section"><div class="container"><div class="process-grid"><article class="process-card"><span class="process-number">01</span><h3>Nos contáis vuestra idea</h3><p>Hablamos de la fecha, el lugar, el presupuesto y, sobre todo, de cómo queréis sentiros ese día. No hay respuestas correctas.</p></article><article class="process-card"><span class="process-number">02</span><h3>Construimos el mapa</h3><p>Ordenamos prioridades, proponemos espacios y proveedores, y convertimos una idea bonita en decisiones que se pueden ejecutar.</p></article><article class="process-card"><span class="process-number">03</span><h3>Lo hacemos realidad</h3><p>Coordinamos equipos, tiempos y detalles para que vosotros dejéis de gestionar y empecéis a vivir vuestra boda.</p></article></div></div></section>
<section class="section section-paper"><div class="container coverage-grid"><div><div class="kicker">Nuestro principio</div><h2>La claridad también es parte del diseño.</h2><p class="lede">Sabéis qué está pasando, por qué lo estamos proponiendo y cuál es el siguiente paso. Trabajamos con documentos sencillos, presupuestos vivos y una comunicación que no os obliga a perseguir respuestas.</p><ul class="bullet-list" style="color:var(--ink)"><li style="color:var(--ink)">Una persona de referencia y un calendario visible.</li><li style="color:var(--ink)">Propuestas comparables, con lo incluido y lo no incluido.</li><li style="color:var(--ink)">Un plan B pensado desde el principio.</li></ul></div><div class="coverage-art"><span class="kicker kicker-light">De la idea al último detalle</span><h3>Vosotros ponéis la historia. Nosotros, la estructura.</h3><p>La estructura no tiene que notarse. Solo tiene que hacer que todo lo demás respire.</p></div></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><div class="kicker">Tres formas de acompañaros</div><h2>Elegid la ayuda<br>que necesitáis.</h2></div></div><div class="card-grid"><article class="feature-card"><span class="number">A</span><h3>Integral</h3><p>Desde la primera decisión hasta el desmontaje. Para quienes quieren delegar con confianza.</p></article><article class="feature-card"><span class="number">B</span><h3>Parcial</h3><p>Nos incorporamos allí donde más lo necesitáis: espacio, proveedores, diseño o presupuesto.</p></article><article class="feature-card"><span class="number">C</span><h3>Coordinación día B</h3><p>Tomamos el relevo en los meses finales y coordinamos la boda para que vuestra familia no tenga que hacerlo.</p></article></div></div></section>
${ctaStrip('¿Queréis ordenar el siguiente paso?')}`;

const regionsPage = () => `${pageHero({ kicker: 'Dónde trabajamos', title: 'Una forma de celebrar para cada paisaje.', description: 'Ocho regiones, una misma manera de trabajar: escuchar bien, diseñar con criterio y coordinar con calma.', current: ['Regiones'] })}
<section class="section"><div class="container"><div class="region-grid">${regions.map((region, index) => `<a class="region-card${index === 0 ? ' featured' : ''}" style="--region-accent:${region.accent};--region-tint:${region.tint}" href="/${region.slug}/"><span class="region-index">0${index + 1}</span><h3>${esc(region.name)}</h3><p>${esc(region.description)}</p><span class="card-link" aria-hidden="true">↗</span></a>`).join('')}</div></div></section>
<section class="section section-paper"><div class="container narrow center"><div class="kicker">Más allá del mapa</div><h2>Si vuestro lugar no aparece, escribidnos.</h2><p class="lede" style="margin-left:auto;margin-right:auto">Trabajamos con una red que crece de forma cuidadosa. Si vuestra boda es en otra zona de España, contadnos el plan y veremos qué podemos construir.</p><a class="btn btn-primary" href="/contacto/">Consultar disponibilidad</a></div></section>`;

const services = () => `${pageHero({ kicker: 'Servicios', title: 'La ayuda que necesitáis, sin contratar lo que no.', description: 'Podemos estar desde el principio o entrar justo cuando el proyecto necesita claridad. El alcance se define alrededor de vuestra boda.', current: ['Servicios'] })}
<section class="section"><div class="container"><div class="card-grid"><article class="feature-card"><span class="number">01</span><h3>Planificación integral</h3><p>Concepto, presupuesto, lugar, proveedores, diseño, invitados y producción. Un único equipo para sostener todo el proyecto.</p><a class="arrow" href="#contacto" aria-label="Más información">↗</a></article><article class="feature-card"><span class="number">02</span><h3>Diseño y styling</h3><p>Una dirección visual que parte de vuestra historia y se convierte en materiales, flores, mesa, luz y recorrido.</p><a class="arrow" href="#contacto" aria-label="Más información">↗</a></article><article class="feature-card"><span class="number">03</span><h3>Coordinación día B</h3><p>Tomamos el mando de la producción y los tiempos para que nadie de vuestra familia tenga que hacerlo.</p><a class="arrow" href="#contacto" aria-label="Más información">↗</a></article></div></div></section>
<section class="section section-dark"><div class="container coverage-grid"><div><div class="kicker kicker-light">Lo que cuidamos</div><h2>El detalle solo importa cuando mejora la experiencia.</h2><p class="lede lede-light">No diseñamos para llenar espacios. Diseñamos para que el lugar, la mesa, la música y el tiempo cuenten la misma historia.</p></div><div><ul class="bullet-list"><li>Presupuesto y control de decisiones.</li><li>Búsqueda, comparación y negociación con proveedores.</li><li>Concepto creativo y dirección estética.</li><li>Planificación de invitados, alojamientos y transportes.</li><li>Producción, montaje y coordinación del día.</li><li>Desmontaje y cierre con proveedores.</li></ul></div></div></section>
${leadSection({ region: 'madrid', title: 'Vuestra boda no necesita más ruido. Necesita un buen plan.' })}`;

const about = () => `${pageHero({ kicker: 'El equipo', title: 'Javier & Andrea. Bodas con alma, no eventos en serie.', description: 'Somos el equipo detrás de GoWeddingPlanner: una mezcla de sensibilidad creativa y obsesión por la logística que hace que las cosas sucedan.', current: ['Sobre nosotros'] })}
<section class="section"><div class="container photo-split"><div class="photo-split-photo"><img src="${readAsset('equipo.webp')}" alt="Javier y Andrea, equipo de GoWeddingPlanner" width="640" height="435"></div><div class="photo-split-copy"><div class="kicker kicker-light">Una mirada compartida</div><h2>Lo bonito necesita una estructura que lo sostenga.</h2><p>Nuestra trayectoria mezcla diseño, arquitectura efímera y producción de eventos. En las bodas encontramos la posibilidad de unirlo todo con algo todavía más importante: una historia real y una pareja que quiere disfrutarla.</p><p>Trabajamos cerca, explicamos nuestras decisiones y cuidamos la relación con cada proveedor. Creemos que la excelencia no tiene que ser fría y que una boda bien producida puede sentirse espontánea.</p><a class="btn btn-light" href="/contacto/">Conocernos en una conversación</a></div></div></section>
<section class="section section-paper"><div class="container"><div class="section-heading"><div><div class="kicker">Nuestros principios</div><h2>Lo que no negociamos.</h2></div></div><div class="card-grid"><article class="feature-card"><span class="number">01</span><h3>Escuchar de verdad</h3><p>Vuestros gustos, límites y prioridades son el punto de partida. No trabajamos con una plantilla cerrada.</p></article><article class="feature-card"><span class="number">02</span><h3>Decirlo claro</h3><p>Presupuestos, plazos y alcance comprensibles. La confianza también se construye con información.</p></article><article class="feature-card"><span class="number">03</span><h3>Cuidar el conjunto</h3><p>Cada detalle tiene que sumar a la experiencia. Si no mejora la boda, probablemente no hace falta.</p></article></div></div></section>
${ctaStrip('¿Nos contáis vuestra historia?')}`;

const portfolio = () => `${pageHero({ kicker: 'Portfolio', title: 'Historias reales, lugares con carácter.', description: 'Una selección de atmósferas e ideas que nos inspiran. El objetivo no es copiar una boda, sino descubrir qué os mueve a vosotros.', current: ['Portfolio'] })}
<section class="section"><div class="container"><div class="article-grid"><article class="article-card"><div class="article-card-image"><img src="${readAsset('pareja-vinedo.webp')}" alt="Pareja celebrando entre viñedos" width="1376" height="768"></div><div class="article-card-body"><div class="article-meta"><span>Atmósfera</span><span>Campo</span></div><h3>La luz de la hora dorada</h3><p>Una celebración que deja que el paisaje haga parte del diseño: materiales cálidos, mesa larga y tiempo para conversar.</p></div></article><article class="article-card"><div class="article-card-image"><img src="${readAsset('finca.webp')}" alt="Finca iluminada para una celebración" width="640" height="427" loading="lazy"></div><div class="article-card-body"><div class="article-meta"><span>Espacio</span><span>Exterior</span></div><h3>Cuando el lugar ya tiene historia</h3><p>La producción acompaña la arquitectura y construye un recorrido cómodo desde la llegada hasta la fiesta.</p></div></article><article class="article-card"><div class="article-card-image"><img src="${readAsset('novia-espejo.webp')}" alt="Novia frente a un espejo de inspiración editorial" width="875" height="1552" loading="lazy"></div><div class="article-card-body"><div class="article-meta"><span>Estilo</span><span>Editorial</span></div><h3>Detalles que sí hablan de vosotros</h3><p>Una estética serena, bien editada y con espacio para que la emoción no quede escondida detrás de la decoración.</p></div></article></div></div></section>
<section class="section section-dark"><div class="container narrow center"><div class="kicker kicker-light">Sin fórmulas cerradas</div><h2>Vuestra boda no tiene que parecerse a ninguna otra.</h2><p class="lede lede-light" style="margin-left:auto;margin-right:auto">Las imágenes sirven para abrir conversaciones, no para imponer un resultado. Contadnos qué os inspira y construiremos desde ahí.</p><a class="btn btn-light" href="/contacto/">Empezar una conversación</a></div></section>`;

const contact = () => `${pageHero({ kicker: 'Contacto', title: 'Vuestra boda perfecta empieza con un hola.', description: 'Contadnos dónde estáis y qué necesitáis. Os responderemos con claridad, sin enviaros un catálogo de paquetes que no os representa.', current: ['Contacto'] })}
<section class="section"><div class="container lead-grid" style="max-width:1180px"><div class="lead-copy"><div class="kicker">Hablemos</div><h2>Una primera conversación, sin compromiso.</h2><p>No hace falta tener la fecha cerrada ni saber qué servicio queréis. Nos interesa conocer el contexto para proponeros el siguiente paso adecuado.</p><div class="rule"></div><p class="small"><strong>Email</strong><br><a href="mailto:${site.email}">${site.email}</a></p><p class="small"><strong>Disponibilidad</strong><br>Madrid · Cataluña · País Vasco · Castilla-La Mancha · Castilla y León · Andalucía · Comunidad Valenciana · Murcia</p></div>${leadForm({ region: 'madrid', heading: 'Cuéntanos vuestra boda', intro: 'Os responderemos con una primera orientación y, si encaja, agendaremos una llamada.' })}</div></section>
<section class="section section-paper"><div class="container narrow"><div class="kicker">Preguntas frecuentes</div><h2>Antes de escribirnos.</h2><details open><summary><strong>¿Cuándo es buen momento para contactar?</strong><span>＋</span></summary><p>Cuanto antes mejor si tenéis flexibilidad con fechas o buscáis un espacio concreto. Si la boda está cerca, también podemos ayudaros con la coordinación y las prioridades.</p></details><details><summary><strong>¿Trabajáis fuera de Madrid y Cataluña?</strong><span>＋</span></summary><p>Sí. Estamos desarrollando nuestra red por regiones y trabajamos con equipos locales para mantener una producción cuidada sin perder cercanía.</p></details><details><summary><strong>¿La primera conversación tiene coste?</strong><span>＋</span></summary><p>No. La primera conversación sirve para entender el proyecto y confirmar si podemos aportar valor.</p></details></div></section>`;

const blog = () => `${pageHero({ kicker: 'Historias y recursos', title: 'Ideas para celebrar con más calma.', description: 'Guías prácticas para tomar decisiones, proteger vuestro presupuesto y diseñar una boda que se parezca a vosotros.', current: ['Blog'] })}
<section class="section"><div class="container"><div class="article-grid">${articles.map((article) => `<article class="article-card"><a href="/blog/${article.slug}/"><div class="article-card-image"><img src="${article.image}" alt="${esc(article.title)}" loading="lazy"></div><div class="article-card-body"><div class="article-meta"><span>${esc(article.category)}</span><span>${esc(article.readTime)}</span></div><h3>${esc(article.title)}</h3><p>${esc(article.description)}</p><span class="btn btn-text">Leer la guía ↗</span></div></a></article>`).join('')}</div></div></section>
<section class="section section-sage"><div class="container narrow center"><div class="kicker">Para guardar</div><h2>Descargad la checklist de boda.</h2><p class="lede" style="margin-left:auto;margin-right:auto">Un recorrido sencillo por las decisiones principales, ordenadas para que sepáis qué toca ahora y qué puede esperar.</p><a class="btn btn-primary" href="/recursos/checklist-boda/">Ver la checklist gratuita</a></div></section>`;

const articlePage = (article) => {
  const bodySections = article.sections.map((section) => `<section><h2>${esc(section.heading)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}${section.list ? `<ul>${section.list.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}</section>`).join('');
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description, image: `${site.url}${article.image}`, datePublished: updatedDate, dateModified: updatedDate, author: { '@type': 'Organization', name: site.legalName }, inLanguage: 'es-ES' };
  return `<section class="section"><div class="container"><div class="article-header">${breadcrumbs([{ label: 'Inicio', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: article.title }])}<div class="kicker">${esc(article.category)}</div><h1>${esc(article.title)}</h1><p class="lede">${esc(article.description)}</p><div class="article-meta-line"><span>Equipo GoWeddingPlanner</span><span>Actualizado · septiembre 2026</span><span>${esc(article.readTime)}</span></div></div><div class="article-layout"><article><img class="article-hero-image" src="${article.image}" alt="${esc(article.title)}" width="1200" height="700"><div class="article-body">${bodySections}</div></article><aside class="article-aside"><strong>¿Lo hablamos?</strong><p>Si esta guía os ha ayudado a ordenar ideas, podemos hacer lo mismo con vuestra boda.</p><a class="btn btn-primary" href="/contacto/">Solicitar conversación</a></aside></div></div></section>${ctaStrip('Un buen plan empieza por una buena conversación.')}`;
};

const resources = () => `${pageHero({ kicker: 'Recursos gratuitos', title: 'Herramientas para organizar sin perder la calma.', description: 'Recursos sencillos para que las decisiones importantes tengan un lugar y un momento.', current: ['Recursos'] })}
<section class="section"><div class="container resource-grid"><article class="resource-card"><div class="resource-icon">✓</div><h3>Checklist completa de boda</h3><p>Más de 40 puntos ordenados por momento: presupuesto, espacio, proveedores, invitados y últimas semanas.</p><a class="btn btn-primary" href="/recursos/checklist-boda/">Abrir checklist ↗</a><a class="btn btn-text" href="/recursos/checklist-boda.pdf" download>Descargar PDF ↗</a></article><article class="resource-card"><div class="resource-icon">◎</div><h3>El mapa de prioridades</h3><p>Una conversación para decidir qué tres cosas queréis proteger por encima de todo en vuestra celebración.</p><a class="btn btn-outline" href="/contacto/">Pedir orientación ↗</a></article></div></section>
<section class="section section-paper"><div class="container narrow"><div class="kicker">Un consejo antes de empezar</div><h2>No organicéis todo a la vez.</h2><p class="lede">Elegid la próxima decisión importante, no la lista completa. Una boda se construye mejor cuando cada paso deja espacio para el siguiente.</p></div></section>`;

const checklist = () => {
  const groups = [
    ['12–18 meses antes', ['Definir presupuesto y prioridades', 'Elegir fecha o rango de fechas', 'Crear lista aproximada de invitados', 'Visitar y reservar el espacio', 'Valorar ayuda de planificación', 'Investigar documentación de la ceremonia']],
    ['9–12 meses antes', ['Reservar fotografía y vídeo', 'Elegir música y entretenimiento', 'Definir catering y necesidades especiales', 'Empezar a buscar vestuario', 'Pensar alojamiento y transporte', 'Crear concepto visual y paleta']],
    ['6–3 meses antes', ['Enviar invitaciones', 'Cerrar flores, mobiliario e iluminación', 'Definir menú y bebidas', 'Preparar ceremonia, lecturas y música', 'Organizar alojamiento y traslados', 'Revisar contratos y próximos pagos']],
    ['Últimas 8 semanas', ['Confirmar número final de invitados', 'Crear seating plan', 'Compartir timing con proveedores', 'Preparar contactos y plan B', 'Delegar la coordinación del día', 'Preparar pagos, sobres y detalles']],
    ['La semana de la boda', ['Confirmar llegadas y montajes', 'Entregar alianzas y elementos importantes', 'Dejar documentos y teléfonos a la coordinación', 'Dormir, respirar y disfrutar', 'Recordar que no todo tiene que ser perfecto para ser vuestro']]
  ];
  return `<section class="section section-paper"><div class="container"><div class="print-bar"><div><div class="kicker">Recurso gratuito</div><p class="small">Guardadla, imprimidla y adaptadla a vuestro ritmo.</p></div><div><a class="btn btn-text" href="/recursos/checklist-boda.pdf" download>Descargar PDF</a><button class="btn btn-outline" type="button" data-print>Imprimir ↗</button></div></div><div class="checklist"><div class="kicker">GoWeddingPlanner · Checklist</div><h1>La boda, paso a paso.</h1><p class="checklist-intro">No es necesario hacerlo todo hoy. Usad esta lista para saber qué toca ahora, qué puede esperar y qué conviene delegar.</p>${groups.map(([heading, items]) => `<div class="checklist-section"><h2>${heading}</h2>${items.map((item) => `<div class="checklist-item">${esc(item)}</div>`).join('')}</div>`).join('')}<div class="checklist-section"><h2>Una nota para vosotros</h2><p class="checklist-intro">La mejor organización es la que os devuelve tiempo para estar juntos. Si queréis ayuda para ordenar el proyecto, <a href="/contacto/">hablemos</a>.</p></div></div></div></section>`;
};

const legal = (kind) => {
  const content = {
    legal: { title: 'Aviso legal', intro: 'Información del titular y condiciones de uso del sitio web.', sections: [
      ['1. Titular del sitio', `<p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se informa de que el sitio <strong>goweddingplanner.com</strong> es titularidad de ${site.owners}, bajo el nombre comercial ${site.legalName}. Domicilio: Madrid, España. Email: <a href="mailto:${site.email}">${site.email}</a>.</p>`],
      ['2. Propiedad intelectual', '<p>Los textos, diseños, fotografías, código y demás elementos del sitio están protegidos por la normativa aplicable. No se permite su reproducción o distribución sin autorización, salvo los usos permitidos por la ley.</p>'],
      ['3. Responsabilidad', '<p>El titular procura que la información sea correcta y esté actualizada, pero no garantiza la ausencia de errores o interrupciones. Los enlaces a terceros se ofrecen como referencia y se rigen por sus propias condiciones.</p>']
    ]},
    privacy: { title: 'Política de privacidad', intro: 'Cómo tratamos la información que nos enviáis a través de este sitio.', sections: [
      ['1. Responsable', `<p>Responsable: ${site.legalName}. Contacto: <a href="mailto:${site.email}">${site.email}</a>.</p>`],
      ['2. Datos y finalidades', '<p>Tratamos los datos que facilitáis en los formularios para responder a solicitudes de información, preparar una orientación o propuesta y gestionar la relación con vosotros. Si lo autorizáis de forma separada, podremos enviar comunicaciones relacionadas con nuestros servicios.</p>'],
      ['3. Base legal y conservación', '<p>La base legal es vuestro consentimiento y, cuando corresponda, la aplicación de medidas precontractuales. Conservaremos la información durante el tiempo necesario para atender la solicitud y durante los plazos legales aplicables.</p>'],
      ['4. Destinatarios y derechos', '<p>Podremos compartir los datos estrictamente necesarios con proveedores o colaboradores relevantes para responder a la solicitud, siempre dentro de la finalidad informada. Podéis solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a nuestro email.</p>']
    ]},
    cookies: { title: 'Política de cookies', intro: 'Información sobre cookies y tecnologías similares utilizadas en el sitio.', sections: [
      ['1. Qué son las cookies', '<p>Son pequeños archivos que un sitio guarda en el dispositivo para recordar preferencias, mantener funciones o medir el uso del sitio.</p>'],
      ['2. Uso en GoWeddingPlanner', '<p>La versión base del sitio prioriza cookies técnicas necesarias. Si se activan herramientas de analítica o marketing, se configurará el consentimiento correspondiente antes de utilizarlas.</p>'],
      ['3. Gestión', '<p>Podéis bloquear o eliminar cookies desde la configuración del navegador. Algunas funciones podrían dejar de estar disponibles si se desactivan.</p>']
    ]}
  }[kind];
  return `${pageHero({ kicker: 'Información legal', title: content.title, description: content.intro, current: [content.title] })}<section class="section"><div class="container legal-copy">${content.sections.map(([heading, body]) => `<section><h2>${heading}</h2>${body}</section>`).join('')}<p class="small">Última actualización: septiembre de 2026.</p></div></section>`;
};

const cityPage = ({ region, city }) => {
  const citySlug = slugify(city);
  const title = `Wedding planner en ${city} | GoWeddingPlanner`;
  const description = `Organización y coordinación de bodas en ${city} y alrededores. Diseño, proveedores y logística para celebrar con calma.`;
  const localSchema = { '@context': 'https://schema.org', '@type': 'Service', name: `Wedding planner en ${city}`, provider: { '@type': 'Organization', name: site.legalName, url: site.url }, areaServed: { '@type': 'City', name: city }, serviceType: 'Organización de bodas' };
  return `<section class="region-hero" style="--region-accent:${region.accent};--region-tint:${region.tint}"><div class="container region-hero-grid"><div class="region-hero-copy">${breadcrumbs([{ label: 'Inicio', href: '/' }, { label: region.name, href: `/${region.slug}/` }, { label: city }])}<div class="region-tag">${esc(region.name)} · ${esc(city)}</div><h1>Wedding planner en ${esc(city)} para una boda que se parezca a vosotros.</h1><p class="lede">Trabajamos en ${esc(city)} y sus alrededores para diseñar una celebración con intención, encontrar los equipos adecuados y coordinar cada momento sin cargarlo sobre vosotros.</p><div class="hero-actions"><a class="btn btn-primary" href="#solicitar-presupuesto">Contadnos vuestra boda ↗</a><a class="btn btn-outline" href="/${region.slug}/">Ver ${esc(region.name)}</a></div><div class="region-meta"><span><strong>${esc(region.shortName)}</strong>Red local y mirada amplia</span><span><strong>01:1</strong>Acompañamiento cercano</span></div></div><figure class="region-hero-photo"><img src="${region.image}" alt="Boda y paisaje de ${esc(region.name)}" width="1200" height="700"><figcaption>Celebraciones con lugar, ritmo y sentido.</figcaption></figure></div></section><section class="section"><div class="container coverage-grid"><div><div class="kicker">Organización en ${esc(city)}</div><h2>Todo empieza por entender el lugar.</h2><p class="lede">${esc(region.intro)} En ${esc(city)}, ponemos el foco en la experiencia de llegada, el ritmo de la celebración y los proveedores que hacen que cada decisión sea fácil de ejecutar.</p><p>Podemos ayudaros a encontrar espacio, construir un presupuesto realista, diseñar la atmósfera o tomar el relevo en los meses finales. El servicio se adapta a lo que ya tenéis decidido.</p></div><div class="coverage-art" style="background:${region.accent}"><span class="kicker kicker-light">Lo que cuidamos</span><h3>${esc(region.highlight)}</h3><p>Una producción cuidada para que vosotros podáis estar presentes.</p></div></div></section><section class="section section-paper"><div class="container"><div class="section-heading"><div><div class="kicker">Tres formas de acompañaros</div><h2>Del primer mensaje<br>al último baile.</h2></div></div><div class="process-grid"><article class="process-card"><span class="process-number">01</span><h3>Planificar</h3><p>Ordenamos la idea, el presupuesto, el lugar y los proveedores que encajan con vosotros.</p></article><article class="process-card"><span class="process-number">02</span><h3>Diseñar</h3><p>Construimos una atmósfera coherente con la arquitectura, el paisaje y vuestra historia.</p></article><article class="process-card"><span class="process-number">03</span><h3>Coordinar</h3><p>Hacemos que los equipos y los tiempos fluyan mientras vosotros disfrutáis.</p></article></div></div></section>${leadSection({ region: region.form, selectedRegion: region.slug, title: `Vuestra boda en ${city} empieza aquí.` })}`;
};

const redirectPage = (target) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${site.url}${target}"><meta name="robots" content="noindex"><title>Redirigiendo…</title><script>location.replace(${JSON.stringify(target)});</script></head><body><p>Redirigiendo a <a href="${target}">${target}</a>…</p></body></html>`;

const writePage = (relative, opts) => write(relative, layout(opts));

fs.rmSync(out, { recursive: true, force: true });
mkdir(out);
fs.cpSync(assets, path.join(out, 'assets'), { recursive: true });

// Small inline-friendly brand mark. It avoids a remote favicon dependency.
write('assets/brand-mark.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#fbfaf7"/><rect x="4" y="4" width="56" height="56" fill="none" stroke="#a9535d"/><text x="32" y="39" fill="#a9535d" font-family="Georgia,serif" font-size="17" text-anchor="middle">GW</text></svg>`);
fs.copyFileSync(path.join(root, 'src/styles.css'), path.join(out, 'styles.css'));
fs.copyFileSync(path.join(root, 'src/site.js'), path.join(out, 'site.js'));

writePage('index.html', { title: 'GoWeddingPlanner | Bodas con alma en España', description: 'Wedding planner en España para diseñar, organizar y coordinar una boda con personalidad. Madrid, Cataluña y nuevas regiones.', path: '/', body: home() });
writePage('como-funciona/index.html', { title: 'Cómo funciona | GoWeddingPlanner', description: 'Conoce el proceso de GoWeddingPlanner: escuchar, construir el mapa y hacer realidad una boda que se parezca a vosotros.', path: '/como-funciona/', current: '/como-funciona/', body: howItWorks() });
writePage('regiones/index.html', { title: 'Regiones | Wedding planner en España | GoWeddingPlanner', description: 'Descubre las regiones donde trabaja GoWeddingPlanner: Madrid, Cataluña, País Vasco, Castilla-La Mancha, Castilla y León, Andalucía, Comunidad Valenciana y Murcia.', path: '/regiones/', current: '/regiones/', body: regionsPage() });
writePage('servicios/index.html', { title: 'Servicios de wedding planner | GoWeddingPlanner', description: 'Planificación integral, diseño, styling y coordinación del día B. La ayuda que necesitáis, sin contratar lo que no.', path: '/servicios/', current: '/servicios/', body: services() });
writePage('sobre-nosotros/index.html', { title: 'Sobre nosotros | Javier & Andrea | GoWeddingPlanner', description: 'Conoce al equipo de GoWeddingPlanner: diseño, arquitectura efímera y producción de eventos para bodas con alma.', path: '/sobre-nosotros/', current: '/sobre-nosotros/', body: about() });
writePage('contacto/index.html', { title: 'Contacto | Habla con GoWeddingPlanner', description: 'Cuéntanos vuestra boda y os ayudaremos a ordenar el siguiente paso. Primera conversación sin compromiso.', path: '/contacto/', current: '/contacto/', body: contact() });
writePage('portfolio/index.html', { title: 'Portfolio de bodas | GoWeddingPlanner', description: 'Historias, atmósferas y lugares con carácter. Descubre la mirada de GoWeddingPlanner.', path: '/portfolio/', body: portfolio() });
writePage('blog/index.html', { title: 'Blog y guías de boda | GoWeddingPlanner', description: 'Guías prácticas sobre presupuesto, espacios, proveedores y planificación de bodas en España.', path: '/blog/', current: '/blog/', body: blog() });
writePage('recursos/index.html', { title: 'Recursos gratuitos para organizar vuestra boda | GoWeddingPlanner', description: 'Checklist y recursos gratuitos para organizar una boda con más claridad y menos estrés.', path: '/recursos/', current: '/recursos/', body: resources() });
writePage('recursos/checklist-boda/index.html', { title: 'Checklist de boda gratuita | GoWeddingPlanner', description: 'Checklist de boda paso a paso para organizar presupuesto, espacio, proveedores, invitados y últimas semanas.', path: '/recursos/checklist-boda/', body: checklist() });
writePage('aviso-legal/index.html', { title: 'Aviso legal | GoWeddingPlanner', description: 'Información legal del sitio web GoWeddingPlanner.', path: '/aviso-legal/', body: legal('legal') });
writePage('politica-privacidad/index.html', { title: 'Política de privacidad | GoWeddingPlanner', description: 'Información sobre el tratamiento de datos personales en GoWeddingPlanner.', path: '/politica-privacidad/', body: legal('privacy') });
writePage('politica-cookies/index.html', { title: 'Política de cookies | GoWeddingPlanner', description: 'Información sobre cookies y tecnologías similares en GoWeddingPlanner.', path: '/politica-cookies/', body: legal('cookies') });

for (const region of regions) {
  const regionSchema = { '@context': 'https://schema.org', '@type': 'Service', name: `Wedding planner en ${region.name}`, serviceType: 'Organización y coordinación de bodas', provider: { '@type': 'Organization', name: site.legalName, url: site.url }, areaServed: { '@type': 'AdministrativeArea', name: region.name }, url: `${site.url}/${region.slug}/` };
  const cards = region.styles.map((style, index) => `<article class="feature-card"><span class="number">0${index + 1}</span><h3>${esc(style)}</h3><p>${index === 0 ? 'Espacios con personalidad y una producción que respeta lo que ya hace especial al lugar.' : index === 1 ? 'Una estética conectada con el paisaje, la luz y vuestra forma de celebrar.' : 'Un acompañamiento cercano para disfrutar de cada decisión, también de las pequeñas.'}</p></article>`).join('');
  const cityLinks = region.cities.map((city) => `<span class="chip">${esc(city)}</span>`).join('');
  const body = `<section class="region-hero" style="--region-accent:${region.accent};--region-tint:${region.tint}"><div class="container region-hero-grid"><div class="region-hero-copy">${breadcrumbs([{ label: 'Inicio', href: '/' }, { label: 'Regiones', href: '/regiones/' }, { label: region.name }])}<div class="region-tag">${esc(region.eyebrow)}</div><h1>Wedding planner en ${esc(region.name)} para celebrarlo a vuestra manera.</h1><p class="lede">${esc(region.description)}</p><div class="hero-actions"><a class="btn btn-primary" href="#solicitar-presupuesto" data-track="region_hero_cta">Cuéntanos vuestra boda ↗</a><a class="btn btn-outline" href="/como-funciona/">Ver cómo trabajamos</a></div><div class="region-meta"><span><strong>${esc(region.shortName)}</strong>Red local y mirada amplia</span><span><strong>01:1</strong>Acompañamiento cercano</span></div></div><figure class="region-hero-photo"><img src="${region.image}" alt="Boda en ${esc(region.name)}" width="1200" height="700"><figcaption>${esc(region.highlight)}</figcaption></figure></div></section><section class="section"><div class="container coverage-grid"><div><div class="kicker">Una boda con lugar</div><h2>${esc(region.intro)}</h2><p class="lede">Os ayudamos a convertir el paisaje y la personalidad de ${esc(region.name)} en una celebración completa: desde el primer presupuesto hasta el último proveedor.</p><a class="btn btn-text" href="/contacto/">Hablar con el equipo ↗</a></div><div class="coverage-art" style="background:${region.accent}"><span class="kicker kicker-light">Zonas de cobertura</span><h3>Conocemos el ritmo de cada celebración.</h3><p>Estos son algunos lugares donde podemos acompañaros.</p><div class="chip-list dark">${cityLinks}</div></div></div></section><section class="section section-paper"><div class="container"><div class="section-heading"><div><div class="kicker">Una forma flexible de ayudaros</div><h2>Diseñamos desde<br>el contexto.</h2><p>La arquitectura, la temporada, el número de invitados y vuestra forma de estar juntos son parte del briefing.</p></div></div><div class="card-grid">${cards}</div></div></section>${leadSection({ region: region.form, selectedRegion: region.slug, title: `Vuestra boda en ${region.name} empieza con una conversación.` })}`;
  writePage(`${region.slug}/index.html`, { title: region.seoTitle, description: region.seoDescription, path: `/${region.slug}/`, body, image: region.image, schema: [regionSchema] });
  if (region.slug === 'madrid' || region.slug === 'cataluna') {
    for (const city of region.cities) {
      const citySlug = slugify(city);
      writePage(`${region.slug}/ciudades/${citySlug}/index.html`, { title: `Wedding planner en ${city} | GoWeddingPlanner`, description: `Organización y coordinación de bodas en ${city} y alrededores. Diseño, proveedores y logística para celebrar con calma.`, path: `/${region.slug}/ciudades/${citySlug}/`, body: cityPage({ region, city }), image: region.image, schema: [{ '@context': 'https://schema.org', '@type': 'Service', name: `Wedding planner en ${city}`, provider: { '@type': 'Organization', name: site.legalName, url: site.url }, areaServed: { '@type': 'City', name: city }, serviceType: 'Organización de bodas' }] });
    }
  }
}

for (const article of articles) {
  writePage(`blog/${article.slug}/index.html`, { title: `${article.title} | GoWeddingPlanner`, description: article.description, path: `/blog/${article.slug}/`, body: articlePage(article), image: article.image });
}

// Preserve the most important legacy HTML routes during the move. Production should
// use the equivalent 301 rules in vercel.json; these files keep local preview usable.
const legacyTargets = {
  'servicios.html': '/servicios/', 'portfolio.html': '/portfolio/', 'sobre-nosotros.html': '/sobre-nosotros/', 'contacto.html': '/contacto/', 'aviso-legal.html': '/aviso-legal/', 'politica-privacidad.html': '/politica-privacidad/', 'politica-cookies.html': '/politica-cookies/'
};
for (const [legacy, target] of Object.entries(legacyTargets)) write(legacy, redirectPage(target));
for (const region of regions.filter((item) => item.slug === 'madrid' || item.slug === 'cataluna')) {
  for (const city of region.cities) write(`bodas-${slugify(city)}.html`, redirectPage(`/${region.slug}/ciudades/${slugify(city)}/`));
}

const allUrls = [
  '/', '/como-funciona/', '/regiones/', '/servicios/', '/portfolio/', '/sobre-nosotros/', '/contacto/', '/blog/', '/recursos/', '/recursos/checklist-boda/', '/aviso-legal/', '/politica-privacidad/', '/politica-cookies/',
  ...regions.map((region) => `/${region.slug}/`),
  ...regions.filter((region) => region.slug === 'madrid' || region.slug === 'cataluna').flatMap((region) => region.cities.map((city) => `/${region.slug}/ciudades/${slugify(city)}/`)),
  ...articles.map((article) => `/blog/${article.slug}/`)
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allUrls.map((url) => `<url><loc>${site.url}${url}</loc><lastmod>${updatedDate}</lastmod></url>`).join('')}</urlset>`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /site-preview/\nSitemap: ${site.url}/sitemap.xml`);
write('vercel.json', JSON.stringify({ cleanUrls: true, trailingSlash: true, redirects: [
  ...Object.entries(legacyTargets).map(([source, destination]) => ({ source: `/${source}`, destination, permanent: true })),
  ...regions.filter((item) => item.slug === 'madrid' || item.slug === 'cataluna').flatMap((region) => region.cities.map((city) => ({ source: `/bodas-${slugify(city)}`, destination: `/${region.slug}/ciudades/${slugify(city)}/`, permanent: true })))
]}, null, 2));

console.log(`Built ${allUrls.length} canonical URLs in ${out}`);
