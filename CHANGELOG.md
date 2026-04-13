# Changelog

## [6.1.0](https://github.com/teqbench/tbx-mat-notifications/compare/v6.0.3...v6.1.0) (2026-04-13)


### Features

* **docs:** overhaul README and adopt the per-package docs pipeline ([2177b78](https://github.com/teqbench/tbx-mat-notifications/commit/2177b782a064f1f0858a3a5fc6bf06feabe1214c))
* **docs:** overhaul README and adopt the per-package docs pipeline ([f3124cb](https://github.com/teqbench/tbx-mat-notifications/commit/f3124cbbd3f04755aab7b2631af9493ea9675dc5))

## [6.0.3](https://github.com/teqbench/tbx-mat-notifications/compare/v6.0.2...v6.0.3) (2026-04-07)


### Bug Fixes

* **styles:** add outlined button overrides for default severity panel ([fe0673a](https://github.com/teqbench/tbx-mat-notifications/commit/fe0673a11b392eb103cb5c74a6904381a8a01547))
* **styles:** outlined button legibility in default severity ([00407bf](https://github.com/teqbench/tbx-mat-notifications/commit/00407bf4a7d2e8573d7b6e5a7086aa92aea24a39))

## [6.0.2](https://github.com/teqbench/tbx-mat-notifications/compare/v6.0.1...v6.0.2) (2026-04-06)


### Bug Fixes

* **deps:** update vite to 7.3.2/8.0.5 to resolve CVEs ([8620a06](https://github.com/teqbench/tbx-mat-notifications/commit/8620a06f5b7ebcf7f725a489ee050f2e81cad92f))
* **deps:** update vite to 7.3.2/8.0.5 to resolve CVEs ([1646027](https://github.com/teqbench/tbx-mat-notifications/commit/16460278fa9e2e22bee5375bb04f6769dde431b1))

## [6.0.1](https://github.com/teqbench/tbx-mat-notifications/compare/v6.0.0...v6.0.1) (2026-04-06)


### Bug Fixes

* address review findings [#89](https://github.com/teqbench/tbx-mat-notifications/issues/89)-[#92](https://github.com/teqbench/tbx-mat-notifications/issues/92) — stale SCSS comment, missing default() docs and tests ([57f22ff](https://github.com/teqbench/tbx-mat-notifications/commit/57f22ff32b8a569efac5404950bceaea3d92b1c6))
* **styles:** eliminate circular var() fallback for icon button colors in Safari/Firefox ([8c95497](https://github.com/teqbench/tbx-mat-notifications/commit/8c9549773ed0604099de902b62e443b86cda21a3))
* **styles:** rename panel class snackbar-info to snackbar-information ([cf0ecc4](https://github.com/teqbench/tbx-mat-notifications/commit/cf0ecc43ebb79c660d5769d118f58d315a67b51a))

## [6.0.0](https://github.com/teqbench/tbx-mat-notifications/compare/v5.0.0...v6.0.0) (2026-04-06)


### ⚠ BREAKING CHANGES

* severityIconFont/severityIconSvg, closeIconFont/closeIconSvg, actionIconFont/actionIconSvg replaced by severityIcon, closeIcon, actionIcon returning ResolvedIcon | null.
* update barrel file exports for action button support ([#70](https://github.com/teqbench/tbx-mat-notifications/issues/70))
* add TbxMatNotificationRef return type and promise infrastructure ([#73](https://github.com/teqbench/tbx-mat-notifications/issues/73))
* update duration constants and add action defaults ([#66](https://github.com/teqbench/tbx-mat-notifications/issues/66))
* update models for action button and close icon resolver ([#65](https://github.com/teqbench/tbx-mat-notifications/issues/65))
* rename icon services and notification component ([#64](https://github.com/teqbench/tbx-mat-notifications/issues/64))

### Features

* add action button rendering to notification component ([#68](https://github.com/teqbench/tbx-mat-notifications/issues/68)) ([35e65ec](https://github.com/teqbench/tbx-mat-notifications/commit/35e65ecb00cb4c0828f3801de2ee6e16c44fe37e))
* add action resolution cascade and fallback rules ([#76](https://github.com/teqbench/tbx-mat-notifications/issues/76)) ([719f168](https://github.com/teqbench/tbx-mat-notifications/commit/719f168981a81acc740b33c1697ef17be6b8a1aa))
* add dismiss reason tracking and promise resolution guard ([#74](https://github.com/teqbench/tbx-mat-notifications/issues/74)) ([d78b71f](https://github.com/teqbench/tbx-mat-notifications/commit/d78b71fff004da46b887b5327fd92ae7f2a7c498))
* add panelClass merge for snackBarConfig passthrough ([#75](https://github.com/teqbench/tbx-mat-notifications/issues/75)) ([ece8b45](https://github.com/teqbench/tbx-mat-notifications/commit/ece8b45f5b2487f95b1d89a841c9f94d3216d62e))
* Add support for a default severity level. Refine action button colors. ([3f28dff](https://github.com/teqbench/tbx-mat-notifications/commit/3f28dffb4623ee94906f8ce0c0d578b1989ea1e1))
* add TbxMatNotificationRef return type and promise infrastructure ([#73](https://github.com/teqbench/tbx-mat-notifications/issues/73)) ([5a1cda4](https://github.com/teqbench/tbx-mat-notifications/commit/5a1cda4e8f3e33e660044ec28ee9badd7e96c2d2))
* **models:** add types, enums, and interfaces for action button support ([#62](https://github.com/teqbench/tbx-mat-notifications/issues/62)) ([6428fde](https://github.com/teqbench/tbx-mat-notifications/commit/6428fde7a52a2a0d2f211a0b27b745ab17c64fa6))
* **services:** add default close icon font resolver service ([#63](https://github.com/teqbench/tbx-mat-notifications/issues/63)) ([b466af8](https://github.com/teqbench/tbx-mat-notifications/commit/b466af8ddc460eac9a219542254477bb9c6263d5))
* **styles:** add action button color overrides per severity panel class ([#69](https://github.com/teqbench/tbx-mat-notifications/issues/69)) ([eda6725](https://github.com/teqbench/tbx-mat-notifications/commit/eda6725e367d543d64082db1a496ff56aa29673b))


### Bug Fixes

* address code review findings (F1-F10) ([6e42f2f](https://github.com/teqbench/tbx-mat-notifications/commit/6e42f2f4f6fcc84a23dcf5b759e2dd91622b6218))
* address code review findings (F1-F3) ([56c6b0f](https://github.com/teqbench/tbx-mat-notifications/commit/56c6b0f418741fadcfb84c20e86c1e0a1af95b15))
* guard showNext() against destroyed injector ([470ccba](https://github.com/teqbench/tbx-mat-notifications/commit/470ccba1d9f3e376c929df27f400c74536e3a659))
* **storybook:** reset CSS custom properties in action button stories ([a8f73fd](https://github.com/teqbench/tbx-mat-notifications/commit/a8f73fd28af7c7c76e69bb9351b6bf08eea3e553))
* **test:** register dummy SVG icon to suppress MatIcon stderr error ([c0d4a95](https://github.com/teqbench/tbx-mat-notifications/commit/c0d4a9525bcc7bed842084cd239753584244e3b9))
* use [matButton] input binding for action button appearance ([a092d4b](https://github.com/teqbench/tbx-mat-notifications/commit/a092d4bb572d4e4c08a42fb00a0ee328947b17ae))


### Code Refactoring

* re-architect notification component for Angular best practices ([f76dc13](https://github.com/teqbench/tbx-mat-notifications/commit/f76dc1342574643b2076aea0536d769157c0477c))
* rename icon services and notification component ([#64](https://github.com/teqbench/tbx-mat-notifications/issues/64)) ([ff8ddd2](https://github.com/teqbench/tbx-mat-notifications/commit/ff8ddd2e1c215eb51ad645d2603740711442f1ff))
* update barrel file exports for action button support ([#70](https://github.com/teqbench/tbx-mat-notifications/issues/70)) ([cfe671f](https://github.com/teqbench/tbx-mat-notifications/commit/cfe671f571296e47d9a9df41f728766606fa396f))
* update duration constants and add action defaults ([#66](https://github.com/teqbench/tbx-mat-notifications/issues/66)) ([41dd504](https://github.com/teqbench/tbx-mat-notifications/commit/41dd50462fbcbdde906c91a26c36c5d73e497218))
* update models for action button and close icon resolver ([#65](https://github.com/teqbench/tbx-mat-notifications/issues/65)) ([61d26fc](https://github.com/teqbench/tbx-mat-notifications/commit/61d26fc98d1d114675d3db62f17a1afd75f623d0))

## [5.0.0](https://github.com/teqbench/tbx-mat-notifications/compare/v4.0.0...v5.0.0) (2026-04-04)


### ⚠ BREAKING CHANGES

* Exported type TbxMatNotificationConfigArgsType is now TbxMatNotificationConfigArgs.
* **icons:** Re-exported TbxMatSeverityLevelType is now TbxMatSeverityLevel.

### Code Refactoring

* **icons:** rename TbxMatSeverityLevelType to TbxMatSeverityLevel ([62634be](https://github.com/teqbench/tbx-mat-notifications/commit/62634be577af3041d4bf37069799d757c3fba4a5))
* rename TbxMatNotificationConfigArgsType to TbxMatNotificationConfigArgs ([38a3d21](https://github.com/teqbench/tbx-mat-notifications/commit/38a3d21803c7842bf8c5ce39373d264bf69297cc))

## [4.0.0](https://github.com/teqbench/tbx-mat-notifications/compare/v3.0.0...v4.0.0) (2026-04-03)


### ⚠ BREAKING CHANGES

* license changed from Apache-2.0 to AGPL-3.0-only.

### Bug Fixes

* **deps:** resolve lockfile to correct package versions after merge ([172dac8](https://github.com/teqbench/tbx-mat-notifications/commit/172dac828632c00d9572eb787803327d8e36751b))
* **security:** use email reporting channel for private repository ([05ec1b2](https://github.com/teqbench/tbx-mat-notifications/commit/05ec1b2169806f3f9f2dab0698b9c544cb6df603))


### Miscellaneous Chores

* switch license from Apache-2.0 to AGPL-3.0-only ([bcc339f](https://github.com/teqbench/tbx-mat-notifications/commit/bcc339f15d3ca5554fe341c8d675f0c6a443421a))

## [3.0.0](https://github.com/teqbench/tbx-mat-notifications/compare/v2.0.0...v3.0.0) (2026-03-31)


### ⚠ BREAKING CHANGES

* All color CSS custom properties renamed.

### Bug Fixes

* rename color tokens to follow --tbx-mat-notification-* convention ([ab67f64](https://github.com/teqbench/tbx-mat-notifications/commit/ab67f64cd15aea17ea8e86e2a4b17140394874fe)), closes [#47](https://github.com/teqbench/tbx-mat-notifications/issues/47)

## [2.0.0](https://github.com/teqbench/tbx-mat-notifications/compare/v1.1.0...v2.0.0) (2026-03-30)


### ⚠ BREAKING CHANGES

* TBX_MAT_NOTIFICATION_PROVIDER_CONFIG is now required. Peer dependencies updated to @teqbench/tbx-mat-icons >=4.0.0 and @teqbench/tbx-mat-severity-icons >=4.0.0.
* TBX_MAT_NOTIFICATION_PROVIDER_CONFIG is now required. The component no longer falls back to hardcoded font ligatures when the token is not provided. Consumers must configure the token with either TbxMatNotificationFontIconService or TbxMatNotificationSvgIconService.

### Code Refactoring

* adopt initialize() pattern, add default SVG icons, require provider config ([bff72bd](https://github.com/teqbench/tbx-mat-notifications/commit/bff72bd10f237ec503ecd51e6bd45439a6134c44))
* require provider config, use TbxMatIconType enum, update deps to v4 ([dc4479e](https://github.com/teqbench/tbx-mat-notifications/commit/dc4479e7429d18978c39d1f265cc372246caa955))

## [1.1.0](https://github.com/teqbench/tbx-mat-notifications/compare/v1.0.0...v1.1.0) (2026-03-29)


### Features

* **notification:** add showCloseButton flag to hide dismiss button ([54db6db](https://github.com/teqbench/tbx-mat-notifications/commit/54db6dbbb758d0d98622747c1886f877a249dbdd))
* **notification:** add showSeverityIcon and showCloseButton visibility flags ([95be3e3](https://github.com/teqbench/tbx-mat-notifications/commit/95be3e3546aed5da78fbabbdcb14c323591fdb93))
* **notification:** add showSeverityIcon flag to hide severity icon ([3dcc327](https://github.com/teqbench/tbx-mat-notifications/commit/3dcc3278e2c755c349f80be2004f2abb739189fe))

## [1.0.0](https://github.com/teqbench/tbx-mat-notifications/compare/v0.2.0...v1.0.0) (2026-03-29)


### ⚠ BREAKING CHANGES

* warn() renamed to warning(), info() renamed to information().
* TbxSeverityLevelType re-export renamed to TbxMatSeverityLevel.
* TBX_MAT_NOTIFICATION_ICON_SERVICE and TbxMatNotificationIconService removed. Use TBX_MAT_NOTIFICATION_PROVIDER_CONFIG with TbxMatNotificationFontIconService or TbxMatNotificationSvgIconService. TbxMatSeverityLevel renamed to TbxSeverityLevelType.
* All public API symbols are renamed with TbxMat/TBX_MAT_ prefix.
* **icons:** SeverityLevelType re-export is now TbxMatSeverityLevel.

### Features

* add CSS custom properties for notification styling ([aaf261a](https://github.com/teqbench/tbx-mat-notifications/commit/aaf261a315adb7166b4b21460ead892f9d4c3ac4))
* add fallback icons story and story description support ([12cb7b4](https://github.com/teqbench/tbx-mat-notifications/commit/12cb7b43ee2b18e222a76b58c9c5fb5aa41b3c2c))
* add SVG icon stories with distinct severity icons ([87bd8b4](https://github.com/teqbench/tbx-mat-notifications/commit/87bd8b4e50d3f8287b1048b46e85ba9507e9696a))
* apply TbxMat export naming convention to all public symbols ([0606d25](https://github.com/teqbench/tbx-mat-notifications/commit/0606d25733c0f6cf415b82cc58dd3c980857eeab))
* fallback icons story, SVG close icon demo, audit allow-list fix ([3f4fe47](https://github.com/teqbench/tbx-mat-notifications/commit/3f4fe47235e98df373a1bc418bedcb4b8d4ebe62))
* **icons:** align with TbxMat-prefixed naming from upstream v1.0.0 ([dc760af](https://github.com/teqbench/tbx-mat-notifications/commit/dc760af8d7dcd9802e63dc370eafd7597eff6434))
* rename warn/info methods to warning/information, improve docs and stories ([a01cb8a](https://github.com/teqbench/tbx-mat-notifications/commit/a01cb8ab63f4e529a6bca219e6df0c2732351db3))
* replace icon service with provider config, support font and SVG icons ([c87a6f5](https://github.com/teqbench/tbx-mat-notifications/commit/c87a6f5bfa4599962fff52f55f1351a59eebbe18))


### Bug Fixes

* align component selector and SCSS classes with naming convention ([4d00abb](https://github.com/teqbench/tbx-mat-notifications/commit/4d00abbbbf83387e238554d35895710258610103))


### Code Refactoring

* align upstream imports with TbxMat prefix convention ([2a5bc0f](https://github.com/teqbench/tbx-mat-notifications/commit/2a5bc0f0a3f542a8082b0963b7a05d86e26edb6f))

## [0.2.0](https://github.com/teqbench/tbx-mat-notifications/compare/v0.1.1...v0.2.0) (2026-03-26)


### Features

* **storybook:** add Storybook with Analog.js Vite builder ([55428d4](https://github.com/teqbench/tbx-mat-notifications/commit/55428d44c4974f93790ad764dc3d5e556d52d663))
* **storybook:** add Storybook with Analog.js Vite builder ([57a5cb6](https://github.com/teqbench/tbx-mat-notifications/commit/57a5cb6fdf14765acd2c5085a7e831892749fcc1)), closes [#16](https://github.com/teqbench/tbx-mat-notifications/issues/16)


### Bug Fixes

* **component:** restructure notification layout to use native Material snackbar directives ([bce3222](https://github.com/teqbench/tbx-mat-notifications/commit/bce3222429de521e4eb2e7e8920d7392ecd81ed2))
* **component:** restructure notification layout to use native Material snackbar directives ([f3d95d4](https://github.com/teqbench/tbx-mat-notifications/commit/f3d95d4f4dede31be7d381d1e044619290882bd2)), closes [#15](https://github.com/teqbench/tbx-mat-notifications/issues/15) [#18](https://github.com/teqbench/tbx-mat-notifications/issues/18)
* **deps:** align Storybook Angular deps to match @angular/core@21.2.5 ([411007b](https://github.com/teqbench/tbx-mat-notifications/commit/411007b0f39c421e941ec03357c240a68df5127c))
* **deps:** regenerate lockfile for clean npm ci resolution ([60a6195](https://github.com/teqbench/tbx-mat-notifications/commit/60a6195f41ee4758b3a22e5e5ec0cf9b8c63f440))

## [0.1.1](https://github.com/teqbench/tbx-mat-notifications/compare/v0.1.0...v0.1.1) (2026-03-25)


### Bug Fixes

* **deps:** override picomatch to &gt;=4.0.4 for ReDoS vulnerability ([fe57119](https://github.com/teqbench/tbx-mat-notifications/commit/fe571195bef51618b53dd0f81c9d380143a9e9df)), closes [#11](https://github.com/teqbench/tbx-mat-notifications/issues/11)
* **styles:** add package exports entry for SCSS style assets ([bef7d79](https://github.com/teqbench/tbx-mat-notifications/commit/bef7d79b34b9c773a6ed984cdeef192f542a6d8c))
* **styles:** map SCSS partial underscore prefix in package exports ([7a3b898](https://github.com/teqbench/tbx-mat-notifications/commit/7a3b89857d6483c9f2c6266caa6ffe7290790c08)), closes [#9](https://github.com/teqbench/tbx-mat-notifications/issues/9)

## 0.1.0 (2026-03-25)


### Features

* **notifications:** configure package as @teqbench/tbx-mat-notifications ([d0d1578](https://github.com/teqbench/tbx-mat-notifications/commit/d0d1578d20bc68a42f079579d6b0f0ae064f1b0d))
* **notifications:** initial package setup ([211e026](https://github.com/teqbench/tbx-mat-notifications/commit/211e026fdfb3381a6f856f150b934976d32d280c))


### Bug Fixes

* **docs:** add missing SeverityLevelType import in README usage example ([6a4e032](https://github.com/teqbench/tbx-mat-notifications/commit/6a4e0326dde94437fbc38a5ebcfd897c768e1be5)), closes [#4](https://github.com/teqbench/tbx-mat-notifications/issues/4)
* **docs:** add NotificationConfigArgsType to barrel JSDoc header ([0f5f6bb](https://github.com/teqbench/tbx-mat-notifications/commit/0f5f6bbc263f43cb42f3c50c6d8a8a575b85e750)), closes [#5](https://github.com/teqbench/tbx-mat-notifications/issues/5)

## Changelog
