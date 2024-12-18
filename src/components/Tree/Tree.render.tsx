import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';

import { ITreeProps } from './Tree.config';

interface TreeNodeData {
  label: string;
  photo?: string;
  children?: TreeNodeData[];
}

const Tree: FC<ITreeProps> = ({
  style,
  className,
  classNames = [],
  lineHeight,
  lineWidth,
  lineColor,
  lineStyle,
  lineBorderRadius,
  nodePadding,
  nodeType,
  withPhoto,
}) => {
  const { connect } = useRenderer();
  const [tree, setTree] = useState<any>(null);
  const {
    sources: { datasource: ds },
  } = useSources();

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
    boxShadow: '1px 2px 4px #00000022',
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

  const emptyImageStyle: React.CSSProperties = {
    margin: 'auto',
  };

  const FullNameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: '14px',
  };

  const PhotoNode: FC<{ withPhoto: boolean, photo: string, style?: React.CSSProperties }> = ({ withPhoto, photo, style }) => {
    if (!withPhoto) return null;
    return (<img style={style} src={photo} className='TreeNodeImg' />);
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
          <div style={FullContainerStyle} className='TreeNode'>
            <PhotoNode withPhoto={withPhoto} photo={photo} style={FullImageStyle} />
            <div style={FullNameStyle} className='TreeNodeLabel'>{label}</div>
          </div>
        );
      case 'empty': // Empty style with only name
        return (
          <div className='TreeNode'>
            <PhotoNode withPhoto={withPhoto} photo={photo} style={emptyImageStyle} />
            <span className='TreeNodeLabel'>{label}</span>
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
          <div style={DefaultContainerStyle} className='TreeNode'>
            <div style={DefaultHeaderStyle}>
              <PhotoNode withPhoto={withPhoto} photo={photo} style={DefaultImageStyle} />
              <div style={DefaultNameStyle} className='TreeNodeLabel'>{label}</div>
            </div>
            <div style={DefaultFooterStyle} className='TreeNodeFooter'></div>
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

  useEffect(() => {
    if (!ds) return;

    const listener = async (/* event */) => {
      const v = await ds.getValue<any>();
      var data: TreeNodeData;
      if (typeof v === 'string')
        data = JSON.parse(v);
      else
        data = JSON.parse(JSON.stringify(v));

      interface TreeNodeRecursiveProps {
        node: TreeNodeData;
      }
      const TreeNodeRecursive: React.FC<TreeNodeRecursiveProps> = ({ node }) => {
        return (
          <TreeNode label={<StyledNode label={node.label} photo={node.photo} />}>
            {node.children &&
              node.children.map((child, index) => (
                <TreeNodeRecursive key={index} node={child} />
              ))}
          </TreeNode>
        );
      };

      // Composant principal de l'arbre
      const OrganizationalChart: React.FC = () => {
        return (
          <OrgTree
            label={<StyledNode label={data.label} photo={data.photo} />}
            lineHeight={lineHeight}
            lineWidth={lineWidth}
            lineColor={lineColor}
            lineStyle={lineStyle}
            lineBorderRadius={lineBorderRadius}
            nodePadding={nodePadding}
          >
            {data.children?.map((child, index) => (
              <TreeNodeRecursive key={index} node={child} />
            ))}
          </OrgTree>
        );
      };

      setTree(<OrganizationalChart />);
    };

    listener();

    ds.addListener('changed', listener);

    return () => {
      ds.removeListener('changed', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ds]);

  if (!tree) return null;

  return (
    <span ref={connect} style={style} className={cn(className, classNames)}>
      {tree}
    </span>
  );
};

export default Tree;
