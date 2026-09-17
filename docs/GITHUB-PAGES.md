# GitHub Pages

El repositorio incluye `.github/workflows/deploy-pages.yml`.

## Primera publicación

La acción genera `site/`, ejecuta los checks y publica el artifact en GitHub Pages bajo:

```text
https://lidkhasocialmedia-lgtm.github.io/goweddingplanner-platform/
```

El workflow añade automáticamente `/goweddingplanner-platform/` a los recursos y enlaces internos del preview de proyecto.

## Dominio real

No se ha cambiado DNS ni se ha añadido un `CNAME` de producción. La arquitectura aprobada reserva `goweddingplanner.com` para la web de Madrid y contempla publicar este proyecto en `bodasyeventos.goweddingplanner.com`.

Cuando llegue la ventana de publicación del subdominio:

1. Activar `bodasyeventos.goweddingplanner.com` como dominio personalizado en la configuración de Pages.
2. Configurar los registros DNS que indique GitHub.
3. Cambiar el `BASE_PATH` del workflow a vacío para el dominio personalizado.
4. Validar SSL, canonical, sitemap, formularios y redirecciones.
5. Mantener la web de Madrid intacta hasta haber comprobado el preview y aprobado la publicación.

El preview de GitHub Pages debe conservar `noindex,nofollow`; no se debe publicar el subdominio indexable hasta validar el dominio real.
