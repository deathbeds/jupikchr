import { Widget } from '@lumino/widgets';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { NAME, NS, CSS } from './tokens';

import '../style/index.css';

export const MIME_TYPE = 'text/x-pikchr';

export class RenderedPikchr extends Widget implements IRenderMime.IRenderer {
  private _mimeType: string;

  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
  }

  /**
   * Render into this widget's node.
   */
  async renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const { initialize, render } = await import('./render');
    await initialize();
    this.addClass(CSS.DOCUMENT);
    const data = model.data[this._mimeType];
    const meta = model.metadata[this._mimeType] as any;
    this.node.innerHTML = render(`${data}`, meta);
    this.update();
  }

  /**
   * A message handler invoked on an `'after-show'` message.
   */
  protected onAfterShow(): void {
    this.update();
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(): void {
    this.update();
  }
}

/**
 * A mime renderer factory for data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: false,
  mimeTypes: [MIME_TYPE],
  createRenderer: (options) => new RenderedPikchr(options),
};

const mimePlugin: IRenderMime.IExtension = {
  id: `${NS}:mime`,
  rendererFactory,
  rank: 0,
  dataType: 'string',
  fileTypes: [
    {
      name: NAME,
      extensions: ['.pikchr'],
      mimeTypes: [MIME_TYPE],
      fileFormat: 'text',
      iconClass: CSS.ICON,
    },
  ],
  documentWidgetFactoryOptions: {
    name: NAME,
    primaryFileType: NAME,
    fileTypes: [NAME],
    defaultFor: [NAME],
  },
};

export default [mimePlugin];
