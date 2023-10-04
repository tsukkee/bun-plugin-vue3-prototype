import type { BunPlugin } from 'bun';
import { parse, compileScript, compileTemplate, compileStyle, SFCDescriptor, SFCScriptBlock } from '@vue/compiler-sfc';

export const vuePlugin: BunPlugin = {
  name: 'vue',
  target: "browser",
  setup(build) {
    build.onResolve({ filter: /\.vue/ }, (args) => {
      const paramsString = args.path.split('?')[1];
      const params = new URLSearchParams(paramsString);

      const type = params.get('type');

      switch (type) {
        case "script":
          return {
            path: args.path,
            namespace: 'sfc-script',
          };
        case "template":
          return {
            path: args.path,
            namespace: 'sfc-template',
          };
        case "style":
          return {
            path: args.path,
            namespace: 'sfc-style',
          };

        default:
          return;
      }
    });

    let currentId = 0;
    const idMap = new Map<string, string>();
    const descriptorMap = new Map<string, SFCDescriptor>();
    const scriptMap = new Map<string, SFCScriptBlock>();

    build.onLoad({ filter: /.*/, namespace: 'sfc-script' }, async (args) => {
      const path = args.path.split('?')[0];
      const descriptor = descriptorMap.get(path)!;
      const id = idMap.get(path)!;
      const script = scriptMap.get(path)!;

      return {
        contents: script.content,
        loader: 'js'
      }
    });

    build.onLoad({ filter: /.*/, namespace: 'sfc-template' }, async (args) => {
      const path = args.path.split('?')[0];
      const descriptor = descriptorMap.get(path)!;
      const id = idMap.get(path)!;
      const script = scriptMap.get(path)!;

      const template = compileTemplate({
        id,
        scoped: descriptor.styles.some((s) => s.scoped),
        source: descriptor.template!.content,
        filename: args.path,
        compilerOptions: {
          bindingMetadata: script.bindings,
        }
      });

      return {
        contents: template.code,
        loader: 'js'
      }
    });

    build.onLoad({ filter: /.*/, namespace: 'sfc-style' }, async (args) => {
      const path = args.path.split('?')[0];
      const descriptor = descriptorMap.get(path)!;
      const id = idMap.get(path)!;

      const style = compileStyle({
        id,
        scoped: descriptor.styles[0].scoped,
        source: descriptor.styles[0].content,
        filename: args.path,
      })

      return {
        contents: style.code,
        loader: 'file'
      }
    });

    build.onLoad({ filter: /\.vue$/ }, async (args) => {
      const file = Bun.file(args.path);
      const source = await file.text();

      const { descriptor, errors } = parse(source, {
        filename: args.path,
      });
      if (errors.length > 0) {
        console.error(errors);
      }

      descriptorMap.set(args.path, descriptor);

      const id = `data-v-${currentId}`;
      idMap.set(args.path, id);
      currentId++;

      const script = compileScript(descriptor, {id})
      scriptMap.set(args.path, script);

      const src = args.path;
      let code = '';
      if (descriptor.script || descriptor.scriptSetup) {
        code += `import script from "${src}?type=script";`;
      }
      if (descriptor.styles.length > 0) {
        code += `import "${src}?type=style";`;
      }
      if (descriptor.template){
        code += `import { render } from "${src}?type=template";
          script.render = render;
        `;
      }
      code += `export default script;`;

      return {
        contents: code,
        loader: 'js'
      };
    });
  }
}
