# Arquitectura de carpetas

```text
src/
  app/                 # bootstrap global (providers, router, estilos)
  pages/               # pantallas de ruta
    shared/            # layout reutilizable de paginas (helmet/footer/shell)
    home/
      ui/              # composicion de la HomePage (sin bloques reutilizables)
  widgets/             # bloques de UI compuestos (layout/header/sections)
    layout/
      model/           # datos del widget (ej. links de navegacion)
      ui/              # implementacion visual del widget
    home-sections/
      model/           # contenido/animaciones/logica reutilizable de secciones
        content/       # contenido i18n de secciones home
        contact/       # logica de formulario de contacto
        matrix/        # motor de animacion matrix/cubo
      ui/sections/     # secciones reutilizables (hero, projects, about, etc.)
      ui/styles/       # clases/utilidades visuales de secciones
  features/            # casos de uso del producto
  entities/            # modelos del dominio
  processes/           # flujos multi-feature
  shared/              # codigo reutilizable transversal
    api/
    config/
    i18n/
    lib/
    ui/
  hooks/               # hooks globales
  test/                # setup global y utilidades de pruebas
  types/               # tipos globales
```

Convenciones:

- Alias: usar `@/` para importar desde `src` (ej. `@/shared/lib`).
- Barrels: usar `index.ts` por modulo para simplificar imports.
