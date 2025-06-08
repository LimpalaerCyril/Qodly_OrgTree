import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useMemo } from 'react';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';
import { GrAdd } from 'react-icons/gr';
import treeStyle from './Tree.module.css';
import { ITreeProps } from './Tree.config';

const Tree: FC<ITreeProps> = ({ style, className, classNames, lineHeight, lineWidth, lineColor, lineStyle, lineBorderRadius, nodePadding, nodeType, withPhoto, editable, customInfos }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();

  const PhotoNode: FC<{ withPhoto: boolean, photo: string, className?: String }> = ({ withPhoto, photo, className }) => {
    if (!withPhoto) return null;
    return (<img src={photo} className={['TreeNodeImg', className].join(" ")} />);
  };

  const AddButtonNode: FC<{ editable: boolean }> = ({ editable }) => {
    if (!editable) return null;
    return (
      <div className={treeStyle.TN_AddButtonDivStyle}>
        <button className={['TreeNodeAddButton', treeStyle.TN_AddButtonStyle].join(" ")} disabled><GrAdd /></button>
      </div>);
  };

  const CustomInfoNode: FC<{ className?: string }> = ({ className }) => {
    if (!customInfos) return null;
    return (
      <div className={treeStyle.TN_CustomInfoNode}>
        {
          customInfos.map((customInfo, index) => {
            var currentClassName = ['TreeNodeLabel', `TreeNode${customInfo.infoName}`, `TreeNode${customInfo.infoType}`];
            className && currentClassName.push(className);
            return (
              <div key={index} className={currentClassName.join(" ")}>{customInfo.infoName}</div>
            );
          })
        }
      </div >
    );
  };

  const StyledNode: FC<{ label: string, color?: string, type?: string, photo?: string }> = ({ label, color, photo }) => {
    color = color || generateRandomColor();
    photo = photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${color}&color=ffffff&size=64`;

    switch (nodeType) {
      case 'full': //Full style with image and name
        var FullContainerStyle: React.CSSProperties = {
          backgroundColor: `#${color}44`,
          border: `2px ${lineStyle} #${color}`,
        };
        return (
          <div className={['TreeNode', treeStyle.TN_FullContainerStyle].join(" ")} style={FullContainerStyle}>
            <PhotoNode withPhoto={withPhoto} photo={photo} className={treeStyle.TN_FullImageStyle} />
            <div className={['TreeNodeLabel', treeStyle.TN_FullNameStyle].join(" ")}>{label}</div>
            <CustomInfoNode className={treeStyle.TN_FullNameStyle} />
            <AddButtonNode editable={editable} />
          </div>
        );
      case 'empty': // Empty style with only label in a span
        return (
          <div className='TreeNode'>
            <PhotoNode withPhoto={withPhoto} photo={photo} className={treeStyle.TN_EmptyImageStyle} />
            <span className='TreeNodeLabel'>{label}</span>
            <CustomInfoNode />
            <AddButtonNode editable={editable} />
          </div>
        );
      default: //Default style with image and name
        var DefaultFooterStyle: React.CSSProperties = {
          borderBottomColor: `#${color}`,
          borderBottomStyle: lineStyle,
        };
        return (
          <div className={treeStyle.TN_DefaultContainerStyle}>
            <div className={treeStyle.TN_DefaultHeaderStyle}>
              <PhotoNode withPhoto={withPhoto} photo={photo} className={treeStyle.TN_DefaultImageStyle} />
              <div>
                <div className={['TreeNodeLabel', treeStyle.TN_DefaultNameStyle].join(" ")}>{label}</div>
                <CustomInfoNode className={treeStyle.TN_DefaultNameStyle} />
              </div>
            </div>
            <div style={DefaultFooterStyle} className={treeStyle.TN_DefaultFooterStyle}></div>
            <AddButtonNode editable={editable} />
          </div>
        );
    }
  }

  const generateRandomColor = () => {
    const letters = '0123456789ABCDE'; // F is not used to avoid white color
    let color = '';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 15)]; // F is not used to avoid white color so 15 instead of 16
    }
    return color;
  };

  //create the org tree when lineHeight, lineWidth, lineColor, lineStyle, lineBorderRadius, nodePadding or nodeType changes
  var tree = useMemo(() => {
    return (
      <OrgTree
        label={<StyledNode label="Root" />}
        lineColor={lineColor}
        lineWidth={lineWidth}
        lineStyle={lineStyle}
        lineBorderRadius={lineBorderRadius}
        nodePadding={nodePadding}
        lineHeight={lineHeight}
      >
        <TreeNode label={<StyledNode label="Child 1" />}>
          <TreeNode label={<StyledNode label="Grand Child 1" />}>
            <TreeNode label={<StyledNode label="Grand Grand Child 1" />} />
            <TreeNode label={<StyledNode label="Grand Grand Child 2" />} />
          </TreeNode>
          <TreeNode label={<StyledNode label="Grand Child 2" />} />
        </TreeNode>
        <TreeNode label={<StyledNode label="Child 2" />}>
          <TreeNode label={<StyledNode label="Grand Child 3" />} />
          <TreeNode label={<StyledNode label="Grand Child 4" />} />
        </TreeNode>
      </OrgTree >
    );
  }, [lineHeight, lineWidth, lineColor, lineStyle, lineBorderRadius, nodePadding, nodeType, withPhoto, editable, customInfos]);

  return (
    <div ref={connect} style={style} className={cn(classNames, className)}>
      <div style={{ paddingBottom: '14px', paddingTop: '14px' }}>
        {tree}
      </div>
    </div>
  )
};

export default Tree;