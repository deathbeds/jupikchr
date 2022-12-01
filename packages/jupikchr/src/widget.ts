import type { IBackboneModelOptions } from '@jupyter-widgets/base';
import { DOMWidgetModel, DOMWidgetView, WidgetView } from '@jupyter-widgets/base';

import { render } from './render';
import { CSS, NS, VERSION } from './tokens';

export class PikchrView extends DOMWidgetView {
  initialize(parameters: WidgetView.IInitializeParameters<PikchrModel>): void {
    super.initialize(parameters);
    const widget = this.luminoWidget || this.pWidget;
    widget.addClass(CSS.WIDGET);
    this.model.on('change:source change:dark change:tag', this.onSourceChange, this);
    this.model.on('change:value', this.onValueChange, this);
  }

  render() {
    super.render();
    this.onSourceChange();
    this.onValueChange();
  }

  onValueChange() {
    this.el.innerHTML = this.model.get('value');
  }

  onSourceChange() {
    const oldSvg = this.model.get('value');
    const newSvg = render(this.model.get('source'), {
      dark: this.model.get('dark'),
      tag: this.model.get('tag'),
    });
    if (oldSvg !== newSvg) {
      this.model.set({ value: newSvg });
      this.touch();
    }
  }
}

export class PikchrModel extends DOMWidgetModel {
  static model_name = 'PikchrModel';
  static model_module = NS;
  static model_module_version = VERSION;

  static view_name = 'PikchrView';
  static view_module = NS;
  static view_module_version = VERSION;

  defaults() {
    return {
      ...super.defaults(),
      _model_name: PikchrModel.model_name,
      _model_module: NS,
      _model_module_version: VERSION,
      _view_name: PikchrModel.view_name,
      _view_module: NS,
      _view_module_version: VERSION,
      source: '',
      value: '',
      dark: null,
    };
  }

  initialize(attributes: Backbone.ObjectHash, options: IBackboneModelOptions) {
    super.initialize(attributes, options);
  }
}
