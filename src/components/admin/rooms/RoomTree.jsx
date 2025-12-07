import Tree from "rc-tree";
import "rc-tree/assets/index.css";

export default function RoomTree({ data, onSelect }) {

  // 상위카테고리 추출
  const categories = data
    .filter(r => r.depth === 0)
    .sort((a, b) => a.room_no - b.room_no);


    console.log('categories-->' ,categories)

  const treeData = categories.map(cat => {
    const children = data
      .filter(r => r.depth === 1 && String(r.parent_name) === String(cat.room_no))
      .sort((a, b) => a.room_no - b.room_no)
      .map(child => ({
        key: `room-${child.room_no}`,
        title: child.room_name,
        isLeaf: true,   // 하위 객실은 파일 아이콘
        raw: child
      }));

    return {
      key: `cat-${cat.room_no}`,
      title: cat.room_name,
      isLeaf: false,   
      children
    };
  });

  const handleSelect = (keys, info) => {
    if (info.node.raw) {
      onSelect(info.node.raw);
    }
  };

  return (
    <Tree
      treeData={treeData}
      defaultExpandAll
      onSelect={handleSelect}
    />
  );
}
