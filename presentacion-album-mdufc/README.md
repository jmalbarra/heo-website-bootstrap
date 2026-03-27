# Presentación MDUFC (en vivo)

Mini sitio para el público: **listado de temas** con desbloqueo según el avance del show, **letra** y **de qué habla** cada canción. Vista **operador** para avanzar o retroceder el índice en el servidor.

Estética alineada con [`n0m10s/`](../n0m10s/).

## URLs

- **Público (QR):** `…/presentacion-album-mdufc/` o `index.html`
- **Operador (no compartir en QR):** `operator.html`

## Contenido

Editá `data/setlist.json` antes del show: `meta` (título, subtítulo, línea de evento) y el array `songs` con `id`, `title`, `about`, `lyrics`.

El estado en vivo es solo el entero **`currentIndex`** (0 = primer tema). Se guarda en `data/state.json` vía PHP.

## Secreto del operador (`config.php`)

`api/set.php` solo acepta peticiones si el cuerpo incluye el mismo valor que `OPERATOR_SECRET` en `includes/config.php`.

### Opción recomendada: secreto de GitHub

1. En el repo: **Settings → Secrets and variables → Actions → New repository secret**.
2. Nombre: **`PRESENTACION_MDUFC_OPERATOR_SECRET`** · Valor: una cadena larga y aleatoria (la usás también al operar desde `operator.html`).
3. En cada deploy, [`.github/workflows/deploy-develop-to-stg.yaml`](../.github/workflows/deploy-develop-to-stg.yaml) y [`.github/workflows/deploy-main-to-prod.yaml`](../.github/workflows/deploy-main-to-prod.yaml) generan **`includes/config.php`** en el runner antes del mirror SFTP.

Así no hace falta crear `config.php` a mano en el servidor ni volver a subirlo tras cada deploy.

Si el secreto **no** está definido, el workflow muestra un *warning* y no genera el archivo: podés seguir la opción manual abajo.

### Opción manual (FTP)

1. Copiá `includes/config.example.php` a **`includes/config.php`** en el servidor (no subas `config.php` al repo: está en `.gitignore`).
2. Definí `OPERATOR_SECRET` con una cadena larga y única (no dejes el placeholder del example).

## Permisos

El usuario de PHP del hosting debe poder **escribir** `data/state.json`. Si falla `set.php` con error `write_failed`, revisá permisos de la carpeta `data/` (p. ej. 0755 o 0775 según el host).

## Bloqueo de `state.json` (opcional)

En `data/.htaccess` se niega el acceso HTTP directo a `state.json`. Si tu host no usa Apache o da error 500, eliminá ese archivo o adaptá la regla.

## CI/CD (igual que el resto del sitio)

Los workflows en `.github/workflows/` hacen **mirror SFTP de todo el repositorio** al hacer push a `develop` o `main`. Esta carpeta se publica **automáticamente** como el resto del sitio (misma mecánica que `n0m10s/`). Un PR no despliega hasta merge y push.

## Desarrollo local sin PHP

Podés probar la UI con **`?dev=1`** en la URL del público y del operador:

- `index.html?dev=1` — el índice se guarda en `localStorage` en ese navegador.
- `operator.html?dev=1` — los botones actualizan el mismo `localStorage` (sin `config.php`).

## Checklist pre-show

- [ ] `setlist.json` completo y revisado.
- [ ] Secreto **`PRESENTACION_MDUFC_OPERATOR_SECRET`** en GitHub (o `config.php` manual en el servidor).
- [ ] Probar `api/state.php` y `api/set.php` desde el móvil con datos (4G/WiFi).
- [ ] Operador con la URL guardada; público con QR a `index.html`.
