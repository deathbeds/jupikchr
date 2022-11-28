import { simpleMarkdownItPlugin } from '@agoose77/jupyterlab-markup';
import { NS, VERSION } from './tokens';

import { Application, IPlugin } from '@lumino/application';
import { Widget } from '@lumino/widgets';

import { ExportMap, IJupyterWidgetRegistry } from '@jupyter-widgets/base';

import type MarkdownIt from 'markdown-it';

export interface IMdItPlugin {
  (md: MarkdownIt): void;
}

let _PLUGIN: IMdItPlugin | null = null;

/**
 * Provides ASCII diagrams in code blocks
 */
export const markdownPlugin = simpleMarkdownItPlugin(NS, {
  id: `pikchr`,
  title: 'pikchr',
  description: 'pikchr diagrams',
  documentationUrls: {
    plugin: 'https://github.com/deathbeds/jupikchr',
    pikchr: 'https://pikchr.org',
  },
  examples: {
    pikchr: `
  \`\`\`pikchr
  arrow right 200% "Markdown" "Source"
  box rad 10px "Markdown" "Formatter" "(markdown.c)" fit
  arrow right 200% "HTML+SVG" "Output"
  arrow <-> down 70% from last box.s
  box same "Pikchr" "Formatter" "(pikchr.c)" fit
  \`\`\`
          `,
  },
  plugin: async () => {
    let cachedPlugin = _PLUGIN;

    if (cachedPlugin !== null) {
      return [cachedPlugin];
    }

    const { initialize } = await import('./render');
    await initialize();
    const { renderPikchrMarkdownIt } = await import('./md-it-plugin');
    let loadedPlugin = (_PLUGIN = renderPikchrMarkdownIt);
    return [loadedPlugin];
  },
});

const widgetPlugin: IPlugin<Application<Widget>, void> = {
  id: `${NS}:widget`,
  requires: [IJupyterWidgetRegistry],
  autoStart: true,
  activate: (_: Application<Widget>, registry: IJupyterWidgetRegistry) => {
    const reg = {
      name: NS,
      version: VERSION,
      exports: async () => {
        const { initialize } = await import('./render');
        await initialize();
        return (await import('./widget')) as ExportMap;
      },
    };
    registry.registerWidget(reg);
  },
};

export default [markdownPlugin, widgetPlugin];
