import { LabIcon } from '@jupyterlab/ui-components';

import ALPHA_P_BOX from '../style/img/alpha-p-box.svg';
import FIT_BOX from '../style/img/fit-to-page-outline.svg';

export namespace ICONS {
  export const P_BOX = new LabIcon({ name: 'pikchr:p-box', svgstr: ALPHA_P_BOX });
  export const FIT = new LabIcon({ name: 'pikchr:fit', svgstr: FIT_BOX });
}
