# NubeGest · ¿Migrar a la nube es más sostenible?

Presentación web de seis diapositivas sobre el Caso 2 (análisis de sostenibilidad de NubeGest).
Es un sitio estático: HTML, CSS y un único script pequeño de navegación. No necesita compilación,
servidor de aplicaciones, base de datos ni servicios externos. Todo lo que usa está dentro de esta carpeta.

## Estructura

```
NUBEGEST_WEB/
├── index.html              Las seis diapositivas
├── styles/
│   ├── main.css            Fuentes, colores, escenario 16:9, piezas comunes y controles
│   ├── slides.css          Composición de cada diapositiva
│   ├── animations.css      Entrada, coreografía y salida de cada diapositiva
│   └── responsive.css      Recomposición en vertical (móvil y tablet)
├── scripts/
│   └── navigation.js       Estado de la presentación, teclado, táctil y pantalla completa
└── assets/
    ├── images/             Fotografías optimizadas (Unsplash)
    └── fonts/              Source Serif 4, Source Sans 3, Barlow y Caveat (licencia SIL OFL)
```

## Uso

| Acción | Teclado / gesto |
|---|---|
| Siguiente | → · ↓ · Espacio · Av Pág · deslizar a la izquierda |
| Anterior | ← · ↑ · Re Pág · deslizar a la derecha |
| Volver al inicio | Inicio (o el botón ↺) |
| Ir al final | Fin |
| Pantalla completa | F (o el botón ⤢) |

Cada diapositiva tiene su propia dirección en la URL (`#planteamiento`, `#asg`, `#stakeholders`,
`#propuesta`, `#indicador`, `#decision`), así que se puede enlazar o recargar sin perder la posición.

## Probar en local

Basta con abrir `index.html` en un navegador actual (Chrome, Edge, Firefox o Safari recientes).
Si prefieres servirla como en producción, desde esta carpeta:

```bash
python -m http.server 8000
```

y abre `http://localhost:8000`. Cualquier otro servidor estático sirve igual (`npx serve`, la extensión
Live Server de VS Code, etc.).

## Publicar

Sube el contenido de esta carpeta tal cual a cualquier alojamiento estático: el `public_html` de un
hosting compartido (por FTP o desde el gestor de archivos), Netlify o Cloudflare Pages (arrastrando la
carpeta), GitHub Pages, o un bucket S3/Azure configurado como web estática. Todas las rutas son relativas,
así que también funciona dentro de una subcarpeta (`midominio.com/nubegest/`).

No hay que configurar nada más. Si el servidor permite cabeceras de caché, conviene dar una caducidad
larga a `assets/`.

## Notas técnicas

- El escenario mantiene siempre la proporción 16:9 y todas las medidas internas están en unidades `cqw`
  (consultas de contenedor), de modo que la composición se escala sin JavaScript. En pantallas verticales
  `responsive.css` reorganiza cada diapositiva en una columna.
- Las animaciones son CSS puro. El script solo cambia las clases `is-active` / `is-leaving` y el sentido
  (`data-direction`). Un cambio rápido corta la salida anterior, así que nunca se superponen dos transiciones.
- Se respeta la preferencia del sistema de «reducir movimiento».
- Sin JavaScript, las diapositivas se muestran una debajo de otra.
- Las fuentes originales del documento (Sitka, Segoe UI, Bahnschrift y Segoe Print) son de Windows y no se pueden
  redistribuir; se han sustituido por equivalentes libres incluidas en `assets/fonts` junto con sus licencias.
- Fotografías: Unsplash (licencia Unsplash).
