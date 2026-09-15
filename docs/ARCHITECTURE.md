# Arquitectura propuesta

## Decisión: un dominio, carpetas por región

La recomendación para esta fase es concentrar la arquitectura bajo `goweddingplanner.com`:

```text
goweddingplanner.com/
├── /
├── /como-funciona/
├── /regiones/
├── /madrid/
│   └── /ciudades/...
├── /cataluna/
│   └── /ciudades/...
├── /pais-vasco/
├── /castilla-la-mancha/
├── /castilla-y-leon/
├── /andalucia/
├── /comunidad-valenciana/
├── /murcia/
├── /servicios/
├── /portfolio/
├── /blog/
└── /recursos/
```

### Por qué

- La web está en una fase inicial de autoridad y captación: concentrar enlaces, contenido y señales de marca en un dominio simplifica el crecimiento.
- Las carpetas permiten organizar la intención local sin obligar a Google y a los equipos de analítica a tratar cada región como una web independiente.
- Compartir plantilla, datos y componentes evita duplicidades y hace más rápido crear nuevas páginas de calidad.
- Los antiguos subdominios pueden mantenerse durante la transición como aliases con redirección 301 hacia sus carpetas equivalentes.

No se deben lanzar páginas regionales idénticas cambiando solo el nombre del territorio. Cada región necesita ejemplos, espacios, lenguaje, enlaces internos y proveedores que aporten valor local.

## Stack actual detectado

Los dos repositorios existentes son sitios estáticos compuestos por HTML con:

- Tailwind cargado desde CDN.
- CSS inline y JavaScript inline.
- Fuentes e iconos externos.
- Formularios HTML enviados a Google Forms mediante iframe.
- `vercel.json` para URLs limpias.
- Sin `package.json`, pipeline de build, tests automatizados ni componentes compartidos.

## Stack de esta entrega

Se ha elegido un generador estático pequeño con Node.js nativo para reducir riesgo en la migración:

- **Datos:** módulos ESM en `data/`.
- **Generación:** `scripts/build.mjs` produce HTML por ruta.
- **Estilos:** `src/styles.css`, sin CDN.
- **Interacción:** `src/site.js`, vanilla JS progresivo.
- **Hosting:** compatible con Vercel, Cloudflare Pages, Netlify o hosting estático.
- **Leads:** Google Forms actual mediante configuración centralizada.

La estructura permite migrar a Astro/Eleventy más adelante sin cambiar el mapa de URLs ni el modelo de contenido.

## Migración de rutas

`vercel.json` incluye redirecciones permanentes desde las páginas HTML existentes (`servicios.html`, `portfolio.html`, `bodas-mostoles.html`, etc.) a las nuevas URLs con carpetas. En el preview local también se sirven redirecciones 301 para comprobar el comportamiento.

Para los subdominios actuales, la capa DNS/hosting debe apuntar a la nueva aplicación. El servidor deberá devolver 301 desde:

- `catalunya.goweddingplanner.com/*` a `/cataluna/*`.
- `madrid.goweddingplanner.com/*` a `/madrid/*`.

Antes de cambiar DNS se debe generar un inventario de URLs indexadas en Search Console y mapear cada una a su destino exacto.
