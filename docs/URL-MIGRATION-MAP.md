# Inventario inicial de URLs para migración controlada

Este documento se genera a partir de los dos repositorios auditados. Es un mapa de trabajo; antes del cambio DNS hay que contrastarlo con Search Console, Analytics y logs de servidor.

## Regla de migración

| Origen | Destino propuesto | Acción |
| --- | --- | --- |
| `https://goweddingplanner.com/` | `/madrid/` o contenido Madrid conservado en `/` | Decidir tras comparar tráfico y consultas; no redirigir a ciegas |
| `https://catalunya.goweddingplanner.com/` | `/cataluna/` | 301 una vez validada la equivalencia |

## Dominio principal · páginas existentes

| Archivo actual | Destino propuesto |
| --- | --- |
| `index.html` | `/madrid/` |
| `servicios.html` | `/servicios/` |
| `portfolio.html` | `/portfolio/` |
| `sobre-nosotros.html` | `/sobre-nosotros/` |
| `contacto.html` | `/contacto/` |
| `aviso-legal.html` | `/aviso-legal/` |
| `politica-privacidad.html` | `/politica-privacidad/` |
| `politica-cookies.html` | `/politica-cookies/` |

## Dominio principal · páginas de ciudad

| Archivo actual | Destino propuesto |
| --- | --- |
| `bodas-alcorcon.html` | `/madrid/ciudades/alcorcon/` |
| `bodas-arroyomolinos.html` | `/madrid/ciudades/arroyomolinos/` |
| `bodas-fuenlabrada.html` | `/madrid/ciudades/fuenlabrada/` |
| `bodas-getafe.html` | `/madrid/ciudades/getafe/` |
| `bodas-leganes.html` | `/madrid/ciudades/leganes/` |
| `bodas-mostoles.html` | `/madrid/ciudades/mostoles/` |
| `bodas-navalcarnero.html` | `/madrid/ciudades/navalcarnero/` |
| `bodas-villaviciosa.html` | `/madrid/ciudades/villaviciosa-de-odon/` |

## Cataluña · páginas existentes

| Archivo actual | Destino propuesto |
| --- | --- |
| `index.html` | `/cataluna/` |
| `servicios.html` | `/servicios/` |
| `portfolio.html` | `/portfolio/` |
| `sobre-nosotros.html` | `/sobre-nosotros/` |
| `contacto.html` | `/contacto/` |
| `aviso-legal.html` | `/aviso-legal/` |
| `politica-privacidad.html` | `/politica-privacidad/` |
| `politica-cookies.html` | `/politica-cookies/` |

## Cataluña · páginas de ciudad

| Archivo actual | Destino propuesto |
| --- | --- |
| `bodas-badalona.html` | `/cataluna/ciudades/badalona/` |
| `bodas-barcelona.html` | `/cataluna/ciudades/barcelona/` |
| `bodas-castelldefels.html` | `/cataluna/ciudades/castelldefels/` |
| `bodas-esplugues.html` | `/cataluna/ciudades/esplugues/` |
| `bodas-granollers.html` | `/cataluna/ciudades/granollers/` |
| `bodas-mataro.html` | `/cataluna/ciudades/mataro/` |
| `bodas-sabadell.html` | `/cataluna/ciudades/sabadell/` |
| `bodas-sant-cugat.html` | `/cataluna/ciudades/sant-cugat/` |
| `bodas-sant-just.html` | `/cataluna/ciudades/sant-just/` |
| `bodas-sitges.html` | `/cataluna/ciudades/sitges/` |
| `bodas-terrassa.html` | `/cataluna/ciudades/terrassa/` |

## Bloqueo de publicación

- No publicar esta tabla como redirecciones definitivas hasta revisar las URLs indexadas y enlaces externos.
- La home actual de Madrid puede tener autoridad propia. Hay que decidir si la nueva home nacional conserva suficiente intención Madrid o si `/` se mantiene temporalmente como Madrid.
- Crear primero preview, ejecutar crawler y revisar 301, canonical, sitemap, formularios y 404.
- Mantener los repositorios actuales intactos hasta completar la ventana de observación.
