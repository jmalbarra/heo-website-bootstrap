# Aplicar cambios en los workflows de deploy (secreto GitHub → `config.php`)

El push automático desde algunos entornos **no puede** modificar `.github/workflows/` sin permiso `workflow`. Este repo incluye un parche para aplicar en tu máquina **antes** de mergear o en un commit aparte:

```bash
cd /ruta/al/repo
git apply presentacion-album-mdufc/apply-workflows.patch
git add .github/workflows/
git commit -m "ci: generar config.php MDUFC desde secreto en deploy"
git push
```

O abrí `apply-workflows.patch` y copiá los cambios a mano en los dos YAML.
