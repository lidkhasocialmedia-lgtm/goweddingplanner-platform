# GoWeddingPlanner Platform

Primera implementación local de una plataforma nacional para GoWeddingPlanner. Es un sitio estático SEO-first, sin framework ni dependencias de runtime, pensado para desplegarse en Vercel/Cloudflare Pages o cualquier hosting estático.

## Qué incluye

- Home nacional como hub principal.
- Ocho landings regionales: Madrid, Cataluña, País Vasco, Castilla-La Mancha, Castilla y León, Andalucía, Comunidad Valenciana y Murcia.
- Landings de ciudad para las zonas que ya tenían páginas en los repositorios actuales de Madrid y Cataluña.
- Páginas de servicios, proceso, portfolio, equipo, contacto y legales.
- Blog con 10 artículos iniciales orientados a intención de búsqueda.
- Checklist de boda imprimible y descargable.
- Formularios conectados a los dos endpoints de Google Forms ya usados por los sitios actuales.
- Metadatos, canonical, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml` y redirecciones de rutas antiguas.
- Diseño responsive, accesible y sin dependencias externas para estilos o iconos.

## Ejecutar

```bash
npm run build
npm run check
npm run dev
```

El preview queda disponible en `http://localhost:4173` (o en el Live Preview de Agent Mode). La carpeta `site/` contiene el resultado generado.

## Estructura

```text
data/                 Datos de regiones y artículos
src/styles.css         Sistema visual y responsive
src/site.js            Menú, tracking dataLayer y formularios
scripts/build.mjs      Generador estático
scripts/check.mjs      Checks estructurales
server.mjs             Servidor local de preview
assets/                Imágenes locales optimizadas/originales
site/                  Sitio generado para preview/deploy

docs/ARCHITECTURE.md   Decisiones técnicas y de URLs
docs/SEO-STRATEGY.md   Checklist de migración y posicionamiento
```

## Formulario y analítica

El formulario conserva los nombres de campo y endpoints de Google Forms presentes en los repositorios actuales. El selector de región decide qué endpoint usar para Madrid o Cataluña; las regiones nuevas usan Madrid como fallback hasta que exista una hoja/formulario específico para ellas.

Los eventos se envían a `window.dataLayer` (`hero_cta`, `inline_cta`, `lead_form_submit`, `lead_form_success`, etc.). Antes de publicar hay que insertar los IDs reales de GA4/GTM y configurar el consentimiento de cookies; no se han inventado IDs de medición.

## Publicación

El workflow `.github/workflows/deploy-pages.yml` está preparado para publicar el proyecto en GitHub Pages como preview de proyecto. La primera publicación usa la ruta `/goweddingplanner-platform/`; el dominio real requiere una configuración separada de dominio personalizado y DNS. Antes de publicar en producción:

1. Rotar/revocar cualquier credencial de GitHub que haya aparecido en documentación compartida y crear una nueva con el mínimo alcance.
2. Revisar textos legales, titulares, email y política de cesión de leads.
3. Confirmar que cada endpoint de Google Forms pertenece a la región correcta.
4. Configurar el dominio raíz y los certificados SSL.
5. Aplicar `vercel.json` y validar todas las redirecciones con el dominio real.
6. Dar de alta la propiedad de dominio en Search Console y enviar `https://goweddingplanner.com/sitemap.xml`.
