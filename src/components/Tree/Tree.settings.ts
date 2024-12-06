import { ESetting, TSetting } from '@ws-ui/webform-editor';
import { BASIC_SETTINGS, DEFAULT_SETTINGS, load } from '@ws-ui/webform-editor';

const commonSettings: TSetting[] = [
  {
    key: 'lineHeight',
    label: 'Tree line height',
    type: ESetting.TEXT_FIELD,
    defaultValue: '20px',
  },
  {
    key: 'lineWidth',
    label: 'Tree line width',
    type: ESetting.TEXT_FIELD,
    defaultValue: '20px',
  },
  {
    key: 'lineColor',
    label: 'Tree line color',
    type: ESetting.COLOR_PICKER,
    defaultValue: '#000',
  },
  {
    key: 'lineStyle',
    label: 'Tree line style',
    type: ESetting.SELECT,
    defaultValue: 'solid',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Solid', value: 'solid' },
      { label: 'Dotted', value: 'dotted' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Hidden', value: 'hidden' },
      { label: 'Double', value: 'double' },
      { label: 'Groove', value: 'groove' },
      { label: 'Ridge', value: 'ridge' },
      { label: 'Inset', value: 'inset' },
      { label: 'Outset', value: 'outset' },
    ],
  },
  {
    key: 'lineBorderRadius',
    label: 'Tree line border radius',
    type: ESetting.TEXT_FIELD,
    defaultValue: '5px',
  },
  {
    key: 'nodePadding',
    label: 'Tree node padding',
    type: ESetting.TEXT_FIELD,
    defaultValue: '5px',
  },
  {
    key: 'nodeType',
    label: 'Tree node type',
    type: ESetting.SELECT,
    defaultValue: 'default',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Full', value: 'full' },
      { label: 'Empty', value: 'empty' },
    ],
  }
];

const Settings: TSetting[] = [
  {
    key: 'properties',
    label: 'Properties',
    type: ESetting.GROUP,
    components: commonSettings,
  },
  ...DEFAULT_SETTINGS,
];

export const BasicSettings: TSetting[] = [
  ...commonSettings,
  ...load(BASIC_SETTINGS).filter('style.overflow'),
];

export default Settings;
