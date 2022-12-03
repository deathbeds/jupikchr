import { CommandRegistry } from '@lumino/commands';
import { DisposableDelegate, IDisposable } from '@lumino/disposable';

import { CommandToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';

import { CommandIDs } from './tokens';

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class PikchrDocumentToolbar
  implements DocumentRegistry.IWidgetExtension<any, any>
{
  commands: CommandRegistry;

  constructor(commands: CommandRegistry) {
    this.commands = commands;
  }

  createNew(panel: any, context: DocumentRegistry.IContext<any>): IDisposable {
    const img = new CommandToolbarButton({
      commands: this.commands,
      id: CommandIDs.img,
    });

    const fit = new CommandToolbarButton({
      commands: this.commands,
      id: CommandIDs.fit,
    });

    panel.toolbar.insertItem(8, 'img', img);
    panel.toolbar.insertItem(9, 'fit', fit);

    return new DisposableDelegate(() => {
      fit.dispose();
      img.dispose();
    });
  }
}
