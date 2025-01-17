import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';
import { FaPen, FaTrash } from 'react-icons/fa';
import treeStyle from './Tree.module.css';
import { GrAdd } from 'react-icons/gr';
import { FaCheck } from "react-icons/fa";

import { ITreeProps } from './Tree.config';

interface TreeNodeData {
  TN_UID?: string;
  label: string;
  TN_editing?: boolean;
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
  customInfos,
}) => {
  const { connect } = useRenderer();
  const [tree, setTree] = useState<any>(null);
  var [data] = useState<TreeNodeData>();
  const {
    sources: { datasource: ds },
  } = useSources();

  const removeProcessInfo = (node?: TreeNodeData) => {
    if (!node) return;
    if (!node.TN_editing)
      delete node.TN_editing;
    delete node.TN_UID;
    if (node.children) {
      node.children.forEach((child) => removeProcessInfo(child));
    }
  }

  const PhotoNode: FC<{ withPhoto: boolean, photo: string, className?: String }> = ({ withPhoto, photo, className }) => {
    if (!withPhoto) return null;
    return (<img src={photo} className={['TreeNodeImg', className].join(" ")} />);
  };

  const AddButtonNode: FC<{ editable: boolean, treeNodeUID?: string, isNew?: boolean, isRoot?: boolean }> = ({ editable, treeNodeUID, isNew, isRoot }) => {
    if (!editable) return null;

    const handleEditClick = (e: React.MouseEvent) => {
      console.log('Edit button clicked');
      e.stopPropagation(); // Empêche la propagation de l'événement

      const editNode = (node?: TreeNodeData) => {
        if (!node) return;
        if (node.TN_UID === treeNodeUID) {
          node.TN_editing = true;
        }
        if (node.children) {
          node.children.forEach((child) => editNode(child));
        }
      };

      editNode(data);

      saveData();
    }

    const handleAddClick = (e: React.MouseEvent) => {
      console.log('Add button clicked');
      e.stopPropagation(); // Empêche la propagation de l'événement

      //Ajoute un enfant au noeud cliqué
      const addNode = (node?: TreeNodeData) => {
        if (!node) return;
        if (node.TN_UID === treeNodeUID) {
          node.children = node.children || [];
          node.children.push({ label: 'New', TN_editing: true });
        }
        if (node.children) {
          node.children.forEach((child) => addNode(child));
        }
      };

      addNode(data);

      saveData();
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

      saveData();
    }

    const EditBtnNode: FC<{ treeNodeUID?: string, isNew?: boolean }> = ({ treeNodeUID, isNew }) => {
      if (!isNew) {
        return (
          <button className={['TreeNodeEditButton', treeStyle.TN_EditButtonStyle].join(" ")} data-treenodeuid={treeNodeUID} onClick={handleEditClick}><FaPen /></button>
        );
      }
      return null;
    }

    const RemoveBtnNode: FC<{ treeNodeUID?: string, isRoot?: boolean }> = ({ treeNodeUID, isRoot }) => {
      if (!isRoot) {
        return (
          <button className={['TreeNodeRemoveButton', treeStyle.TN_RemoveButtonStyle].join(" ")} data-treenodeuid={treeNodeUID} onClick={handleRemoveClick}><FaTrash /></button>
        );
      }
      return null;
    }

    const ApproveBtnNode: FC<{ treeNodeUID?: string, isNew?: boolean }> = ({ treeNodeUID, isNew }) => {
      if (isNew) {
        const handleValidateEdit = (e: React.MouseEvent) => {
          console.log('Remove button clicked');
          e.stopPropagation(); // Empêche la propagation de l'événement

          const updateNodeLabel = (node?: TreeNodeData) => {
            if (!node) return;
            const inputElement = document.querySelector(`input.TreeNodeLabelInput[data-nodeUID="${treeNodeUID}"]`);
            let newValue = (inputElement as HTMLInputElement)?.value //Erreur mais ça marche
            if (node.TN_UID === treeNodeUID) {
              node.label = newValue;
              node.TN_editing = false;
            }
            if (node.children) {
              node.children.forEach((child) => updateNodeLabel(child));
            }
          };

          updateNodeLabel(data);

          if (customInfos) {
            const updateNodeCustomInfo = (node?: any) => {
              if (!node) return;
              customInfos.forEach((customInfo) => {
                const inputElement = document.querySelector(`input.TreeNodeCustomInput[data-nodeUID="${treeNodeUID}"][data-customInfo="${customInfo.infoName}"]`);
                let newValue = (inputElement as HTMLInputElement)?.value //Erreur mais ça marche
                if (node.TN_UID === treeNodeUID) {
                  node[customInfo.infoName] = newValue;
                }
              });
              if (node.children) {
                node.children.forEach((child: TreeNodeData) => updateNodeCustomInfo(child));
              }
            };

            updateNodeCustomInfo(data);
          }

          saveData();
        };

        return (
          <button className={['TreeNodeApproveButton', treeStyle.TN_ApproveButtonStyle].join(" ")} data-treenodeuid={treeNodeUID} onClick={handleValidateEdit}><FaCheck /></button>
        );
      }
      return null;
    }
    return (
      <div className={treeStyle.TN_RemoveButtonDivStyle}>
        <EditBtnNode treeNodeUID={treeNodeUID} isNew={isNew} />
        <ApproveBtnNode treeNodeUID={treeNodeUID} isNew={isNew} />
        <button className={['TreeNodeAddButton', treeStyle.TN_AddButtonStyle].join(" ")} data-treenodeuid={treeNodeUID} onClick={handleAddClick}><GrAdd /></button>
        <RemoveBtnNode treeNodeUID={treeNodeUID} isRoot={isRoot} />
      </div>);
  }

  const LabelNode: FC<{ label: string, treeNodeUID?: string, isNew?: boolean, className?: string }> = ({ label, treeNodeUID, isNew, className }) => {

    if (isNew) {
      //if new add input field
      label = label || 'New';
      return (
        <div style={{ display: 'flex', gap: '5px' }}>
          <input className={['TreeNodeLabel', 'TreeNodeLabelInput', className].join(" ")} data-nodeUID={treeNodeUID} type='text' defaultValue={label} />
        </div>
      );
    }
    return (
      <div className={['TreeNodeLabel', className].join(" ")}>{label}</div>
    );
  };

  const CustomInfoNode: FC<{ node: any, treeNodeUID?: string, className?: string, isNew?: boolean }> = ({ node, treeNodeUID, className, isNew }) => {
    if (!customInfos) return null;
    if (isNew) {
      //if new add input field
      return (
        <div className={treeStyle.TN_CustomInfoNode} style={{ marginTop: '10px' }}>
          {customInfos.map((customInfo, index) => {
            return (
              <input key={index} className={['TreeNodeLabel', 'TreeNodeCustomInput', className].join(" ")} data-nodeUID={treeNodeUID} data-customInfo={customInfo.infoName} type={customInfo.infoType} defaultValue={node[customInfo.infoName]} placeholder={customInfo.infoName} />
            );
          })}
        </div>
      );
    }
    return (
      <div className={treeStyle.TN_CustomInfoNode}>
        {customInfos.map((customInfo, index) => {
          return (
            <div key={index} className={['TreeNodeLabel', className].join(" ")}>{node[customInfo.infoName]}</div>
          );
        })}
      </div>
    );
  };

  const StyledNode: FC<{ label: string, node: TreeNodeData, color?: string, type?: string, photo?: string, nodeUID?: string, isNew?: boolean, isRoot?: boolean }> = ({ label, node, color, photo, nodeUID, isNew, isRoot }) => {
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
            <PhotoNode withPhoto={withPhoto} photo={photo} className={treeStyle.TN_FullImageStyle} />
            <LabelNode label={label} isNew={isNew} treeNodeUID={nodeUID} className={treeStyle.TN_FullNameStyle} />
            <CustomInfoNode node={node} treeNodeUID={nodeUID} className={treeStyle.TN_FullNameStyle} isNew={isNew} />
            <AddButtonNode editable={editable} treeNodeUID={nodeUID} isRoot={isRoot} isNew={isNew} />
          </div>
        );
      case 'empty': // Empty style with only name
        return (
          <div data-uid={nodeUID} className='TreeNode'>
            <PhotoNode withPhoto={withPhoto} photo={photo} className={treeStyle.TN_EmptyImageStyle} />
            <LabelNode label={label} isNew={isNew} treeNodeUID={nodeUID} />
            <CustomInfoNode node={node} treeNodeUID={nodeUID} isNew={isNew} />
            <AddButtonNode editable={editable} treeNodeUID={nodeUID} isRoot={isRoot} isNew={isNew} />
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
                <LabelNode label={label} treeNodeUID={nodeUID} isNew={isNew} className={treeStyle.TN_DefaultNameStyle} />
                <CustomInfoNode node={node} treeNodeUID={nodeUID} className={treeStyle.TN_DefaultNameStyle} isNew={isNew} />
              </div>
            </div>
            <div style={DefaultFooterStyle} className={treeStyle.TN_DefaultFooterStyle}></div>
            <AddButtonNode editable={editable} treeNodeUID={nodeUID} isRoot={isRoot} isNew={isNew} />
          </div>
        );
    }
  }

  function saveData() {
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
          <TreeNode label={<StyledNode label={node.label} photo={node.photo} nodeUID={node.TN_UID} isNew={node.TN_editing} node={node} />}>
            {node.children &&
              node.children.map((child, index) => (
                <TreeNodeRecursive key={index} node={child} parent={node} />
              ))}
          </TreeNode>
        );
      };

      // Composant principal de l'arbre
      const OrganizationalChart: React.FC = () => {
        data = data || { label: 'Root', TN_editing: true };
        return (
          <OrgTree
            label={<StyledNode label={data.label} photo={data.photo} nodeUID={data.TN_UID} isNew={data.TN_editing} isRoot={true} node={data} />}
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
