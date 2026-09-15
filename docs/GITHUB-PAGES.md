# GitHub Pages

El repositorio incluye `.github/workflows/deploy-pages.yml`.

## Primera publicación

La acción genera `site/`, ejecuta los checks y publica el artifact en GitHub Pages bajo:

```text
https://lidkhasocialmedia-lgtm.github.io/goweddingplanner-platform/
```

El workflow añade automáticamente `/goweddingplanner-platform/` a los recursos y enlaces internos del preview de proyecto.

## Dominio real

No se ha cambiado DNS ni se ha añadido un `CNAME` de producción. Para asociar `goweddingplanner.com`:

1. Activar el dominio personalizado en la configuración de Pages.
2. Configurar los registros DNS que indique GitHub.
3. Cambiar `BASE_PATH` del workflow a vacío para el dominio raíz.
4. Validar SSL, canonical, sitemap y redirecciones.
5. Mantener la web actual hasta haber comprobado el preview y aprobado la ventana de migración.

Los subdominios regionales no deben apuntarse a la nueva versión sin preparar primero sus redirecciones y comprobar el mapa de URLs.
