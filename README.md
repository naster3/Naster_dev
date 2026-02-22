# Naster Dev Portfolio

Portafolio profesional enfocado en backend y full-stack, con énfasis en resultados, claridad técnica y ejecución iterativa.

## Resumen

- Presentación profesional en español e inglés.
- Sección de proyectos con enfoque en problema, solución, stack y resultado.
- Formulario de contacto conectado a endpoint externo.
- Animaciones personalizadas (Matrix Rain + cubo ASCII) optimizadas para rendimiento.

## Stack principal

- React 19 + TypeScript
- Vite 7 + Tailwind CSS 4
- Framer Motion
- Vitest + Testing Library
- ESLint + Prettier + Husky

## Ejecutar localmente

```bash
pnpm install
pnpm dev
```

## Variables de entorno

```bash
VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/tu_form_id
```

## Scripts útiles

```bash
pnpm build
pnpm preview
pnpm lint
pnpm test
```

## Arquitectura (referencia rápida)

- Estructura por capas: `app`, `pages`, `widgets`, `shared`
- Documento interno: `src/README.md`
