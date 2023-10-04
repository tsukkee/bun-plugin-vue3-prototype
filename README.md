# BunのVueプラグイン(超簡易版)

```
bun install
bun build.ts
```

したのち、dist/index.htmlをブラウザで開くと、一応src/App.vueが動く。
styleをうまくハンドルできていないほか、何かも最低限の状態。

なお、お試しで書いてみただけで今後活発に開発する予定はありません。

# 参考
BunのPlugin APIはESBuildを参考にしているらしいので[esbuild-plugin-vue3](https://github.com/pipe01/esbuild-plugin-vue3/tree/master)をめちゃくちゃ参考にしています。

---

# Vue plugin for Bun (verrrry early & prototype version)

```
bun install
bun build.ts
```

Run above commands and open dist/index.html in your browser. Then, you can see src/App.vue.
This plugin cannot handle styles correctly and other parts are also very tentative.

And, this is just prototyping for me so I don't have any plans to develop this more.

# Reference
I refer [esbuild-plugin-vue3](https://github.com/pipe01/esbuild-plugin-vue3/tree/master) becuase Bun Plugin API follows ESBuild's one.
