import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { RiOrganizationChart } from "react-icons/ri";

import TreeSettings, { BasicSettings } from './Tree.settings';

export default {
  craft: {
    displayName: 'Tree',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(TreeSettings, BasicSettings),
    },
  },
  info: {
    settings: TreeSettings,
    displayName: 'Tree',
    exposed: true,
    icon: RiOrganizationChart,
    events: [
      {
        label: 'On Click',
        value: 'onclick',
      },
      {
        label: 'On Blur',
        value: 'onblur',
      },
      {
        label: 'On Focus',
        value: 'onfocus',
      },
      {
        label: 'On MouseEnter',
        value: 'onmouseenter',
      },
      {
        label: 'On MouseLeave',
        value: 'onmouseleave',
      },
      {
        label: 'On KeyDown',
        value: 'onkeydown',
      },
      {
        label: 'On KeyUp',
        value: 'onkeyup',
      },
    ],
    datasources: {
      accept: ['string'],
    },
  },
  defaultProps: {
    lineHeight: '20px',
    lineWidth: '1px',
    lineColor: '#000',
    lineStyle: 'solid',
    lineBorderRadius: '5px',
    nodePadding: '5px',
    nodeType: 'default',
    withPhoto: true,
    editable: true,
  },
} as T4DComponentConfig<ITreeProps>;

// lineWidth: (default 1px) The width of the Path as a css length
export interface ITreeProps extends webforms.ComponentProps {
  lineHeight: string;
  lineWidth: string;
  lineColor: string;
  lineStyle: "none" | "solid" | "dotted" | "dashed" | "hidden" | "double" | "groove" | "ridge" | "inset" | "outset";
  lineBorderRadius: string;
  nodePadding: string;
  nodeType: "default" | "full" | "empty";
  withPhoto: boolean;
  editable: boolean;
  customInfos: ICustomInfo[];
}

export interface ICustomInfo {
  infoName: string;
  infoType: 'string' | 'number' | 'dateTime' | 'boolean';
}
