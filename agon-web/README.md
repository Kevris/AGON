# AGON — sitio de presentación

Landing de AGON: plataforma para gestionar ligas de Haxball. Vite + React + TypeScript + Tailwind + Framer Motion.

## Desarrollo local

Requiere Node 18+.

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build de producción

```bash
npm run build
npm run preview
```

El sitio compilado queda en `dist/` — es 100% estático, sin backend.

## Desplegar

Cualquiera de estas opciones funciona sin configuración extra (el build ya genera `dist/`):

- **Vercel**: importa el repo, framework preset "Vite", listo.
- **Cloudflare Pages**: build command `npm run build`, output directory `dist`.
- **Netlify**: build command `npm run build`, publish directory `dist`.

## Estructura

```
src/
├── lib/
│   └── smoothScroll.ts  Lenis + GSAP ScrollTrigger sincronizados
├── components/
│   ├── Preloader.tsx    trazo del cruce dibujándose antes de revelar el sitio
│   ├── CustomCursor.tsx cursor con imán sobre elementos [data-magnetic]
│   ├── Grain.tsx        textura de grano cinematográfico (overlay fijo)
│   ├── Nav.tsx          barra superior
│   ├── Hero.tsx         wordmark AGON con revelado y fondo ambiental
│   ├── Ambient.tsx      reflector + brasas ascendiendo (fondo del hero)
│   ├── HowItWorks.tsx   qué es + recorrido del modelo + demo de Tie
│   ├── ModelJourney.tsx recorrido pinneado League→...→MatchEvent con el scroll
│   ├── TieDemo.tsx      simulador jugable del modelo Tie (ida/vuelta)
│   ├── Architecture.tsx un proceso, no un enjambre — cifras reales del recorte
│   ├── Principles.tsx   los 4 principios de arquitectura
│   ├── Roadmap.tsx      estado del proyecto, línea de tiempo con scroll
│   └── Footer.tsx
├── App.tsx
└── index.css            Tailwind + estilos base + grano
```

Elementos interactivos llevan `data-magnetic` para que `CustomCursor` los detecte;
si agregás un botón o link nuevo y querés que el cursor reaccione, agregá el
mismo atributo.

Los tokens de color/tipografía están en `tailwind.config.js` (colores `turf`,
`chalk`, `flood`, `card`; fuentes `Bricolage Grotesque` para display y
`JetBrains Mono` para datos).

## Editar contenido

Todo el texto vive directo en los componentes de `src/components/` — no hay
CMS ni archivos de contenido separados. Los nombres de equipo de ejemplo en
`TieDemo.tsx` (`Norte FC`, `Cuadro Sur`) son placeholders, no ligas reales.
