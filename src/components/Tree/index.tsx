import config, { ITreeProps } from './Tree.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './Tree.build';
import Render from './Tree.render';

const Tree: T4DComponent<ITreeProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

Tree.craft = config.craft;
Tree.info = config.info;
Tree.defaultProps = config.defaultProps;

export default Tree;
