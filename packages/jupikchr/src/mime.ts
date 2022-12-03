import { Widget } from '@lumino/widgets';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import '../style/index.css';

import { Pikchr } from './pikchr';
import { CSS, DOT_PIKCHR, NAME, NS } from './tokens';

export const MIME_TYPE = 'text/x-pikchr';

export class RenderedPikchr extends Widget implements IRenderMime.IRenderer {
  private _mimeType: string;
  private _pikchr: Pikchr.IPikchr;
  private _lastRendered: IRenderMime.IMimeModel | null = null;
  private _forceImg: boolean | null = null;
  private _fit: boolean = false;

  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this._pikchr = Pikchr.initialize();
  }

  get isImage() {
    return this._forceImg;
  }

  get isFit() {
    return this._fit;
  }

  async toggleImage(): Promise<void> {
    const { _lastRendered } = this;
    if (!_lastRendered) {
      return;
    }
    this._forceImg = !this._forceImg;
    return await this.renderModel(_lastRendered);
  }

  toggleFit() {
    const { parent } = this;
    if (!parent) {
      return;
    }
    this._fit = !this._fit;
    parent.toggleClass(CSS.FIT, this._fit);
  }

  /**
   * Render into this widget's node.
   */
  async renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    this.addClass(CSS.DOCUMENT);
    const pikchr = `${model.data[this._mimeType]}`;
    const meta = (model.metadata[this._mimeType] as any) || {};
    if (this._forceImg != null) {
      meta.tag = this._forceImg ? 'img' : 'svg';
    }
    this.node.innerHTML = await this._pikchr.render({ pikchr, ...meta });
    this._lastRendered = model;
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
      extensions: [DOT_PIKCHR],
      mimeTypes: [MIME_TYPE],
      fileFormat: 'text',
      iconClass: CSS.ICON,
      displayName: NAME,
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
