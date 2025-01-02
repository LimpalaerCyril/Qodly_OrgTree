import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';
import { FaPen, FaTrash } from 'react-icons/fa';
import { GrAdd } from 'react-icons/gr';

import { ITreeProps } from './Tree.config';

interface TreeNodeData {
  TN_UID?: string;
  label: string;
  TN_isNew?: boolean;
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
  editable,
}) => {
  const { connect } = useRenderer();
  const [tree, setTree] = useState<any>(null);
  var [data] = useState<TreeNodeData>();
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

  const EditButtonStyle: React.CSSProperties = {
    position: 'relative',
    top: '-8px',
    height: '20px',
    width: '20px',
    fontSize: '12px',
    backgroundColor: '#ffc107',
    borderRadius: '50%',
    boxShadow: '1px 2px 4px #00000022',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const AddButtonStyle: React.CSSProperties = {
    position: 'relative',
    top: '-8px',
    height: '20px',
    width: '20px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    boxShadow: '1px 2px 4px #00000022',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const RemoveButtonStyle: React.CSSProperties = {
    position: 'relative',
    top: '-8px',
    height: '20px',
    width: '20px',
    fontSize: '12px',
    backgroundColor: '#dc3545',
    borderRadius: '50%',
    boxShadow: '1px 2px 4px #00000022',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const removeProcessInfo = (node?: TreeNodeData) => {
    if (!node) return;
    if (!node.TN_isNew)
      delete node.TN_isNew;
    delete node.TN_UID;
    if (node.children) {
      node.children.forEach((child) => removeProcessInfo(child));
    }
  }

  const PhotoNode: FC<{ withPhoto: boolean, photo: string, style?: React.CSSProperties }> = ({ withPhoto, photo, style }) => {
    if (!withPhoto) return null;
    return (<img style={style} src={photo} className='TreeNodeImg' />);
  };

  const AddButtonNode: FC<{ editable: boolean, treeNodeUID?: string, isNew?: boolean, isRoot?: boolean }> = ({ editable, treeNodeUID, isNew, isRoot }) => {
    if (!editable) return null;

    const handleEditClick = (e: React.MouseEvent) => {
      console.log('Edit button clicked');
      e.stopPropagation(); // Empêche la propagation de l'événement

      const editNode = (node?: TreeNodeData) => {
        if (!node) return;
        if (node.TN_UID === treeNodeUID) {
          node.TN_isNew = true;
        }
        if (node.children) {
          node.children.forEach((child) => editNode(child));
        }
      };

      editNode(data);

      const v = ds.getValue<any>();

      v.then((v: any) => {
        removeProcessInfo(data);
        if (typeof v === 'string') {
          ds.setValue<string>(null, JSON.stringify(data));
        }
        else {
          data = data || { label: 'Root' };
          ds.setValue<object>(null, data);
        }
      });
    }

    const handleAddClick = (e: React.MouseEvent) => {
      console.log('Add button clicked');
      e.stopPropagation(); // Empêche la propagation de l'événement

      //Ajoute un enfant au noeud cliqué
      const addNode = (node?: TreeNodeData) => {
        if (!node) return;
        if (node.TN_UID === treeNodeUID) {
          node.children = node.children || [];
          node.children.push({ label: 'New Node', TN_isNew: true });
        }
        if (node.children) {
          node.children.forEach((child) => addNode(child));
        }
      };

      addNode(data);

      const v = ds.getValue<any>();

      v.then((v: any) => {
        removeProcessInfo(data);
        if (typeof v === 'string') {
          ds.setValue<string>(null, JSON.stringify(data));
        }
        else {
          data = data || { label: 'Root' };
          ds.setValue<object>(null, data);
        }
      });
    };

    const handleRemoveClick = (e: React.MouseEvent) => {
      console.log('Remove button clicked');
      e.stopPropagation(); // Empêche la propagation de l'événement

      //Supprime le noeud cliqué
      const removeNode = (node?: TreeNodeData, parent?: TreeNodeData) => {
        if (!node) return;
        if (node.TN_UID === treeNodeUID && parent) {
          const index = parent.children?.findIndex((child) => child.TN_UID === treeNodeUID);
          if (index !== undefined && index !== -1) {
            parent.children?.splice(index, 1);
          }
        }
        if (node.children) {
          node.children.forEach((child) => removeNode(child, node));
        }
      };

      removeNode(data);

      const v = ds.getValue<any>();

      v.then((v: any) => {
        removeProcessInfo(data);
        if (typeof v === 'string') {
          ds.setValue<string>(null, JSON.stringify(data));
        }
        else {
          data = data || { label: 'Root' };
          ds.setValue<object>(null, data);
        }
      });
    }
    const EditBtnNode: FC<{ treeNodeUID?: string, isNew?: boolean }> = ({ treeNodeUID, isNew }) => {
      if (!isNew) {
        return (
          <button className='TreeNodeEditButton' style={EditButtonStyle} data-treenodeuid={treeNodeUID} onClick={handleEditClick}><FaPen /></button>
        );
      }
      return null;
    }

    const RemoveBtnNode: FC<{ treeNodeUID?: string, isRoot?: boolean }> = ({ treeNodeUID, isRoot }) => {
      if (!isRoot) {
        return (
          <button className='TreeNodeRemoveButton' style={RemoveButtonStyle} data-treenodeuid={treeNodeUID} onClick={handleRemoveClick}><FaTrash /></button>
        );
      }
      return null;
    }
    return (
      <div style={{ position: 'relative', bottom: '-10px', height: '0', display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center' }}>
        <EditBtnNode treeNodeUID={treeNodeUID} isNew={isNew} />
        <button className='TreeNodeAddButton' style={AddButtonStyle} data-treenodeuid={treeNodeUID} onClick={handleAddClick}><GrAdd /></button>
        <RemoveBtnNode treeNodeUID={treeNodeUID} isRoot={isRoot} />
      </div>);
  }

  const LabelNode: FC<{ label: string, treeNodeUID?: string, isNew?: boolean, style?: React.CSSProperties }> = ({ label, treeNodeUID, isNew, style }) => {

    const validateEdit = () => (e: React.MouseEvent) => {
      const inputElement = (e.target as HTMLElement).previousSibling as HTMLInputElement;
      const newValue = inputElement.value;

      const updateNodeLabel = (node?: TreeNodeData) => {
        if (!node) return;
        if (node.TN_UID === treeNodeUID) {
          node.label = newValue;
          node.TN_isNew = false;
        }
        if (node.children) {
          node.children.forEach((child) => updateNodeLabel(child));
        }
      };

      updateNodeLabel(data);

      const v = ds.getValue<any>();
      v.then((v: any) => {
        removeProcessInfo(data);
        if (typeof v === 'string') {
          ds.setValue<string>(null, JSON.stringify(data));
        } else {
          data = data || { label: 'Root' };
          ds.setValue<object>(null, data);
        }
      });
    };

    if (isNew) {
      //if new add input field
      label = label || 'New Node';
      return (
        <div style={{ display: 'flex', gap: '5px' }}>
          <input style={style} className='TreeNodeLabel' type='text' defaultValue={label} />
          <button style={{ width: '24px', height: '24px', borderRadius: '5px', backgroundColor: '#28a745', color: 'white' }} className='TreeNodeEditButton' onClick={validateEdit()}>✓</button>
        </div>
      );
    }
    return (
      <div style={style} className='TreeNodeLabel'>{label}</div>
    );
  };

  const StyledNode: FC<{ label: string, color?: string, type?: string, photo?: string, nodeUID?: string, isNew?: boolean, isRoot?: boolean }> = ({ label, color, photo, nodeUID, isNew, isRoot }) => {
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
          <div style={FullContainerStyle} data-uid={nodeUID} className='TreeNode'>
            <PhotoNode withPhoto={withPhoto} photo={photo} style={FullImageStyle} />
            <LabelNode label={label} isNew={isNew} style={FullNameStyle} treeNodeUID={nodeUID} />
            <AddButtonNode editable={editable} treeNodeUID={nodeUID} isRoot={isRoot} isNew={isNew} />
          </div>
        );
      case 'empty': // Empty style with only name
        return (
          <div data-uid={nodeUID} className='TreeNode'>
            <PhotoNode withPhoto={withPhoto} photo={photo} style={emptyImageStyle} />
            <LabelNode label={label} isNew={isNew} treeNodeUID={nodeUID} />
            <AddButtonNode editable={editable} treeNodeUID={nodeUID} isRoot={isRoot} isNew={isNew} />
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
          <div style={DefaultContainerStyle} data-uid={nodeUID} className='TreeNode'>
            <div style={DefaultHeaderStyle}>
              <PhotoNode withPhoto={withPhoto} photo={photo} style={DefaultImageStyle} />
              <LabelNode label={label} isNew={isNew} style={DefaultNameStyle} treeNodeUID={nodeUID} />
            </div>
            <div style={DefaultFooterStyle} className='TreeNodeFooter'></div>
            <AddButtonNode editable={editable} treeNodeUID={nodeUID} isRoot={isRoot} isNew={isNew} />
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
      if (typeof v === 'string') {
        data = JSON.parse(v);
      } else {
        data = JSON.parse(JSON.stringify(v));
      }

      // Add UID to each node
      const addUID = (node?: TreeNodeData) => {
        if (!node) return;
        node.TN_UID = node.TN_UID || Math.random().toString(36).substring(2);
        if (node.children) {
          node.children.forEach((child) => addUID(child));
        }
      };
      addUID(data);

      const TreeNodeRecursive: React.FC<{ node: TreeNodeData, parent?: TreeNodeData }> = ({ node }) => {
        return (
          <TreeNode label={<StyledNode label={node.label} photo={node.photo} nodeUID={node.TN_UID} isNew={node.TN_isNew} />}>
            {node.children &&
              node.children.map((child, index) => (
                <TreeNodeRecursive key={index} node={child} parent={node} />
              ))}
          </TreeNode>
        );
      };

      // Composant principal de l'arbre
      const OrganizationalChart: React.FC = () => {
        data = data || { label: 'Root', TN_isNew: true };
        return (
          <OrgTree
            label={<StyledNode label={data.label} photo={data.photo} nodeUID={data.TN_UID} isNew={data.TN_isNew} isRoot={true} />}
            lineHeight={lineHeight}
            lineWidth={lineWidth}
            lineColor={lineColor}
            lineStyle={lineStyle}
            lineBorderRadius={lineBorderRadius}
            nodePadding={nodePadding}
          >
            {data.children?.map((child, index) => (
              <TreeNodeRecursive key={index} node={child} parent={data} />
            ))}
          </OrgTree>
        );
      };

      setTree(
        <OrganizationalChart />
      );
    };

    listener();

    ds.addListener('changed', listener);

    return () => {
      ds.removeListener('changed', listener);
    };

  }, [ds]);

  if (!tree) return null;

  return (
    <span ref={connect} style={style} className={cn(className, classNames)}>
      <div style={{ paddingBottom: '14px', paddingTop: '14px' }}>
        {tree}
      </div>
    </span>
  );
};

export default Tree;
