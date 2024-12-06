import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useMemo } from 'react';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';

import { ITreeProps } from './Tree.config';

const Tree: FC<ITreeProps> = ({ style, className, classNames, lineHeight, lineWidth, lineColor, lineStyle, lineBorderRadius, nodePadding, nodeType }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();

  const DefaultContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    margin: 'auto',
    backgroundColor: '#0000000a',
    borderRadius: '10px',
  };

  const DefaultHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    boxShadow: '1px 2px 4px #aaa',
    padding: '12px',
    gap: '10px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  };

  const DefaultImageStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  };

  const DefaultNameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: '14px',
  };

  const FullImageStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    margin: 'auto',
  };

  const FullNameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: '14px',
  };

  const StyledNode: FC<{ label: string, color?: string, type?: string, photo?: string }> = ({ label, color, photo }) => {
    color = color || generateRandomColor();
    photo = photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${color}&color=ffffff&size=64`;
    switch (nodeType) {
      case 'full': //Full style with image and name
        var FullContainerStyle: React.CSSProperties = {
          display: 'flex',
          flexDirection: 'column',
          width: 'fit-content',
          margin: 'auto',
          padding: '6px',
          gap: '10px',
          borderRadius: "10px",
          minWidth: '130px',
          backgroundColor: `#${color}44`,
          border: `2px ${lineStyle} #${color}`,
        };
        return (
          <div style={FullContainerStyle}>
            <img style={FullImageStyle} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${color}&color=ffffff&size=64`} alt="" />
            <div style={FullNameStyle}>{label}</div>
          </div>
        );
      case 'empty': // Empty style with only name
        return (
          <div>
            {label}
          </div>
        );
      default: //Default style with image and name
        var DefaultFooterStyle: React.CSSProperties = {
          marginTop: 'auto',
          borderBottomColor: `#${color}`,
          borderBottomStyle: lineStyle,
          borderBottomWidth: '10px',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
        };
        return (
          <div style={DefaultContainerStyle}>
            <div style={DefaultHeaderStyle}>
              <img style={DefaultImageStyle} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${color}&color=ffffff&size=64`} alt="" />
              <div style={DefaultNameStyle}>{label}</div>
            </div>
            <div style={DefaultFooterStyle}></div>
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
  }, [lineHeight, lineWidth, lineColor, lineStyle, lineBorderRadius, nodePadding, nodeType]);

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      {tree}
    </div>
  )
};

export default Tree;