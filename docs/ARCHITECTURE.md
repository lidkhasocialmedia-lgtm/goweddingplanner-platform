# Arquitectura del proyecto

## Decisión vigente: proyecto independiente para eventos

La web de Madrid en `goweddingplanner.com` permanece intacta. Este repositorio contiene una web independiente, con contenido propio, preparada para publicarse en `bodasyeventos.goweddingplanner.com`:

```text
bodasyeventos.goweddingplanner.com/
├── /
├── /como-funciona/
├── /regiones/
├── /madrid/
│   └── /ciudades/...
├── /cataluna/
│   └── /ciudades/...
├── /servicios/
├── /eventos/
├── /portfolio/
├── /blog/
└── /recursos/
```

La ruta `/eventos/` amplía la propuesta más allá de las bodas: bautizos, comuniones, cumpleaños y aniversarios, reuniones familiares, celebraciones privadas bajo consulta y eventos corporativos, de marca, inauguraciones o presentaciones.

### Estado de publicación

- El proyecto se mantiene en preview de GitHub Pages con `noindex,nofollow`.
- No se ha cambiado DNS, Vercel, GitHub Pages ni ningún dominio de producción.
- El `canonical`, el sitemap y los datos estructurados ya apuntan al subdominio reservado para la publicación final.
- La publicación indexable requiere validar antes el dominio, formularios, redirecciones y medición.

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
