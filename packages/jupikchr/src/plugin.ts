import type MarkdownIt from 'markdown-it';

import {
  IMimeDocumentTracker,
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { ICodeMirror } from '@jupyterlab/codemirror';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import { imageIcon } from '@jupyterlab/ui-components';

import { ExportMap, IJupyterWidgetRegistry } from '@jupyter-widgets/base';

import { simpleMarkdownItPlugin } from '@agoose77/jupyterlab-markup';

import { ICONS } from './icons';
import { RenderedPikchr } from './mime';
import {
  CSS,
  CommandIDs,
  DOT_PIKCHR,
  LAUNCHER_CATEGORY,
  NAME,
  NS,
  PALETTE_CATEGORY,
  VERSION,
} from './tokens';
import { PikchrDocumentToolbar } from './toolbar';

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

    const { renderPikchrMarkdownIt } = await import('./md-it-plugin');
    let loadedPlugin = (_PLUGIN = renderPikchrMarkdownIt);
    return [loadedPlugin];
  },
});

const widgetPlugin: JupyterFrontEndPlugin<void> = {
  id: `${NS}:widget`,
  requires: [IJupyterWidgetRegistry],
  autoStart: true,
  activate: (app: JupyterFrontEnd, registry: IJupyterWidgetRegistry) => {
    const reg = {
      name: NS,
      version: VERSION,
      exports: async () => {
        return (await import('./widget')) as ExportMap;
      },
    };
    registry.registerWidget(reg);
  },
};

/**
 * Initialization data for the jupyterlab_robotmode extension.
 */
const modePlugin: JupyterFrontEndPlugin<void> = {
  id: `${NS}:codemirror`,
  autoStart: true,
  requires: [ICodeMirror],
  activate: async (app: JupyterFrontEnd, codeMirror: ICodeMirror) => {
    const { definePikchrMode } = await import('@deathbeds/codemirror-pikchr');
    definePikchrMode(codeMirror);
  },
};

const filePlugin: JupyterFrontEndPlugin<void> = {
  id: `${NS}:file`,
  autoStart: true,
  optional: [
    ITranslator,
    IFileBrowserFactory,
    ILauncher,
    IMainMenu,
    ICommandPalette,
    IMimeDocumentTracker,
  ],
  activate: (
    app: JupyterFrontEnd,
    translator?: ITranslator,
    browserFactory?: IFileBrowserFactory,
    launcher?: ILauncher,
    menu?: IMainMenu,
    palette?: ICommandPalette,
    mime?: IMimeDocumentTracker
  ) => {
    const { commands, contextMenu } = app;

    const trans = (translator || nullTranslator).load(modePlugin.id);

    commands.addCommand(CommandIDs.createNew, {
      label: (args) =>
        args['isPalette'] || args['isContextMenu']
          ? trans.__('New %1 File', NAME)
          : trans.__('%1 File', NAME),
      caption: trans.__('Create a new %1 file', NAME),
      icon: (args) => (args['isPalette'] ? void 0 : ICONS.P_BOX),
      execute: async (args) => {
        const cwd =
          args['cwd'] ?? browserFactory?.defaultBrowser.model.path ?? undefined;
        const model = await commands.execute('docmanager:new-untitled', {
          path: cwd,
          type: 'file',
          ext: DOT_PIKCHR,
        });
        return commands.execute('docmanager:open', {
          path: model.path,
          factory: NAME,
        });
      },
    });

    // add to the file browser context menu
    contextMenu.addItem({
      command: CommandIDs.createNew,
      args: { isContextMenu: true },
      selector: CSS.CONTEXT_SELECTOR,
      rank: 3,
    });

    function getRenderer(): RenderedPikchr | null {
      if (!mime) {
        return null;
      }
      const { currentWidget } = mime;
      if (!(currentWidget && currentWidget instanceof MainAreaWidget)) {
        return null;
      }
      const { renderer } = currentWidget.content;
      if (!(renderer && renderer instanceof RenderedPikchr)) {
        return null;
      }
      return renderer;
    }

    if (mime) {
      commands.addCommand(CommandIDs.fit, {
        icon: ICONS.FIT,
        caption: trans.__('Toggle fit to container'),
        execute: async (args: any) => getRenderer()?.toggleFit(),
      });
      commands.addCommand(CommandIDs.img, {
        icon: imageIcon,
        caption: trans.__('Toggle image rendering'),
        execute: async (args: any) => getRenderer()?.toggleImage(),
      });
      const toolbar = new PikchrDocumentToolbar(commands);

      app.docRegistry.addWidgetExtension(NAME, toolbar);
    }

    // add to the launcher
    if (launcher) {
      launcher.add({
        command: CommandIDs.createNew,
        category: LAUNCHER_CATEGORY,
        rank: 1,
      });
    }

    // add to the palette
    if (palette) {
      palette.addItem({
        command: CommandIDs.createNew,
        args: { isPalette: true },
        category: PALETTE_CATEGORY,
      });
    }

    // add to the menu
    if (menu) {
      menu.fileMenu.newMenu.addGroup([{ command: CommandIDs.createNew }], 30);
    }
  },
};

export default [markdownPlugin, widgetPlugin, modePlugin, filePlugin];
