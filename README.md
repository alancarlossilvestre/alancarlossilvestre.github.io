# Perfil profesional

Web profesional de Alan Carlos Silvestre, enfocada en su perfil, experiencia, formación y servicios de soluciones tecnológicas y consultoría. Sitio estático compatible con GitHub Pages, construido con HTML, CSS y JavaScript, sin dependencias de compilación.

## Información profesional

La información se tomó de `curriculum/CV_ Alan_Miguel_Carlos_Silvestre.pdf`. La web prioriza la experiencia en Financiera Oh!, BCP, Entel Perú y GOREPA Pasco, y conserva una síntesis de los primeros proyectos de desarrollo móvil.

El período en BCP se corrigió a **enero de 2023 – julio de 2024**, según confirmación del titular. El PDF original no se modifica y todavía indica “Actualidad” para ese puesto.

Los servicios priorizan desarrollo web, aplicaciones móviles y sistemas/sistemas web a medida, además de consultoría tecnológica, automatización y DevOps. Se presentan como formas de colaboración, sin atribuir clientes, resultados o experiencia de consultoría no documentados. Hay caminos de contacto diferenciados para reclutadores y para clientes con proyectos. La formación AWS Partner se identifica con su nombre original, no como una certificación AWS Certified.

Se incluyen formación y credenciales del CV, así como los enlaces profesionales y el teléfono completo. No se reproduce la fecha de nacimiento en el contenido de la página ni se utiliza un testimonio del portafolio anterior; el PDF descargable conserva su contenido original.

## Diseño

Estilo glassmorphism oscuro con acentos violetas y cian, basado en los principios de [Glassmorphism: Definition and Best Practices, de Nielsen Norman Group](https://www.nngroup.com/articles/glassmorphism/). El fondo incluye esferas de color que se perciben detrás de paneles translúcidos; el desenfoque, los reflejos y los bordes iluminados dan profundidad sin reducir la opacidad del texto.

Los paneles de lectura y la navegación tienen más protección de contraste que los elementos decorativos. Incluye fondos sólidos para navegadores sin `backdrop-filter` y para las preferencias del sistema `prefers-reduced-transparency: reduce` o `prefers-contrast: more`, además de navegación móvil, foco visible y respeto por el movimiento reducido.

El diseño actual utiliza `css/estilos.css` y `css/normalize.css`. Los demás estilos del diseño anterior se conservan, pero no se cargan.

## Vista local

Desde la carpeta del proyecto:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8000` en el navegador. No se necesita instalar paquetes.

## Presentación sin fotografía

La sección de presentación conserva la composición propia hecha con HTML y CSS: monograma AC, órbitas, etiquetas de DevOps, cloud y seguridad, y una tarjeta de código. No descarga imágenes adicionales ni utiliza una foto de otra persona. Se edita en el elemento con la clase `hero-visual` de `index.html` y sus estilos en `css/estilos.css`.

La fotografía original `imagenes/1.png` se conserva en el repositorio, pero ya no se muestra.

## Animaciones

DevOps, Cloud y Seguridad recorren una órbita elíptica de 32 segundos alrededor del monograma; las etiquetas permanecen orientadas para poder leerlas. Un botón en la tarjeta permite pausar y reanudar. La órbita también se pausa cuando queda fuera de la pantalla o la pestaña está oculta.

Las secciones entran una sola vez con un desplazamiento de 12 píxeles y una transición de 480 milisegundos, con un pequeño escalonado entre tarjetas. No hay movimiento continuo en el resto del contenido. Se respetan `prefers-reduced-motion`, los cambios de preferencia durante la visita y el foco del teclado.

El contenido siempre es visible sin JavaScript, `IntersectionObserver` o Web Animations. La órbita queda estática si falta soporte para `offset-path` o se ha solicitado movimiento reducido.

## Contacto

Los enlaces de cada servicio y de las tarjetas para reclutadores y clientes llevan al formulario con el motivo de la consulta preseleccionado. El formulario prepara un enlace `mailto:` con el tema, nombre, correo y mensaje codificados. Abre la aplicación de correo del visitante; **no envía mensajes automáticamente ni utiliza un servidor**. También muestra un enlace para volver a abrir el correo preparado y la dirección de contacto. Al editar los datos se retira el enlace preparado anterior para no reutilizar un mensaje desactualizado.

El salto al contacto conserva el historial de navegación y coloca el foco en el motivo de la consulta, que puede cambiarse antes de preparar el correo.

LinkedIn, el correo y el teléfono se basan en el CV. Los enlaces externos se abren con `target="_blank"` y `rel="noopener noreferrer"`.
