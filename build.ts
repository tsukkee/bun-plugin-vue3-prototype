import { vuePlugin } from "./bun-vue-plugin";

const result = await Bun.build({
  entrypoints: ['src/main.ts'],
  outdir: './dist',
  plugins: [vuePlugin]
});

console.log('build done', result);

