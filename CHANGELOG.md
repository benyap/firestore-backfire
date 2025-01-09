# Changelog

## 2.6.0 (2025-01-09)

* chore: add compatibility with newer Firestore library versions ([a7f750f](https://github.com/benyap/firestore-backfire/commit/a7f750f))
* chore: fix build output directory ([92a9171](https://github.com/benyap/firestore-backfire/commit/92a9171))
* chore: format, fix typos ([757e5b1](https://github.com/benyap/firestore-backfire/commit/757e5b1))
* chore(deps): update actions/cache action to v4 (#443) ([887934e](https://github.com/benyap/firestore-backfire/commit/887934e)), closes [#443](https://github.com/benyap/firestore-backfire/issues/443)
* chore(deps): update actions/checkout action to v4 (#444) ([21ac45d](https://github.com/benyap/firestore-backfire/commit/21ac45d)), closes [#444](https://github.com/benyap/firestore-backfire/issues/444)
* chore(deps): update pnpm/action-setup action to v2.4.1 (#438) ([9f67ddc](https://github.com/benyap/firestore-backfire/commit/9f67ddc)), closes [#438](https://github.com/benyap/firestore-backfire/issues/438)
* chore(deps): upgrade dependencies ([8997bdd](https://github.com/benyap/firestore-backfire/commit/8997bdd))
* feat: remove shorthand for `--verbose` and `--debug` options ([2c048f1](https://github.com/benyap/firestore-backfire/commit/2c048f1))
* fix: `null` values being exported as `{}` ([52312eb](https://github.com/benyap/firestore-backfire/commit/52312eb))

## [2.5.3](https://github.com/benyap/firestore-backfire/compare/2.5.2...2.5.3) (2023-08-13)


### Internal

* **deps:** update aws-sdk-js-v3 monorepo ([#400](https://github.com/benyap/firestore-backfire/issues/400)) ([d27c6f7](https://github.com/benyap/firestore-backfire/commit/d27c6f7e58093369aef52f1a566f81fed7542ef2))
* **deps:** update aws-sdk-js-v3 monorepo to v3.369.0 ([#397](https://github.com/benyap/firestore-backfire/issues/397)) ([03a7b5e](https://github.com/benyap/firestore-backfire/commit/03a7b5e55975e22d72b17b4e1d4d85ecc3d9670e))
* **deps:** update commitlint monorepo to v17.6.7 ([#405](https://github.com/benyap/firestore-backfire/issues/405)) ([77b27ed](https://github.com/benyap/firestore-backfire/commit/77b27edc4ea95aec4a2eb1258593b0703cce646c))
* **deps:** update dependency @google-cloud/firestore to v6.7.0 ([#407](https://github.com/benyap/firestore-backfire/issues/407)) ([4255c20](https://github.com/benyap/firestore-backfire/commit/4255c20fdadc3f683793f9747366e27c9e751ea1))
* **deps:** update dependency @google-cloud/storage to v6.12.0 ([#401](https://github.com/benyap/firestore-backfire/issues/401)) ([bb9cd33](https://github.com/benyap/firestore-backfire/commit/bb9cd3326c9100bef857743244cdb1d91833e35a))
* **deps:** update dependency @release-it/bumper to v5 ([#398](https://github.com/benyap/firestore-backfire/issues/398)) ([4e77b87](https://github.com/benyap/firestore-backfire/commit/4e77b87305062e55a5d344b46b8050c3e9bf2f43))
* **deps:** update dependency @release-it/bumper to v5.1.0 ([#412](https://github.com/benyap/firestore-backfire/issues/412)) ([5c00f84](https://github.com/benyap/firestore-backfire/commit/5c00f84f3c434df9000454252c32536dab0f6d9a))
* **deps:** update dependency @release-it/conventional-changelog to v7 ([#399](https://github.com/benyap/firestore-backfire/issues/399)) ([7429f5d](https://github.com/benyap/firestore-backfire/commit/7429f5ddf51db99322a1ffefe8e5563400b938fb))
* **deps:** update dependency @swc/core to v1.3.69 ([#390](https://github.com/benyap/firestore-backfire/issues/390)) ([8a78ef7](https://github.com/benyap/firestore-backfire/commit/8a78ef72cb3e34d275e8c42c8432bda5a638f0e7))
* **deps:** update dependency @swc/core to v1.3.72 ([#404](https://github.com/benyap/firestore-backfire/issues/404)) ([7d27559](https://github.com/benyap/firestore-backfire/commit/7d27559eaeca0731126a7989089b51cdce029a7d))
* **deps:** update dependency @swc/core to v1.3.76 ([#413](https://github.com/benyap/firestore-backfire/issues/413)) ([66337b2](https://github.com/benyap/firestore-backfire/commit/66337b2b7d88af2d861944c61d7c2b2fb7bc0939))
* **deps:** update dependency @types/node to v20.4.10 ([#408](https://github.com/benyap/firestore-backfire/issues/408)) ([b400cb4](https://github.com/benyap/firestore-backfire/commit/b400cb4906976e293fc7d66f622e2934f6df84d4))
* **deps:** update dependency @types/node to v20.4.2 ([#392](https://github.com/benyap/firestore-backfire/issues/392)) ([cc10a96](https://github.com/benyap/firestore-backfire/commit/cc10a9653479c9766857fa03ab09ff336b0cd5c9))
* **deps:** update dependency firebase-tools to v12.4.4 ([#396](https://github.com/benyap/firestore-backfire/issues/396)) ([c6eae30](https://github.com/benyap/firestore-backfire/commit/c6eae30e6266200f457d6ab5b97a3f4c6cae170e))
* **deps:** update dependency firebase-tools to v12.4.7 ([#406](https://github.com/benyap/firestore-backfire/issues/406)) ([0dfe3f4](https://github.com/benyap/firestore-backfire/commit/0dfe3f4f0b4929cfd4cbd8c8e16f8fa86214d665))
* **deps:** update dependency prettier to v3 ([#391](https://github.com/benyap/firestore-backfire/issues/391)) ([a0fbd7f](https://github.com/benyap/firestore-backfire/commit/a0fbd7f4d16dab6bf216d769506e16336bd9caa0))
* **deps:** update dependency prettier to v3.0.1 ([#416](https://github.com/benyap/firestore-backfire/issues/416)) ([4cf00d6](https://github.com/benyap/firestore-backfire/commit/4cf00d6bf3ac07d5df03541ad64b2ce1c4523a55))
* **deps:** update dependency release-it to v16 ([#393](https://github.com/benyap/firestore-backfire/issues/393)) ([3c80e2f](https://github.com/benyap/firestore-backfire/commit/3c80e2f881e95223fdfd4ff0b170d89df8399d08))
* **deps:** update dependency release-it to v16.1.3 ([#403](https://github.com/benyap/firestore-backfire/issues/403)) ([47d78a2](https://github.com/benyap/firestore-backfire/commit/47d78a28162384714b90e0c26070a3fddb793e6b))
* **deps:** update dependency release-it to v16.1.5 ([#420](https://github.com/benyap/firestore-backfire/issues/420)) ([2ea28b4](https://github.com/benyap/firestore-backfire/commit/2ea28b4963262566a0a7f69c3c47ee2ee8329abf))
* **deps:** update dependency resolve-tspaths to v0.8.14 ([#388](https://github.com/benyap/firestore-backfire/issues/388)) ([d064f94](https://github.com/benyap/firestore-backfire/commit/d064f94ee01c390c1cfb92592b288bcc0f64a5dc))
* **deps:** update dependency vite to v4.4.3 ([#394](https://github.com/benyap/firestore-backfire/issues/394)) ([8d05958](https://github.com/benyap/firestore-backfire/commit/8d05958b47c97a22889b3dc57abace7176076316))
* **deps:** update dependency vite to v4.4.7 ([#402](https://github.com/benyap/firestore-backfire/issues/402)) ([2750575](https://github.com/benyap/firestore-backfire/commit/27505755b39e7b799e625cd3cceda4535d509c6a))
* **deps:** update dependency vite to v4.4.9 ([#414](https://github.com/benyap/firestore-backfire/issues/414)) ([772fd04](https://github.com/benyap/firestore-backfire/commit/772fd04a5003afab825ce546bde7dba58fd4b03f))
* **deps:** update pnpm/action-setup action to v2.4.0 ([#411](https://github.com/benyap/firestore-backfire/issues/411)) ([a6ca447](https://github.com/benyap/firestore-backfire/commit/a6ca447d0ec4bdf27879c83f470b7c33f13dd7fa))
* **deps:** update vitest monorepo to v0.33.0 ([#395](https://github.com/benyap/firestore-backfire/issues/395)) ([acb1ef5](https://github.com/benyap/firestore-backfire/commit/acb1ef5a73c1a7d890fd3ea5ac4ae23be01c68da))
* **deps:** upgrade dependencies ([6e59d97](https://github.com/benyap/firestore-backfire/commit/6e59d978fe7d5975f881fa4579a338df2e1fa83e))
* format ([b51a98a](https://github.com/benyap/firestore-backfire/commit/b51a98ae8a456ba92288647e3616d95d4dc6d917))
* update code example in README ([02a82a7](https://github.com/benyap/firestore-backfire/commit/02a82a73a956aa5df392b82f722bd1ed0e80feaf))

## [2.5.2](https://github.com/benyap/firestore-backfire/compare/2.5.1...2.5.2) (2023-07-03)


### Bug Fixes

* **deps:** update dependency commander to v11 ([#382](https://github.com/benyap/firestore-backfire/issues/382)) ([e67ae7f](https://github.com/benyap/firestore-backfire/commit/e67ae7f2ce77a302c2e9437905f798232cd4fe33))
* **deps:** update dependency cosmiconfig to v8.2.0 ([#372](https://github.com/benyap/firestore-backfire/issues/372)) ([c7d7512](https://github.com/benyap/firestore-backfire/commit/c7d7512704f1d12475620b8a0e021c20a0510c8f))


### Internal

* add script to generate test data ([a05a241](https://github.com/benyap/firestore-backfire/commit/a05a241b5cad98b1cbc7081b045e742130904ddf))
* **deps:** update aws-sdk-js-v3 monorepo ([#364](https://github.com/benyap/firestore-backfire/issues/364)) ([616d3c1](https://github.com/benyap/firestore-backfire/commit/616d3c15824f27b1c2bf2078205823a9fd175122))
* **deps:** update aws-sdk-js-v3 monorepo ([#377](https://github.com/benyap/firestore-backfire/issues/377)) ([6d3a01f](https://github.com/benyap/firestore-backfire/commit/6d3a01f4cbee504b613297b223c06aaad3b89000))
* **deps:** update aws-sdk-js-v3 monorepo ([#380](https://github.com/benyap/firestore-backfire/issues/380)) ([f9de1db](https://github.com/benyap/firestore-backfire/commit/f9de1db483feaebb1771ad557851a2a3233f75b5))
* **deps:** update aws-sdk-js-v3 monorepo to v3.337.0 ([#353](https://github.com/benyap/firestore-backfire/issues/353)) ([4d907ea](https://github.com/benyap/firestore-backfire/commit/4d907ea6d9c6289caa7f37868d7ce01a1191a8f8))
* **deps:** update aws-sdk-js-v3 monorepo to v3.338.0 ([#354](https://github.com/benyap/firestore-backfire/issues/354)) ([6300e6f](https://github.com/benyap/firestore-backfire/commit/6300e6f13aba61f63a9648541e5c8964509b6dc2))
* **deps:** update aws-sdk-js-v3 monorepo to v3.341.0 ([#359](https://github.com/benyap/firestore-backfire/issues/359)) ([0b41a63](https://github.com/benyap/firestore-backfire/commit/0b41a63132f0202a62e6c19ed548cf26504c5950))
* **deps:** update aws-sdk-js-v3 monorepo to v3.345.0 ([#370](https://github.com/benyap/firestore-backfire/issues/370)) ([9fc95ab](https://github.com/benyap/firestore-backfire/commit/9fc95ab80f59522f98ccac11c4aafcf4c04bd032))
* **deps:** update commitlint monorepo to v17.6.5 ([#361](https://github.com/benyap/firestore-backfire/issues/361)) ([78b4a30](https://github.com/benyap/firestore-backfire/commit/78b4a301d9b0f9d441738eff8b42a90dc6d10afc))
* **deps:** update commitlint monorepo to v17.6.6 ([#385](https://github.com/benyap/firestore-backfire/issues/385)) ([40feec3](https://github.com/benyap/firestore-backfire/commit/40feec3d9ea3b393f2d4c37c5e79ed3fe021fa54))
* **deps:** update dependency @faker-js/faker to v8.0.2 ([#360](https://github.com/benyap/firestore-backfire/issues/360)) ([772a612](https://github.com/benyap/firestore-backfire/commit/772a61247a3cb41687438da6b29d403425a08b1c))
* **deps:** update dependency @google-cloud/firestore to v6.6.0 ([#352](https://github.com/benyap/firestore-backfire/issues/352)) ([7ccc61c](https://github.com/benyap/firestore-backfire/commit/7ccc61c21c9624bd957abc52576d744cd2bb7e1c))
* **deps:** update dependency @google-cloud/firestore to v6.6.1 ([#366](https://github.com/benyap/firestore-backfire/issues/366)) ([60e2476](https://github.com/benyap/firestore-backfire/commit/60e24762421a06e07f8fa7934f7b2dbadbf2bb4d))
* **deps:** update dependency @google-cloud/storage to v6.11.0 ([#373](https://github.com/benyap/firestore-backfire/issues/373)) ([716a7e6](https://github.com/benyap/firestore-backfire/commit/716a7e68d6022e892cbfc242c1dac0a4395646a1))
* **deps:** update dependency @swc/core to v1.3.60 ([#357](https://github.com/benyap/firestore-backfire/issues/357)) ([a2e1a37](https://github.com/benyap/firestore-backfire/commit/a2e1a37417cd5acf8ce1c305fa00180c799175c8))
* **deps:** update dependency @swc/core to v1.3.61 ([#362](https://github.com/benyap/firestore-backfire/issues/362)) ([c4dcf7e](https://github.com/benyap/firestore-backfire/commit/c4dcf7e843c3569425c1940428c647d8e7dd1249))
* **deps:** update dependency @swc/core to v1.3.62 ([#371](https://github.com/benyap/firestore-backfire/issues/371)) ([744682c](https://github.com/benyap/firestore-backfire/commit/744682ccd7ccd0efb23ce2c3a9e0cfb323c07f4d))
* **deps:** update dependency @swc/core to v1.3.64 ([#379](https://github.com/benyap/firestore-backfire/issues/379)) ([c1818f1](https://github.com/benyap/firestore-backfire/commit/c1818f116b18af466f231c6e6a6a8f7a75091b24))
* **deps:** update dependency @swc/core to v1.3.67 ([#384](https://github.com/benyap/firestore-backfire/issues/384)) ([9f20a35](https://github.com/benyap/firestore-backfire/commit/9f20a35fa3afec60161da8d7fd79d5633dc60e3b))
* **deps:** update dependency @types/node to v20.3.3 ([#386](https://github.com/benyap/firestore-backfire/issues/386)) ([c2846eb](https://github.com/benyap/firestore-backfire/commit/c2846ebb8edcdcbbc77a4c80d4e98784cd2629a6))
* **deps:** update dependency concurrently to v8.1.0 ([#365](https://github.com/benyap/firestore-backfire/issues/365)) ([63ecb87](https://github.com/benyap/firestore-backfire/commit/63ecb876afd40ba64c66783a69aba5ac429627c2))
* **deps:** update dependency concurrently to v8.2.0 ([#378](https://github.com/benyap/firestore-backfire/issues/378)) ([8681a7f](https://github.com/benyap/firestore-backfire/commit/8681a7f984b7256faf7cc8b37b0eba09f3a8c1e7))
* **deps:** update dependency firebase-tools to v12.2.0 ([#355](https://github.com/benyap/firestore-backfire/issues/355)) ([8cf5094](https://github.com/benyap/firestore-backfire/commit/8cf509493fec69737eb1e46d3cd904bce5aa8604))
* **deps:** update dependency firebase-tools to v12.2.1 ([#356](https://github.com/benyap/firestore-backfire/issues/356)) ([19074e6](https://github.com/benyap/firestore-backfire/commit/19074e681bb3b3af21bf8eb3f445a4ffaeaf6b53))
* **deps:** update dependency firebase-tools to v12.3.0 ([#368](https://github.com/benyap/firestore-backfire/issues/368)) ([8f5aaf7](https://github.com/benyap/firestore-backfire/commit/8f5aaf7c57ce97a663c560b116424b708f542f2a))
* **deps:** update dependency firebase-tools to v12.3.1 ([#376](https://github.com/benyap/firestore-backfire/issues/376)) ([f1487e6](https://github.com/benyap/firestore-backfire/commit/f1487e63e9764303fb742d5a269240997eea5006))
* **deps:** update dependency firebase-tools to v12.4.2 ([#381](https://github.com/benyap/firestore-backfire/issues/381)) ([3e55211](https://github.com/benyap/firestore-backfire/commit/3e55211cce2ca059a07c7534af9e2786816d3290))
* **deps:** update dependency release-it to v15.10.5 ([#369](https://github.com/benyap/firestore-backfire/issues/369)) ([c9baba0](https://github.com/benyap/firestore-backfire/commit/c9baba0255e40106e685ab5f00720bb9d0854ac4))
* **deps:** update dependency release-it to v15.11.0 ([#374](https://github.com/benyap/firestore-backfire/issues/374)) ([7385043](https://github.com/benyap/firestore-backfire/commit/7385043447d6d7f405d37cc2cf2587edf89d139b))
* **deps:** update dependency typescript to v5.1.3 ([#367](https://github.com/benyap/firestore-backfire/issues/367)) ([a81c975](https://github.com/benyap/firestore-backfire/commit/a81c97528679fab943b384d61e63405c638535a2))
* **deps:** update dependency typescript to v5.1.6 ([#387](https://github.com/benyap/firestore-backfire/issues/387)) ([e3be069](https://github.com/benyap/firestore-backfire/commit/e3be069e1ecee3d43971acd95dc00a55dd672e61))
* **deps:** update dependency vite to v4.3.9 ([#358](https://github.com/benyap/firestore-backfire/issues/358)) ([8573da8](https://github.com/benyap/firestore-backfire/commit/8573da8254a77aea74133771182488f106ce651b))
* **deps:** update vitest monorepo to v0.31.4 ([#363](https://github.com/benyap/firestore-backfire/issues/363)) ([9d4ac02](https://github.com/benyap/firestore-backfire/commit/9d4ac02d7976aaf5a058c138819dcbc7ce0e82a1))
* **deps:** update vitest monorepo to v0.32.0 ([#375](https://github.com/benyap/firestore-backfire/issues/375)) ([4b8451f](https://github.com/benyap/firestore-backfire/commit/4b8451fc8371ec600e1c3f0f3a7741b9741216be))
* **deps:** update vitest monorepo to v0.32.4 ([#383](https://github.com/benyap/firestore-backfire/issues/383)) ([28e0cc4](https://github.com/benyap/firestore-backfire/commit/28e0cc4c202c57de5a40985274e346392a63e86f))
* reduce stale job frequency ([caff775](https://github.com/benyap/firestore-backfire/commit/caff775f7e71c353b330e9992a91278e7102fba9))
* update typings ([dc00491](https://github.com/benyap/firestore-backfire/commit/dc004919a354c611095247a9a15da0f990d5920b))

## [2.5.1](https://github.com/benyap/firestore-backfire/compare/2.5.0...2.5.1) (2023-05-22)


### Bug Fixes

* **deps:** update dependency commander to v10.0.1 ([#296](https://github.com/benyap/firestore-backfire/issues/296)) ([9fe0ad8](https://github.com/benyap/firestore-backfire/commit/9fe0ad8720f4ea73d9f062ff7baa4ce60d279afa))


### Internal

* add stale issues workflow ([152cc0e](https://github.com/benyap/firestore-backfire/commit/152cc0e2ea1aed73fd47558a10d0640da97c6f93))
* **deps:** update @types/node to v20.2.3 ([6da4332](https://github.com/benyap/firestore-backfire/commit/6da43325c87fa887c328cd19210a9db67894f3be))
* **deps:** update actions/stale action to v8 ([#350](https://github.com/benyap/firestore-backfire/issues/350)) ([12a0f35](https://github.com/benyap/firestore-backfire/commit/12a0f35ce27a4d29eabe8feb4d8e620a41324c5e))
* **deps:** update aws-sdk-js-v3 monorepo ([#329](https://github.com/benyap/firestore-backfire/issues/329)) ([87a508c](https://github.com/benyap/firestore-backfire/commit/87a508c510fc1cb22b293b380a387055beff8af0))
* **deps:** update aws-sdk-js-v3 monorepo to v3.315.0 ([#299](https://github.com/benyap/firestore-backfire/issues/299)) ([c5b87ef](https://github.com/benyap/firestore-backfire/commit/c5b87ef0ceecdcd8d65af035224f36ace6865f5b))
* **deps:** update aws-sdk-js-v3 monorepo to v3.316.0 ([#304](https://github.com/benyap/firestore-backfire/issues/304)) ([692389e](https://github.com/benyap/firestore-backfire/commit/692389eeba51b7d13754226fef344cb3826413ae))
* **deps:** update aws-sdk-js-v3 monorepo to v3.321.1 ([#312](https://github.com/benyap/firestore-backfire/issues/312)) ([f7a6c4c](https://github.com/benyap/firestore-backfire/commit/f7a6c4cd3237f91e52cef6efd03b7f13dc45919c))
* **deps:** update aws-sdk-js-v3 monorepo to v3.328.0 ([#323](https://github.com/benyap/firestore-backfire/issues/323)) ([84bed61](https://github.com/benyap/firestore-backfire/commit/84bed61307676265151430ab368ddc149742dca7))
* **deps:** update aws-sdk-js-v3 monorepo to v3.335.0 ([#341](https://github.com/benyap/firestore-backfire/issues/341)) ([b04f424](https://github.com/benyap/firestore-backfire/commit/b04f424f0b95f8d3a40498bb73f352f5e93c2ab8))
* **deps:** update commitlint monorepo to v17.6.0 ([#293](https://github.com/benyap/firestore-backfire/issues/293)) ([a2ae159](https://github.com/benyap/firestore-backfire/commit/a2ae159b00c4bf9b2e4be3d16673be0fd24e80c2))
* **deps:** update commitlint monorepo to v17.6.1 ([#295](https://github.com/benyap/firestore-backfire/issues/295)) ([0cbbacb](https://github.com/benyap/firestore-backfire/commit/0cbbacb0503e385fbb1f38447821d51287ae3635))
* **deps:** update commitlint monorepo to v17.6.3 ([#326](https://github.com/benyap/firestore-backfire/issues/326)) ([0903a51](https://github.com/benyap/firestore-backfire/commit/0903a5154e7a52d3130997101f49cda2b4de5e68))
* **deps:** update dependency @aws-sdk/client-s3 to v3.312.0 ([#291](https://github.com/benyap/firestore-backfire/issues/291)) ([a82d35a](https://github.com/benyap/firestore-backfire/commit/a82d35a38fa3c38e20a92a3851fb7b5fb7e586ad))
* **deps:** update dependency @aws-sdk/client-s3 to v3.317.0 ([#307](https://github.com/benyap/firestore-backfire/issues/307)) ([f00038f](https://github.com/benyap/firestore-backfire/commit/f00038fa01f959f9a290f72dfe3404e6ed812dde))
* **deps:** update dependency @google-cloud/storage to v6.10.0 ([#322](https://github.com/benyap/firestore-backfire/issues/322)) ([ca65ccf](https://github.com/benyap/firestore-backfire/commit/ca65ccf13e1b9ba42a5387ff19d12b1c8a21c152))
* **deps:** update dependency @google-cloud/storage to v6.10.1 ([#333](https://github.com/benyap/firestore-backfire/issues/333)) ([7a32584](https://github.com/benyap/firestore-backfire/commit/7a3258401c6c15484baf3e084171447e78160380))
* **deps:** update dependency @swc/core to v1.3.50 ([#292](https://github.com/benyap/firestore-backfire/issues/292)) ([536e328](https://github.com/benyap/firestore-backfire/commit/536e328616b48c7162db95aad726106192d77efd))
* **deps:** update dependency @swc/core to v1.3.51 ([#298](https://github.com/benyap/firestore-backfire/issues/298)) ([ced7b8d](https://github.com/benyap/firestore-backfire/commit/ced7b8dbbff8b7bd2ff882113fe2158fdfb5e7a4)), closes [#300](https://github.com/benyap/firestore-backfire/issues/300) [#296](https://github.com/benyap/firestore-backfire/issues/296) [#294](https://github.com/benyap/firestore-backfire/issues/294) [#295](https://github.com/benyap/firestore-backfire/issues/295) [#299](https://github.com/benyap/firestore-backfire/issues/299)
* **deps:** update dependency @swc/core to v1.3.52 ([#302](https://github.com/benyap/firestore-backfire/issues/302)) ([e482103](https://github.com/benyap/firestore-backfire/commit/e48210319daf31133af1047d88b192a01cecb47f))
* **deps:** update dependency @swc/core to v1.3.53 ([#309](https://github.com/benyap/firestore-backfire/issues/309)) ([4a5b35a](https://github.com/benyap/firestore-backfire/commit/4a5b35a01ab7cf09312f6644e7c0ad8200950d8d))
* **deps:** update dependency @swc/core to v1.3.55 ([#313](https://github.com/benyap/firestore-backfire/issues/313)) ([a811b1a](https://github.com/benyap/firestore-backfire/commit/a811b1aa34b39c69d3bf71d815bbe58e7f4da965))
* **deps:** update dependency @swc/core to v1.3.56 ([#318](https://github.com/benyap/firestore-backfire/issues/318)) ([5a7e42a](https://github.com/benyap/firestore-backfire/commit/5a7e42a5903420d66c1f36732cbc67c0ea579e0e))
* **deps:** update dependency @swc/core to v1.3.57 ([#331](https://github.com/benyap/firestore-backfire/issues/331)) ([a65effe](https://github.com/benyap/firestore-backfire/commit/a65effef30c24d7c5001f77e261061b46b377e52))
* **deps:** update dependency @swc/core to v1.3.58 ([#334](https://github.com/benyap/firestore-backfire/issues/334)) ([083b8b9](https://github.com/benyap/firestore-backfire/commit/083b8b9186817e8f4a58a7d9c9471d852aaa579a))
* **deps:** update dependency @swc/core to v1.3.59 ([#342](https://github.com/benyap/firestore-backfire/issues/342)) ([cd976be](https://github.com/benyap/firestore-backfire/commit/cd976be44ad902d11b9cb1d84ba13b6ed92ea56d))
* **deps:** update dependency @types/node to v18.15.12 ([#303](https://github.com/benyap/firestore-backfire/issues/303)) ([9a1d600](https://github.com/benyap/firestore-backfire/commit/9a1d600a4540987203fada7018d070d0e04d2a02))
* **deps:** update dependency @types/node to v18.15.13 ([#308](https://github.com/benyap/firestore-backfire/issues/308)) ([6efd537](https://github.com/benyap/firestore-backfire/commit/6efd537990d2559d92cd7c8fcc3d157605acfc0f))
* **deps:** update dependency @types/node to v18.16.1 ([#310](https://github.com/benyap/firestore-backfire/issues/310)) ([3fa2746](https://github.com/benyap/firestore-backfire/commit/3fa2746181db5bc6ffc8dcc20d14b9cfa9ed187c))
* **deps:** update dependency @types/node to v18.16.13 ([#336](https://github.com/benyap/firestore-backfire/issues/336)) ([20950da](https://github.com/benyap/firestore-backfire/commit/20950da5926c8023bddf835004bd704cdad26179))
* **deps:** update dependency @types/node to v18.16.14 ([#349](https://github.com/benyap/firestore-backfire/issues/349)) ([cb39470](https://github.com/benyap/firestore-backfire/commit/cb39470447b0fe01717123cc26ed087dfcf4594f))
* **deps:** update dependency @types/node to v18.16.2 ([#316](https://github.com/benyap/firestore-backfire/issues/316)) ([d01b00b](https://github.com/benyap/firestore-backfire/commit/d01b00b60f94c520e2338d9877ce8fe85409963b))
* **deps:** update dependency @types/node to v18.16.3 ([#317](https://github.com/benyap/firestore-backfire/issues/317)) ([4bdd7d7](https://github.com/benyap/firestore-backfire/commit/4bdd7d72359e6da439fa745bf63a24d9b67c5fa0))
* **deps:** update dependency @types/node to v18.16.5 ([#327](https://github.com/benyap/firestore-backfire/issues/327)) ([551e7c7](https://github.com/benyap/firestore-backfire/commit/551e7c7add81f554956adff82dfa2ea6460b0b5b))
* **deps:** update dependency @types/node to v18.16.9 ([#330](https://github.com/benyap/firestore-backfire/issues/330)) ([0cb5669](https://github.com/benyap/firestore-backfire/commit/0cb5669f89181735913a11c043d199cda1e8314d))
* **deps:** update dependency firebase-tools to v11.26.0 ([#290](https://github.com/benyap/firestore-backfire/issues/290)) ([9c7d01e](https://github.com/benyap/firestore-backfire/commit/9c7d01e66b5d8126b083712647718f8fc333f775))
* **deps:** update dependency firebase-tools to v11.27.0 ([#294](https://github.com/benyap/firestore-backfire/issues/294)) ([57aaedd](https://github.com/benyap/firestore-backfire/commit/57aaedd5a58a5dc880e2720526f037cb1f38a612))
* **deps:** update dependency firebase-tools to v11.28.0 ([#301](https://github.com/benyap/firestore-backfire/issues/301)) ([6952d05](https://github.com/benyap/firestore-backfire/commit/6952d050cfab508ced8cde2f0fe27fe8608cfa32))
* **deps:** update dependency firebase-tools to v11.29.1 ([#315](https://github.com/benyap/firestore-backfire/issues/315)) ([ed807b3](https://github.com/benyap/firestore-backfire/commit/ed807b33f87e042c361f402a70930be43c3f6391))
* **deps:** update dependency firebase-tools to v11.30.0 ([#325](https://github.com/benyap/firestore-backfire/issues/325)) ([e6d1ee7](https://github.com/benyap/firestore-backfire/commit/e6d1ee7fa5abc058286f77a2876df38e8367ccde))
* **deps:** update dependency firebase-tools to v12 ([#332](https://github.com/benyap/firestore-backfire/issues/332)) ([9642093](https://github.com/benyap/firestore-backfire/commit/9642093a8270217cc04a9927677603c87a60208b))
* **deps:** update dependency firebase-tools to v12.0.1 ([#338](https://github.com/benyap/firestore-backfire/issues/338)) ([1e19380](https://github.com/benyap/firestore-backfire/commit/1e1938005d11f063c7b9cdfc3ce4c3dc9edf1d7f))
* **deps:** update dependency firebase-tools to v12.1.0 ([#343](https://github.com/benyap/firestore-backfire/issues/343)) ([c1fb49d](https://github.com/benyap/firestore-backfire/commit/c1fb49d61404a8738feff63bff70af0abfdac1d3))
* **deps:** update dependency prettier to v2.8.8 ([#311](https://github.com/benyap/firestore-backfire/issues/311)) ([547697b](https://github.com/benyap/firestore-backfire/commit/547697b4276c977456a1ca998555a6c4265730b1))
* **deps:** update dependency release-it to v15.10.2 ([#319](https://github.com/benyap/firestore-backfire/issues/319)) ([47cfab4](https://github.com/benyap/firestore-backfire/commit/47cfab4dd9d2ad2c7d519fc132dbe53468149024))
* **deps:** update dependency release-it to v15.10.3 ([#321](https://github.com/benyap/firestore-backfire/issues/321)) ([55425ca](https://github.com/benyap/firestore-backfire/commit/55425ca48e8d8f140cb07dfa311b680f0cdab4ec))
* **deps:** update dependency rimraf to v5.0.1 ([#340](https://github.com/benyap/firestore-backfire/issues/340)) ([c35f53c](https://github.com/benyap/firestore-backfire/commit/c35f53cf0dd12f11c5e0e15ebe6c3f3e2ea09dd2))
* **deps:** update dependency vite to v4.2.2 ([#300](https://github.com/benyap/firestore-backfire/issues/300)) ([1944d28](https://github.com/benyap/firestore-backfire/commit/1944d285694ce04a80b68c99803f6db712b8cd69))
* **deps:** update dependency vite to v4.3.0 ([#305](https://github.com/benyap/firestore-backfire/issues/305)) ([e2886ed](https://github.com/benyap/firestore-backfire/commit/e2886eda393e0682f091ba06d740014f67606210))
* **deps:** update dependency vite to v4.3.1 ([#306](https://github.com/benyap/firestore-backfire/issues/306)) ([8779b78](https://github.com/benyap/firestore-backfire/commit/8779b78a94482e4c8fb74e44fdbf8516369a0c6d))
* **deps:** update dependency vite to v4.3.3 ([#314](https://github.com/benyap/firestore-backfire/issues/314)) ([200f611](https://github.com/benyap/firestore-backfire/commit/200f611b8bfd6ede434383ac92806d0b4566bf23))
* **deps:** update dependency vite to v4.3.4 ([#320](https://github.com/benyap/firestore-backfire/issues/320)) ([d66b4d0](https://github.com/benyap/firestore-backfire/commit/d66b4d0c6971cd42ea7fcc59978173840e4519be))
* **deps:** update dependency vite to v4.3.5 ([#328](https://github.com/benyap/firestore-backfire/issues/328)) ([8ae56a8](https://github.com/benyap/firestore-backfire/commit/8ae56a8fb7da477f48b56b3a164ef75d6ee89ad6))
* **deps:** update dependency vite to v4.3.8 ([#335](https://github.com/benyap/firestore-backfire/issues/335)) ([64359d2](https://github.com/benyap/firestore-backfire/commit/64359d2944b6df7ac135a04774de003340cc90f0))
* **deps:** update vitest monorepo to v0.30.1 ([#289](https://github.com/benyap/firestore-backfire/issues/289)) ([f0b35fa](https://github.com/benyap/firestore-backfire/commit/f0b35fa096e0421736e141993f70de1f1d8b3de5))
* **deps:** update vitest monorepo to v0.31.0 ([#324](https://github.com/benyap/firestore-backfire/issues/324)) ([89267f4](https://github.com/benyap/firestore-backfire/commit/89267f4068d19f2a734616deb301b75f32657416))
* **deps:** update vitest monorepo to v0.31.1 ([#339](https://github.com/benyap/firestore-backfire/issues/339)) ([9a22ba9](https://github.com/benyap/firestore-backfire/commit/9a22ba9263ed042ae288640817afc8e2cb76e90f))
* exempt assigned issues from becoming stale ([a1293c8](https://github.com/benyap/firestore-backfire/commit/a1293c80f0791c8ba7084fb89ee513c097c935e4))
* rename workflow file ([b99e2b9](https://github.com/benyap/firestore-backfire/commit/b99e2b97f89fb42c2dab221535b12a18f5012b59))
* update README.md ([40424b8](https://github.com/benyap/firestore-backfire/commit/40424b863f5d2b4771ccf7cc51b148025d8fdd6a))

## [2.5.0](https://github.com/benyap/firestore-backfire/compare/2.4.1...2.5.0) (2023-04-11)


### Features

* add new list and count commands ([efffcc3](https://github.com/benyap/firestore-backfire/commit/efffcc30908c53c99f79b32b89b2ea699a5908b7))


### Bug Fixes

* **deps:** update dependency cosmiconfig to v8.1.0 ([#269](https://github.com/benyap/firestore-backfire/issues/269)) ([cfbcef7](https://github.com/benyap/firestore-backfire/commit/cfbcef7bfa15cf0bd5fc152cc812e1b19130d7c4))
* **deps:** update dependency cosmiconfig to v8.1.3 ([#284](https://github.com/benyap/firestore-backfire/issues/284)) ([4aba290](https://github.com/benyap/firestore-backfire/commit/4aba2907b7cc56ad3fee073979dc95097e8a8c09))
* exit properly when there is an error during exploration ([1863c0d](https://github.com/benyap/firestore-backfire/commit/1863c0d0c8452aed54f177c7174a1384377fcb3c))


### Internal

* **deps:** update aws-sdk-js-v3 monorepo ([#262](https://github.com/benyap/firestore-backfire/issues/262)) ([ce83f0f](https://github.com/benyap/firestore-backfire/commit/ce83f0f2f346c53cb6591527dee11fa2deab4550))
* **deps:** update aws-sdk-js-v3 monorepo to v3.271.0 ([#259](https://github.com/benyap/firestore-backfire/issues/259)) ([920fa94](https://github.com/benyap/firestore-backfire/commit/920fa948b2225257ba6f181adc2e90ecf527640e))
* **deps:** update aws-sdk-js-v3 monorepo to v3.310.0 ([#274](https://github.com/benyap/firestore-backfire/issues/274)) ([994be8f](https://github.com/benyap/firestore-backfire/commit/994be8f4919f04e80117123f7fab4dcf60fd3968))
* **deps:** update commitlint monorepo to v17.4.3 ([#256](https://github.com/benyap/firestore-backfire/issues/256)) ([5dce61c](https://github.com/benyap/firestore-backfire/commit/5dce61cf62f690c1537e88dd0cba99cc3b3d60ba))
* **deps:** update commitlint monorepo to v17.4.4 ([#264](https://github.com/benyap/firestore-backfire/issues/264)) ([f576769](https://github.com/benyap/firestore-backfire/commit/f5767698f69fe38168f70a6cddcfe0d7388b0436))
* **deps:** update dependency @commitlint/cli to v17.5.1 ([#285](https://github.com/benyap/firestore-backfire/issues/285)) ([16992c6](https://github.com/benyap/firestore-backfire/commit/16992c6f5135d8eed067e56ec2f6bf02b64b0676))
* **deps:** update dependency @google-cloud/firestore to v6.4.3 ([#263](https://github.com/benyap/firestore-backfire/issues/263)) ([3b38c24](https://github.com/benyap/firestore-backfire/commit/3b38c2438ad4941b3ad92e4f1fe2824a63ce6cfe))
* **deps:** update dependency @google-cloud/firestore to v6.5.0 ([#278](https://github.com/benyap/firestore-backfire/issues/278)) ([6babb9b](https://github.com/benyap/firestore-backfire/commit/6babb9b3e8e5c22c6276113fea40a61b3688d75f))
* **deps:** update dependency @google-cloud/storage to v6.9.3 ([#260](https://github.com/benyap/firestore-backfire/issues/260)) ([afd8201](https://github.com/benyap/firestore-backfire/commit/afd8201d2ac2c9dfef1d10246930ee5c11384b93))
* **deps:** update dependency @google-cloud/storage to v6.9.5 ([#276](https://github.com/benyap/firestore-backfire/issues/276)) ([8f1fb39](https://github.com/benyap/firestore-backfire/commit/8f1fb3993607ea0c373b217329d167dc5f76deb9))
* **deps:** update dependency @swc/cli to v0.1.62 ([#261](https://github.com/benyap/firestore-backfire/issues/261)) ([9304e17](https://github.com/benyap/firestore-backfire/commit/9304e175f351df39293dbaccef944d2d43cb2c19))
* **deps:** update dependency @swc/core to v1.3.37 ([#267](https://github.com/benyap/firestore-backfire/issues/267)) ([15c08c6](https://github.com/benyap/firestore-backfire/commit/15c08c6ce5e0ca483518e8d20a4de806b8d89328))
* **deps:** update dependency @swc/core to v1.3.49 ([#277](https://github.com/benyap/firestore-backfire/issues/277)) ([931aa45](https://github.com/benyap/firestore-backfire/commit/931aa45bd88a05eb813f6c73fd843f0f6ee467b6))
* **deps:** update dependency @types/node to v18.14.2 ([#265](https://github.com/benyap/firestore-backfire/issues/265)) ([30b6d1b](https://github.com/benyap/firestore-backfire/commit/30b6d1b5cc50a1d26c4dade8948601cab34059de))
* **deps:** update dependency @types/node to v18.15.11 ([#275](https://github.com/benyap/firestore-backfire/issues/275)) ([4277c67](https://github.com/benyap/firestore-backfire/commit/4277c673d653fffadf640ea743615b6335f666f1))
* **deps:** update dependency concurrently to v8 ([#286](https://github.com/benyap/firestore-backfire/issues/286)) ([6593e23](https://github.com/benyap/firestore-backfire/commit/6593e23e9ac175674a22f79be7b969865f52a34d))
* **deps:** update dependency firebase-tools to v11.23.1 ([#258](https://github.com/benyap/firestore-backfire/issues/258)) ([5c84ad9](https://github.com/benyap/firestore-backfire/commit/5c84ad93a733ae38040b1e4492c833d2e61c91f6))
* **deps:** update dependency firebase-tools to v11.24.0 ([#268](https://github.com/benyap/firestore-backfire/issues/268)) ([340b9dc](https://github.com/benyap/firestore-backfire/commit/340b9dca8f3befae7f4f042ecbd692a1a1f557e3))
* **deps:** update dependency firebase-tools to v11.25.3 ([#279](https://github.com/benyap/firestore-backfire/issues/279)) ([66a62cb](https://github.com/benyap/firestore-backfire/commit/66a62cb0abbdae11ec11344cd9eaf8d3154e0442))
* **deps:** update dependency prettier to v2.8.7 ([#282](https://github.com/benyap/firestore-backfire/issues/282)) ([3fcd2b7](https://github.com/benyap/firestore-backfire/commit/3fcd2b7528b991786db76f18cbd6957a8b58d23c))
* **deps:** update dependency release-it to v15.10.1 ([#272](https://github.com/benyap/firestore-backfire/issues/272)) ([8f82eee](https://github.com/benyap/firestore-backfire/commit/8f82eee0a569a038442cb3f6d2f5ddc10ce8006c))
* **deps:** update dependency release-it to v15.6.1 ([#270](https://github.com/benyap/firestore-backfire/issues/270)) ([d8e09f9](https://github.com/benyap/firestore-backfire/commit/d8e09f92eda5c8f66eabdb341ec52367a7ed1b37))
* **deps:** update dependency resolve-tspaths to v0.8.13 ([#283](https://github.com/benyap/firestore-backfire/issues/283)) ([d5cff1b](https://github.com/benyap/firestore-backfire/commit/d5cff1bfa76835ab7b36c7450e1e830f5790b62b))
* **deps:** update dependency rimraf to v4.4.1 ([#273](https://github.com/benyap/firestore-backfire/issues/273)) ([b303293](https://github.com/benyap/firestore-backfire/commit/b303293e4ab56cff387443c7e26d4c62bf6c93af))
* **deps:** update dependency rimraf to v5 ([#287](https://github.com/benyap/firestore-backfire/issues/287)) ([593572b](https://github.com/benyap/firestore-backfire/commit/593572be67c95fe126d16237ae9f0fdfedf88976))
* **deps:** update dependency typescript to v5 ([#288](https://github.com/benyap/firestore-backfire/issues/288)) ([8e15ef0](https://github.com/benyap/firestore-backfire/commit/8e15ef09971c5576d422fc51982e699e4b1adc62))
* **deps:** update dependency vite to v4.1.4 ([#237](https://github.com/benyap/firestore-backfire/issues/237)) ([014f58a](https://github.com/benyap/firestore-backfire/commit/014f58a541d92280d27042ce97e4aea79278d59b))
* **deps:** update dependency vite to v4.2.1 ([#281](https://github.com/benyap/firestore-backfire/issues/281)) ([4309325](https://github.com/benyap/firestore-backfire/commit/43093253c6718a53d151aa6ef98c5ef952ca7d84))
* **deps:** update vitest monorepo to v0.28.5 ([#257](https://github.com/benyap/firestore-backfire/issues/257)) ([897f373](https://github.com/benyap/firestore-backfire/commit/897f3738ff4afdb711761ec775e9aaa84350e6a5))
* **deps:** update vitest monorepo to v0.29.2 ([#271](https://github.com/benyap/firestore-backfire/issues/271)) ([262ebdd](https://github.com/benyap/firestore-backfire/commit/262ebdd0b710a08720633379892cb62bac030906))
* **deps:** update vitest monorepo to v0.30.0 ([#280](https://github.com/benyap/firestore-backfire/issues/280)) ([17a9456](https://github.com/benyap/firestore-backfire/commit/17a9456d00326319252f4b088536f15a8aef428a))
* improve publish workflow ([9dcf977](https://github.com/benyap/firestore-backfire/commit/9dcf977d953fa1ba2643009d3f9db0a7de8035a5))
* improve workflow ([029ca05](https://github.com/benyap/firestore-backfire/commit/029ca0504ff93ceef4151dce117e5f073101abc4))
* update lockfile ([592b5be](https://github.com/benyap/firestore-backfire/commit/592b5be59a7142791d81ece5f8cf228f00607453))
* update test snapshots ([b2d35a3](https://github.com/benyap/firestore-backfire/commit/b2d35a30d5d10d8bdf03826cb676e974e7919478))

## [2.4.1](https://github.com/benyap/firestore-backfire/compare/v2.4.0...2.4.1) (2023-02-10)


### Bug Fixes

* **deps:** update dependency commander to v10 ([#254](https://github.com/benyap/firestore-backfire/issues/254)) ([9d6959e](https://github.com/benyap/firestore-backfire/commit/9d6959e0d3535d62240e6c6ffefa7e51e4663dc1))


### Internal

* **deps:** update aws-sdk-js-v3 monorepo to v3.267.0 ([#232](https://github.com/benyap/firestore-backfire/issues/232)) ([8a561ca](https://github.com/benyap/firestore-backfire/commit/8a561ca704f1bce4ff09fef5a9c27e484d00363b))
* **deps:** update commitlint monorepo to v17.4.2 ([#245](https://github.com/benyap/firestore-backfire/issues/245)) ([7583d7d](https://github.com/benyap/firestore-backfire/commit/7583d7df2721cd9756f0c1eff4ef886bcf0edfe1))
* **deps:** update dependency @google-cloud/firestore to v6.4.2 ([#246](https://github.com/benyap/firestore-backfire/issues/246)) ([5c72315](https://github.com/benyap/firestore-backfire/commit/5c723157dca4b27c8302084aa0ce2b621bca8a3b))
* **deps:** update dependency @google-cloud/storage to v6.9.2 ([#251](https://github.com/benyap/firestore-backfire/issues/251)) ([1b7ed79](https://github.com/benyap/firestore-backfire/commit/1b7ed79e162b23c96d4c575369d524d502a66ef9))
* **deps:** update dependency @release-it/bumper to v4.0.2 ([#247](https://github.com/benyap/firestore-backfire/issues/247)) ([4a5d501](https://github.com/benyap/firestore-backfire/commit/4a5d501b1c83cc7154cb6eee9633198220f18b67))
* **deps:** update dependency @swc/cli to v0.1.61 ([#242](https://github.com/benyap/firestore-backfire/issues/242)) ([e374c95](https://github.com/benyap/firestore-backfire/commit/e374c95d17c21820612e7ecb59dc58ce47134f6e))
* **deps:** update dependency @swc/core to v1.3.35 ([#236](https://github.com/benyap/firestore-backfire/issues/236)) ([0777d6a](https://github.com/benyap/firestore-backfire/commit/0777d6ae665f2861aa7c1926e47061972f193731))
* **deps:** update dependency @types/node to v18.13.0 ([#235](https://github.com/benyap/firestore-backfire/issues/235)) ([4a2ab7d](https://github.com/benyap/firestore-backfire/commit/4a2ab7d3bb78603163d9d4d26cd4ead5d35f21fa))
* **deps:** update dependency firebase-tools to v11.22.0 ([#205](https://github.com/benyap/firestore-backfire/issues/205)) ([30f15ef](https://github.com/benyap/firestore-backfire/commit/30f15ef8d96a17364d7dabbad66524c915cda7d3))
* **deps:** update dependency husky to v8.0.3 ([#244](https://github.com/benyap/firestore-backfire/issues/244)) ([55bfc2b](https://github.com/benyap/firestore-backfire/commit/55bfc2b68dec02385c82c2e006a5f6fb16c0e1a9))
* **deps:** update dependency prettier to v2.8.4 ([#248](https://github.com/benyap/firestore-backfire/issues/248)) ([da63906](https://github.com/benyap/firestore-backfire/commit/da6390621f330c08102d51606a003150c5283c89))
* **deps:** update dependency release-it to v15.6.0 ([#243](https://github.com/benyap/firestore-backfire/issues/243)) ([3863b79](https://github.com/benyap/firestore-backfire/commit/3863b79399e267918fd0ca16aed9185ff97b8348))
* **deps:** update dependency resolve-tspaths to v0.8.7 ([#249](https://github.com/benyap/firestore-backfire/issues/249)) ([750bd1b](https://github.com/benyap/firestore-backfire/commit/750bd1b663be10b44c5ece588506f6049540099a))
* **deps:** update dependency rimraf to v4 ([#253](https://github.com/benyap/firestore-backfire/issues/253)) ([207aade](https://github.com/benyap/firestore-backfire/commit/207aadecf31349569fd76114a3778c41b5560adf))
* **deps:** update dependency typescript to v4.9.5 ([#250](https://github.com/benyap/firestore-backfire/issues/250)) ([b215ecc](https://github.com/benyap/firestore-backfire/commit/b215ecc7e4111bb5b99d41da79945105dfdf6bea))
* **deps:** update dependency vitest to v0.25.6 ([#234](https://github.com/benyap/firestore-backfire/issues/234)) ([66e4019](https://github.com/benyap/firestore-backfire/commit/66e4019615655f3274f0b4cf501f616130fd0cd2))
* **deps:** update dependency vitest to v0.28.4 ([#238](https://github.com/benyap/firestore-backfire/issues/238)) ([8d649e6](https://github.com/benyap/firestore-backfire/commit/8d649e633dabcb8f322cc28db21e4da1e8e63f8d))
* update workflow ([66bbe6a](https://github.com/benyap/firestore-backfire/commit/66bbe6a71c0c154c2d8203bc46aaf66f039ef693))

## [2.4.0](https://github.com/benyap/firestore-backfire/compare/v2.3.0...v2.4.0) (2022-12-08)


### Features

* support using Application Default Credentials with Firestore and GCP ([e868dab](https://github.com/benyap/firestore-backfire/commit/e868dab8bfa78ecfba69e3c57854584c313a305e))


### Bug Fixes

* **deps:** update dependency commander to v9.4.1 ([#210](https://github.com/benyap/firestore-backfire/issues/210)) ([4055150](https://github.com/benyap/firestore-backfire/commit/405515016912a9d5c037af87875c02bc2dd3e0cc))
* **deps:** update dependency cosmiconfig to v8 ([#228](https://github.com/benyap/firestore-backfire/issues/228)) ([f218ea1](https://github.com/benyap/firestore-backfire/commit/f218ea138a1033f9ec1cece1676baa6320bb1d32))
* **deps:** update dependency exceptional-errors to v0.3.3 ([#186](https://github.com/benyap/firestore-backfire/issues/186)) ([2cce5b4](https://github.com/benyap/firestore-backfire/commit/2cce5b40652519202842705ea3e18119e8d791e1))
* **deps:** update dependency regenerator-runtime to v0.13.11 ([#219](https://github.com/benyap/firestore-backfire/issues/219)) ([7c12d7f](https://github.com/benyap/firestore-backfire/commit/7c12d7f7f158e17db57010904570549fdcffdf98))
* missing type constraint ([0a605f7](https://github.com/benyap/firestore-backfire/commit/0a605f7b88febe61b45540df1dc55590152e99f6))


### Internal

* add renovate.json ([13ae41c](https://github.com/benyap/firestore-backfire/commit/13ae41c7591b92bc8c4cb936e120153ba1aa36e1))
* **deps:** update actions/checkout action to v3 ([#200](https://github.com/benyap/firestore-backfire/issues/200)) ([91178de](https://github.com/benyap/firestore-backfire/commit/91178debabded7f8e4dc163dde2048946a887738))
* **deps:** update actions/setup-node action to v3 ([#201](https://github.com/benyap/firestore-backfire/issues/201)) ([71916ff](https://github.com/benyap/firestore-backfire/commit/71916ffdf64008a9011c0c8d1adad161522c5ab4))
* **deps:** update aws-sdk-js-v3 monorepo ([#214](https://github.com/benyap/firestore-backfire/issues/214)) ([9f8d3f6](https://github.com/benyap/firestore-backfire/commit/9f8d3f6d0a9142c5f1758f34b60c8dc66a5a2ec9))
* **deps:** update aws-sdk-js-v3 monorepo to v3.171.0 ([#188](https://github.com/benyap/firestore-backfire/issues/188)) ([28c5dc2](https://github.com/benyap/firestore-backfire/commit/28c5dc2c1078a4dfd47ed11ff7d85cdc779b1b52))
* **deps:** update aws-sdk-js-v3 monorepo to v3.183.0 ([#207](https://github.com/benyap/firestore-backfire/issues/207)) ([053a133](https://github.com/benyap/firestore-backfire/commit/053a133f82dc1661d6b746b913ef22f05be70494))
* **deps:** update commitlint monorepo ([#189](https://github.com/benyap/firestore-backfire/issues/189)) ([4a6fcd8](https://github.com/benyap/firestore-backfire/commit/4a6fcd88ae65a17b7a181a545613ad15b881773f))
* **deps:** update commitlint monorepo to v17.3.0 ([#222](https://github.com/benyap/firestore-backfire/issues/222)) ([fcf38dd](https://github.com/benyap/firestore-backfire/commit/fcf38dd1120629ec625fdb399b2de97dafafa235))
* **deps:** update dependency @google-cloud/firestore to v6.2.0 ([#190](https://github.com/benyap/firestore-backfire/issues/190)) ([5b4427e](https://github.com/benyap/firestore-backfire/commit/5b4427e4abda767e3c670904d9f802c209f34336))
* **deps:** update dependency @google-cloud/firestore to v6.4.1 ([#208](https://github.com/benyap/firestore-backfire/issues/208)) ([8c7b810](https://github.com/benyap/firestore-backfire/commit/8c7b81063125d74b3b396c94d1b1d139fbada138))
* **deps:** update dependency @google-cloud/storage to v6.5.0 ([#191](https://github.com/benyap/firestore-backfire/issues/191)) ([af33bb0](https://github.com/benyap/firestore-backfire/commit/af33bb0a76d861b462a7a4fd5492667f9fd3ad2c))
* **deps:** update dependency @release-it/conventional-changelog to v5.1.1 ([#217](https://github.com/benyap/firestore-backfire/issues/217)) ([9bde343](https://github.com/benyap/firestore-backfire/commit/9bde343dd833b2e087efdd48c05eb944636801f8))
* **deps:** update dependency @swc/core to v1.3.1 ([#192](https://github.com/benyap/firestore-backfire/issues/192)) ([d53bffa](https://github.com/benyap/firestore-backfire/commit/d53bffa32620591bebef90b3c869d93fa0d506f2))
* **deps:** update dependency @swc/core to v1.3.19 ([#202](https://github.com/benyap/firestore-backfire/issues/202)) ([1b6e993](https://github.com/benyap/firestore-backfire/commit/1b6e9931e8c72449718d0e90aeccc3344cd90731))
* **deps:** update dependency @swc/core to v1.3.21 ([#220](https://github.com/benyap/firestore-backfire/issues/220)) ([f22bd9d](https://github.com/benyap/firestore-backfire/commit/f22bd9d320f29502de387d32bbd963f0f1f34418))
* **deps:** update dependency @types/node to v18.11.11 ([#223](https://github.com/benyap/firestore-backfire/issues/223)) ([ca8dddf](https://github.com/benyap/firestore-backfire/commit/ca8dddf8cbef836005036b78f8cafd2f594b18dc))
* **deps:** update dependency all-contributors-cli to v6.20.4 ([#185](https://github.com/benyap/firestore-backfire/issues/185)) ([c5f3453](https://github.com/benyap/firestore-backfire/commit/c5f34532b1f0a4c21487cf07a71cf909b81764a6))
* **deps:** update dependency all-contributors-cli to v6.22.0 ([#206](https://github.com/benyap/firestore-backfire/issues/206)) ([a5eb9a0](https://github.com/benyap/firestore-backfire/commit/a5eb9a00283093412d7c7e4750b38941e873f666))
* **deps:** update dependency all-contributors-cli to v6.24.0 ([#213](https://github.com/benyap/firestore-backfire/issues/213)) ([5cdd69e](https://github.com/benyap/firestore-backfire/commit/5cdd69eb7b2e01983058070e179447d3ba6d2bdd))
* **deps:** update dependency concurrently to v7.4.0 ([#193](https://github.com/benyap/firestore-backfire/issues/193)) ([05d52fc](https://github.com/benyap/firestore-backfire/commit/05d52fc5b07e787cf7a7e29948490fc7fe63af77))
* **deps:** update dependency concurrently to v7.6.0 ([#224](https://github.com/benyap/firestore-backfire/issues/224)) ([62f3a34](https://github.com/benyap/firestore-backfire/commit/62f3a341b9b3dddd411797599d44ca20edd5b18b))
* **deps:** update dependency firebase-tools to v11.9.0 ([#194](https://github.com/benyap/firestore-backfire/issues/194)) ([e825428](https://github.com/benyap/firestore-backfire/commit/e8254288525cb68a3e7a0f7f5f108f41189eadae))
* **deps:** update dependency husky to v8.0.2 ([#221](https://github.com/benyap/firestore-backfire/issues/221)) ([6da6b6d](https://github.com/benyap/firestore-backfire/commit/6da6b6dc9a4a187a8c0a91baa2f9d889f7385288))
* **deps:** update dependency prettier to v2.8.1 ([#225](https://github.com/benyap/firestore-backfire/issues/225)) ([655faeb](https://github.com/benyap/firestore-backfire/commit/655faeb1260b8580ad7a96758cdc2eb593fbd62d))
* **deps:** update dependency release-it to v15.4.2 ([#195](https://github.com/benyap/firestore-backfire/issues/195)) ([2491111](https://github.com/benyap/firestore-backfire/commit/2491111bb6a4825b5bb25cd5975c83545ea17804))
* **deps:** update dependency release-it to v15.4.3 ([#211](https://github.com/benyap/firestore-backfire/issues/211)) ([6ba8647](https://github.com/benyap/firestore-backfire/commit/6ba8647d0c1c01856f94c1eeef98c0e7ba6a0b4e))
* **deps:** update dependency release-it to v15.5.0 ([#212](https://github.com/benyap/firestore-backfire/issues/212)) ([731360d](https://github.com/benyap/firestore-backfire/commit/731360da836fc27ef849d0be48c07f63a12b9d4c))
* **deps:** update dependency release-it to v15.5.1 ([#230](https://github.com/benyap/firestore-backfire/issues/230)) ([c8e5eed](https://github.com/benyap/firestore-backfire/commit/c8e5eeda5956d1d33f114d5552a997af1d66c692))
* **deps:** update dependency resolve-tspaths to v0.8.0 ([#196](https://github.com/benyap/firestore-backfire/issues/196)) ([6df71dd](https://github.com/benyap/firestore-backfire/commit/6df71dde9251d52f10777d5148c5bf7135dce362))
* **deps:** update dependency resolve-tspaths to v0.8.3 ([#218](https://github.com/benyap/firestore-backfire/issues/218)) ([9932e9d](https://github.com/benyap/firestore-backfire/commit/9932e9d77588ec7802e9e9705cd818d9d840b019))
* **deps:** update dependency typescript to v4.8.3 ([#197](https://github.com/benyap/firestore-backfire/issues/197)) ([d097b70](https://github.com/benyap/firestore-backfire/commit/d097b7060c717cf7701751a2529de90c3ac9638c))
* **deps:** update dependency vite to v3.1.2 ([#198](https://github.com/benyap/firestore-backfire/issues/198)) ([bf1d968](https://github.com/benyap/firestore-backfire/commit/bf1d968f8fe792858b2b6f3216e6fea61df00b73))
* **deps:** update dependency vite to v3.1.4 ([#203](https://github.com/benyap/firestore-backfire/issues/203)) ([85560cb](https://github.com/benyap/firestore-backfire/commit/85560cb0cbc2bee3d9c5b5cc1a908e9410692347))
* **deps:** update dependency vite to v3.2.4 ([#215](https://github.com/benyap/firestore-backfire/issues/215)) ([2fa998e](https://github.com/benyap/firestore-backfire/commit/2fa998ead7bee2494de3de3e2705610071da49fd))
* **deps:** update dependency vite to v3.2.5 ([#231](https://github.com/benyap/firestore-backfire/issues/231)) ([84b62e0](https://github.com/benyap/firestore-backfire/commit/84b62e0e8fc10732c95a9e5eae62595980425740))
* **deps:** update dependency vitest to v0.23.4 ([#199](https://github.com/benyap/firestore-backfire/issues/199)) ([d76a684](https://github.com/benyap/firestore-backfire/commit/d76a68441d7f4f151fef470b98940c6681b2244b))
* **deps:** update dependency vitest to v0.25.5 ([#226](https://github.com/benyap/firestore-backfire/issues/226)) ([62fbcc5](https://github.com/benyap/firestore-backfire/commit/62fbcc52708fa1e6ee6dfb6ef459358b653ff4d5))
* **deps:** upgrade dependencies ([7c5a2f8](https://github.com/benyap/firestore-backfire/commit/7c5a2f8a152fd83e587394eb42c050a92668db5b))
* remove `all-contributors-cli` and `cross-env` (unused) ([6d93f94](https://github.com/benyap/firestore-backfire/commit/6d93f944048b38942f6d35560248be38b7a0c3a2))
* update README ([b03d417](https://github.com/benyap/firestore-backfire/commit/b03d4179f987b07137b44dec39558afebf9adad3))
* use `require()` instead of `import()` to check dependencies ([3bb4ba2](https://github.com/benyap/firestore-backfire/commit/3bb4ba220f68774c2e6ddf731d81a2cd51b3c637))

## [2.3.0](https://github.com/benyap/firestore-backfire/compare/v2.2.1...v2.3.0) (2022-09-08)


### Features

* expose functions to serialize and deserialize Firestore documents ([5ad2507](https://github.com/benyap/firestore-backfire/commit/5ad2507c0c13e5d4f47d10c094449cdd27c55320))


### Internal

* ensure serialization function properly removes nested unused fields ([340fde5](https://github.com/benyap/firestore-backfire/commit/340fde523b3f4a8e0bc00f8cc8f19b59dbcc371d))

## [2.2.1](https://github.com/benyap/firestore-backfire/compare/v2.2.0...v2.2.1) (2022-09-04)


### Bug Fixes

* parse remaining data in buffer when import data has no delimeter ([9cc93eb](https://github.com/benyap/firestore-backfire/commit/9cc93ebb0c790c847d30bcea09ef023e54fa03b5))


### Internal

* expose `SerializedFirestoreDocument` and `DeserializedFirestoreDocument` ([aca589e](https://github.com/benyap/firestore-backfire/commit/aca589e7e1f62089187a34359950690ca39e8f92))
* make `IDataSourceReader.open()` optional ([6da5cbe](https://github.com/benyap/firestore-backfire/commit/6da5cbef05a940ad105b40cfce05e2301de66ee5))
* update release name ([ffa7820](https://github.com/benyap/firestore-backfire/commit/ffa782031326fa33528150bfc17e2f96c9ecaaa5))

## [2.2.0](https://github.com/benyap/firestore-backfire/compare/v2.1.0...v2.2.0) (2022-09-02)


### Features

* explore subcollections in parallel to improve performance ([5f4d9c4](https://github.com/benyap/firestore-backfire/commit/5f4d9c4f45ffaa7f70b0bc643d75166cd63d6ad5))
* increase `exploreChunkSize` default to 5000 ([5a628f9](https://github.com/benyap/firestore-backfire/commit/5a628f9b6198abb13d7fd2929f90f8b0e8e4743c))


### Internal

* pad duration format string with zeroes ([4c71504](https://github.com/benyap/firestore-backfire/commit/4c7150424e77df8b33584eee37fb6d599e350e1d))

## [2.1.0](https://github.com/benyap/firestore-backfire/compare/v2.0.3...v2.1.0) (2022-08-24)


### Features

* add `processLimit` option to limit concurrent writes when importing ([9a9931b](https://github.com/benyap/firestore-backfire/commit/9a9931b1c2d0f20495638850f275a1adcfaf5cfc))
* use stream() to download documents for better efficiency (thanks [@anderjf](https://github.com/anderjf)) ([0aa2b0e](https://github.com/benyap/firestore-backfire/commit/0aa2b0e7f7480947d39ced6a520c298b0cdb2be3))


### Internal

* add all-contributors ([75e2096](https://github.com/benyap/firestore-backfire/commit/75e209607c395e5082b205140f8fc4ac5f9792db))
* update tests ([a4d651b](https://github.com/benyap/firestore-backfire/commit/a4d651b8c626afa7b9d0e05ca8350bdc63a460d8))


### Documentation

* add [@anderjf](https://github.com/anderjf) as a contributor ([d79a7b0](https://github.com/benyap/firestore-backfire/commit/d79a7b0171a4fbe3dfab313e601513a745ab5814))

## [2.0.3](https://github.com/benyap/firestore-backfire/compare/v2.0.2...v2.0.3) (2022-08-23)


### Bug Fixes

* decrease exploreInterval and downloadInterval to speed up export ([c05daf4](https://github.com/benyap/firestore-backfire/commit/c05daf433c70712f2d79602088a900378a9d9b2b))
* export not finishing when remaining documents can be exported immediately when using --limit ([753aa41](https://github.com/benyap/firestore-backfire/commit/753aa414a1e0b1aa3ffc5db4d72dbe34d09e1f01))


### Internal

* expose advanced configuration options on CLI ([9d2a1c3](https://github.com/benyap/firestore-backfire/commit/9d2a1c39b9b737c7a8fd68cc77868a163e954ea1))
* print time in log output ([2194753](https://github.com/benyap/firestore-backfire/commit/21947534022cb0e831d653bb30ec9955ed490d75))
* update README ([05a74b3](https://github.com/benyap/firestore-backfire/commit/05a74b34b0223cb4c3524b52d696b0120afa81ae))

## [2.0.2](https://github.com/benyap/firestore-backfire/compare/v2.0.1...v2.0.2) (2022-08-21)


### Bug Fixes

* do not count failed imports as a successful import ([ba4e0c8](https://github.com/benyap/firestore-backfire/commit/ba4e0c802addd488466ed16042c3d1fc6a02aa6f))

## [2.0.1](https://github.com/benyap/firestore-backfire/compare/v2.0.0...v2.0.1) (2022-08-21)


### Bug Fixes

* export depth should be no limit by default ([9d2ce45](https://github.com/benyap/firestore-backfire/commit/9d2ce454bb8b6f3d063b69bf747eac325b45cbfa))

## [2.0.0](https://github.com/benyap/firestore-backfire/compare/v1.1.1...v2.0.0) (2022-08-21)

Firestore Backfire v2 is a rewrite of v1 to provide a more up to date and extensible design. It provides new and improved functionality, uses NDJSON as the data format, and no longer uses worker threads.

### ⚠ BREAKING CHANGES

* `-p` has been renamed to `-P`
* `-k` has been renamed to `-K`
* `-e` has been renamed to `-E`
* `--patterns` has been renamed to `--match`
* `--workers` has been removed as worker threads are no longer used
* `--logLevel` has been removed, use `--verbose`, `--debug` or `--silent`instead
* `--prettify` has been renamed to `--stringify`
* `--force` has been renamed to `--overwrite`
* `--mode` values have changed to "create", "insert", "overwrite", "merge"
* Import and export file format changed to NDJSON (not backward compatible)

### New features

* New options:
  * `ignore` (`--ignore, -i`) to ignore paths
  * `limit` (`--limit, -l`) to limit number of documents imported/exported
  * `update` (`--update`) to specify the frequency of update messages
  * A few more advanced configuration options
* New commands:
  * `backfire get <path>` to get a document from Firestore
  * `backfire list:documents <path>` to list documents in a collection
  * `backfire list:collections [path]` to list root collections or subcollections
* Support for passing some options as environment variables
  * `GOOGLE_CLOUD_PROJECT`
  * `GOOGLE_APPLICATION_CREDENTIALS`
  * `AWS_PROFILE`
  * `AWS_ACCESS_KEY_ID`
  * `AWS_SECRET_ACCESS_KEY`
  * `AWS_REGION`
* Ability to create custom data sources in Node
* Ability to use an existing Firestore instance in Node

### [1.1.1](https://github.com/benyap/firestore-backfire/compare/v1.1.0...v1.1.1) (2022-01-11)


### Documentation

* fix config example ([29b7787](https://github.com/benyap/firestore-backfire/commit/29b7787dbc3e591e14857d9cc049946a9c832268))


### Tooling

* add docs section to release notes ([efff609](https://github.com/benyap/firestore-backfire/commit/efff609c42b8af340f199391ccf723cd622bc511))

## [1.1.0](https://github.com/benyap/firestore-backfire/compare/v1.0.1...v1.1.0) (2022-01-11)


### Features

* support import/export by path instead of only top level collections ([d49fbd4](https://github.com/benyap/firestore-backfire/commit/d49fbd48c01326683f7b86123e2e7c6861b3f020))


### Bug Fixes

* incorrect import documentation ([f543dca](https://github.com/benyap/firestore-backfire/commit/f543dcaaa0e579eb60684b797679144871c8e6f1))


### Dependencies

* upgrade devDependencies ([2f05e32](https://github.com/benyap/firestore-backfire/commit/2f05e3289daf0e935d22ed52302885a1082dce6c))

### [1.0.1](https://github.com/benyap/firestore-backfire/compare/v1.0.0...v1.0.1) (2022-01-08)


### Bug Fixes

* destructuring error when no config file is present ([2817510](https://github.com/benyap/firestore-backfire/commit/2817510a34f31074287a2bc3c20952ba27d16485))

## [1.0.0](https://github.com/benyap/firestore-backfire/compare/v0.2.1...v1.0.0) (2022-01-08)


### ⚠ BREAKING CHANGES

* rewrite import and export functions using worker threads
* require `@google-cloud/firestore` to be installed as a peer dependency
* require peer dependencies to be installed to support GCP and AWS data sources
* export and import now use JSON format (no more custom `.snapshot` format)

### Features

New options available. See [README](README.md) for more details.

* `--config <path>` specify the path to the config file to use
* `--logLevel <level>` specify the logging output level
* `--prettify` prettify JSON output when exporting
* `--force` overwrite existing data when exporting
* `--mode <write_mode>` specify whether existing documents should be overwritten
* new options for AWS S3 data source
* rename Google Cloud option names
* rename `--concurrency` to `--workers`
* remove `--verbose` and `--json`

Commits:

* add S3 data source and add some new data options ([fc308b1](https://github.com/benyap/firestore-backfire/commit/fc308b191426e8f55c44bb03988846cd4fda6839))
* rewrite import and export functions using worker threads ([75d3b90](https://github.com/benyap/firestore-backfire/commit/75d3b9016abcf32868e4680ec04811e893bb5ff6))


### Internal

* update README ([edabcee](https://github.com/benyap/firestore-backfire/commit/edabcee19ecea83c4f9f6d2c293900f1eb84c4c2))


### Dependencies

* bump @commitlint/cli, @commitlint/config-conventional, @types/node ([5f56879](https://github.com/benyap/firestore-backfire/commit/5f568792840e1a7f33ff79f77da904f8b51ae71f))
* upgrade devDependencies ([4f1afdc](https://github.com/benyap/firestore-backfire/commit/4f1afdc1bc62c7424604dc63b97d0d1e949de2a7))


### Tooling

* add linting and testing frameworks ([649e431](https://github.com/benyap/firestore-backfire/commit/649e43153734787a3620a0913a3028aefa27b9bf))
* clean up tsconfig ([0c69a0a](https://github.com/benyap/firestore-backfire/commit/0c69a0a4b193935ffbd381c8c759123f96b6129f))
* publish package on releases ([351b0f2](https://github.com/benyap/firestore-backfire/commit/351b0f2fca745cc44e9ea4fe481636d2a31bf01f))
* use "deps" prefix for dependencies ([006b4da](https://github.com/benyap/firestore-backfire/commit/006b4da56f15a7bbe6782cd3049a9c6c327866ec))
* update commitlint config ([d90c4e1](https://github.com/benyap/firestore-backfire/commit/d90c4e1d7f1594fc65addb42f37f10582b73e76f))

### [0.2.1](https://github.com/benyap/firestore-backfire/compare/v0.2.0...v0.2.1) (2021-12-15)


### Internal

* update README ([09d6126](https://github.com/benyap/firestore-backfire/commit/09d61260e10399f3a89753c533858f8b8e5cb5f1))

## [0.2.0](https://github.com/benyap/firestore-backfire/compare/v0.1.0...v0.2.0) (2021-12-15)


### ⚠ BREAKING CHANGES

* rename package to firestore-backfire

### Features

* rename package to firestore-backfire ([bf70025](https://github.com/benyap/firestore-backfire/commit/bf70025be37cf39e22fc548c91624af08f121bf7))


### Tooling

* configure dependabot ([d59262a](https://github.com/benyap/firestore-backfire/commit/d59262a9156aa42e8ecbc0c7bc5009a7e6fd7c48))

## [0.1.0](https://github.com/benyap/firestore-backfire/compare/v0.0.11...v0.1.0) (2021-12-15)


### Features

* expose Firestore document types ([e015ee6](https://github.com/benyap/firestore-backfire/commit/e015ee62639f111b2eb3375dcc5ffda64b64ec85))
* make depth and concurrency optional ([3ac8e40](https://github.com/benyap/firestore-backfire/commit/3ac8e401e52a04dad69565de8db3cab15e23e459))


### Bug Fixes

* export index.ts file instead of main.ts for cjs (fixes [#4](https://github.com/benyap/firestore-backfire/issues/4)) ([9b07eb1](https://github.com/benyap/firestore-backfire/commit/9b07eb1d8560728fa8d796333b3240d0ab11ad13))


### Internal

* add emulators for testing ([ea55821](https://github.com/benyap/firestore-backfire/commit/ea55821ce3a0eacc81e98b2972f8a5547865873b))
* update changelog ([c7497dc](https://github.com/benyap/firestore-backfire/commit/c7497dc623d3026bb638352204049dca6b600a17))
* update dependencies ([471dc3d](https://github.com/benyap/firestore-backfire/commit/471dc3dfece34aa0d9a38ff5717f3300d1a09bce))
* upgrade dependencies ([ec16637](https://github.com/benyap/firestore-backfire/commit/ec16637b72d3f0aacdbcfb88ffa7378a475bbae1))
* use release-it instead of standard-version ([9dfb004](https://github.com/benyap/firestore-backfire/commit/9dfb0045acd6966477f7f202c086f1d5cd5402bd))

### [0.0.11](https://github.com/benyap/firestore-backfire/compare/v0.0.10...v0.0.11) (2021-08-10)


### Features

* add import/export from Google Cloud Storage ([6dd9f6a](https://github.com/benyap/firestore-backfire/commit/6dd9f6af8e6ce5e79bdf03fc0833e9350a93e05b))

### [0.0.10](https://github.com/benyap/firestore-backfire/compare/v0.0.9...v0.0.10) (2021-08-04)


### Bug Fixes

* --keyfile not being read from correct directory ([5a435db](https://github.com/benyap/firestore-backfire/commit/5a435db73a411016c3476dc2b2e298b443bf5a57))

### [0.0.9](https://github.com/benyap/firestore-backfire/compare/v0.0.8...v0.0.9) (2021-08-04)


### Bug Fixes

* `JSONArrayReadStream` not reading large JSON files ([5807b23](https://github.com/benyap/firestore-backfire/commit/5807b23e0f442383e1c87a3e4f5ab0ada8d543da))

### [0.0.8](https://github.com/benyap/firestore-backfire/compare/v0.0.7...v0.0.8) (2021-07-31)


### Bug Fixes

* crash when importing from non-existent folder ([803a5cd](https://github.com/benyap/firestore-backfire/commit/803a5cdc2c2ac1446d5c4c9b98128a844d59a94e))

### [0.0.7](https://github.com/benyap/firestore-backfire/compare/v0.0.6...v0.0.7) (2021-07-31)


### Bug Fixes

* make path relative to project root (try again) ([d3b94a2](https://github.com/benyap/firestore-backfire/commit/d3b94a27db9b68eeeccfc74a28c9605b88850776))

### [0.0.6](https://github.com/benyap/firestore-backfire/compare/v0.0.5...v0.0.6) (2021-07-31)


### Features

* export importAction and exportAction from module ([ec0116b](https://github.com/benyap/firestore-backfire/commit/ec0116ba2e65b36c9e2a57ff58c3e363071d26b3))


### Bug Fixes

* make path relative to project root ([aeb6ea6](https://github.com/benyap/firestore-backfire/commit/aeb6ea624d6c800ffbe8a8e584fb33f6a08b6ffd))

### [0.0.5](https://github.com/benyap/firestore-backfire/compare/v0.0.4...v0.0.5) (2021-07-31)


### Internal

* publish on tags ([cd7951c](https://github.com/benyap/firestore-backfire/commit/cd7951c27da779087ff3a1461d608e1867eea346))

### [0.0.4](https://github.com/benyap/firestore-backfire/compare/v0.0.3...v0.0.4) (2021-07-31)


### Internal

* add Github actions config ([9f74abc](https://github.com/benyap/firestore-backfire/commit/9f74abc32f800f1cfc6410c4c416fdd1cd936179))
* fix build configuration ([35c87f0](https://github.com/benyap/firestore-backfire/commit/35c87f03c075903d4282b09906507652b8534a9b))

### [0.0.3](https://github.com/benyap/firestore-backfire/compare/v0.0.2...v0.0.3) (2021-07-31)


### Features

* add ability to import data to Firestore from export files ([af1b9ce](https://github.com/benyap/firestore-backfire/commit/af1b9ce07407eab4938582ea6f6b47cd27557b2d))


### Internal

* update README ([bc06a28](https://github.com/benyap/firestore-backfire/commit/bc06a283683ee866922ae41bc48c90b7166c965e))

### [0.0.2](https://github.com/benyap/firestore-backfire/compare/v0.0.1...v0.0.2) (2021-07-30)


### Features

* add --json flag to export data to local files in JSON format ([1bc2d24](https://github.com/benyap/firestore-backfire/commit/1bc2d24c7a8852a3f9d11139c7a966ff0c279bba))
* make export action a command ([55b4b37](https://github.com/benyap/firestore-backfire/commit/55b4b37cab8cd9990307bb61ec39ceb611642aac))
* rename project to firestore-backfire ([85d9a04](https://github.com/benyap/firestore-backfire/commit/85d9a04598fc1b7a1b91aa5e0062e166e144c3b7))


### Internal

* update dependencies ([2e89758](https://github.com/benyap/firestore-backfire/commit/2e89758c348d59d772a3c5550af2cf5e0c31d2b5))

### 0.0.1 (2021-07-29)


### Features

* back up from Firestore and local emulator to local directory ([2b8a466](https://github.com/benyap/full-firestore-backup/commit/2b8a4668d54ac2b69137a8016cdf492f11eaf73a))


### Tooling

* add development tooling ([c3ae109](https://github.com/benyap/full-firestore-backup/commit/c3ae109a280ba27fbb33cb3b01e059592c5299ab))
