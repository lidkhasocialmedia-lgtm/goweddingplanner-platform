# Migración de los repositorios actuales

## Origen auditado

Se revisaron localmente los dos repositorios públicos actuales:

- `Goweddingplanner`: sitio de Madrid con páginas por municipios, formularios de Google Forms y configuración de Vercel.
- `catalunya.goweddingplanner`: sitio de Cataluña con landings por ciudad, imágenes locales, formularios y configuración de Vercel.

No se han modificado ni publicado esos repositorios en esta entrega. Esta plataforma se construyó en una copia local separada para poder revisar el mapa de URLs antes de tocar producción.

## Compatibilidad

La nueva versión conserva:

- Nombre comercial, titulares y email corporativo que aparecían en los sitios actuales.
- Los endpoints de formularios de Madrid y Cataluña como configuración inicial.
- Imágenes locales de Cataluña que ya estaban en el repositorio.
- Rutas antiguas mediante páginas de transición y redirecciones permanentes de Vercel.

## Antes del cambio de dominio

1. Exportar las URLs indexadas y enlaces entrantes de cada propiedad.
2. Crear una tabla `origen → destino` con código 301 y comprobar que no haya cadenas de redirección.
3. Validar formularios con datos de prueba y revisar la hoja de destino.
4. Confirmar DNS, SSL, verificación de Search Console y acceso a Vercel.
5. Publicar primero en una URL de preview, revisar Lighthouse y comprobar móvil.
6. Programar el cambio DNS y monitorizar errores 404 durante 30 días.

## Seguridad

No se almacena ninguna credencial de GitHub en el código, el workspace o la configuración de despliegue. Las credenciales compartidas dentro de documentación deben considerarse expuestas y rotarse antes de conceder acceso de escritura.
