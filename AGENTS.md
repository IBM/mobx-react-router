# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Testing

- Jest uses `jest-jasmine2` test runner (not default circus) - specified in package.json
- Tests must be in `__test__/` directory (configured in jest.roots)
- Custom jasmine matcher `toEqualLocation` defined in sync.spec.js for location comparisons

## Code Style

- ESLint uses `neostandard` config with custom overrides
- No space before function parens: `function()` not `function ()`
- Semicolons required (enforced at warning level)
- Camelcase not enforced (disabled)
- `no-return-assign` disabled (allows `return x = y` pattern)

## Build

- Webpack builds UMD bundle with `mobx` as external dependency
- Entry point is `index.js` (not src/index.js)
- Use `MINIFY=1` env var to create minified build
- Library exports as `MobxReactRouter` global

## MobX Integration

- RouterStore uses `makeAutoObservable` with `autoBind: true` option
- Store location updates via private `_updateLocation` method (not direct assignment)
- `syncHistoryWithStore` adds `subscribe`/`unsubscribe` methods to history object (non-standard history API extension)