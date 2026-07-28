import Tree from "rc-tree";
import "rc-tree/assets/index.css";
import { supabase } from "../../../lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export default function RoomTree({ data, onRoomSelect  }) {

  const queryClient = useQueryClient();


  // 상위카테고리 추출
  const categories = data
    .filter(r => r.depth === 0)
    .sort((a, b) => a.room_no - b.room_no);


  console.log('categories-->', categories)

  const treeData = categories.map(cat => {
    const children = data
      .filter(r => r.depth === 1 && String(r.parent_no) === String(cat.room_no))
      .sort((a, b) => a.room_no - b.room_no)
      .map(child => ({
        key: `room-${child.room_no}`,
        title: (
          <TreeItem
            label={child.room_name}
            onDelete={() => handleDelete(child)}
          />
        ),
        isLeaf: true,   // 하위 객실은 파일 아이콘
        raw: child
      }));

    return {
      key: `cat-${cat.room_no}`,
      title: (
        <TreeItem
          label={cat.room_name}
          onDelete={() => handleDelete(cat)}
        />
      ),
      isLeaf: false,
      raw:cat,
      children
    };
  });

  const handleSelect = (keys, info) => {
    if (info.node.raw) {
      onRoomSelect(info.node.raw);
    }
  };

  const handleDelete = async (room) => {
    const ok = window.confirm(`${room.room_name}를 삭제하시겠습니까?`);
    if (!ok) return;

    if (room.depth === 0) {
      await deleteGroup(room);
    } else {
      await deleteRoom(room);
    }

    queryClient.invalidateQueries(["room"]);
  };


  const deleteRoom = async (room) => {
    const { data: reservations, error: resError } = await supabase
      .from("reservation")
      .select("id")
      .eq("room_no", room.room_no);

    if (resError) {
      console.error("RESERVATION CHECK ERROR:", resError);
      throw resError;
    }

    if (reservations.length > 0) {
      alert("예약이 존재하는 객실은 삭제할 수 없습니다.");
      throw new Error("has reservation");
    }

    console.log('room-no-0-->', room.room_no)
    const { error: imgError } = await supabase
      .from("room_img").delete().eq("room_no", room.room_no);
    if (imgError) {
      console.error("ROOM_IMG DELETE ERROR:", imgError);
      throw imgError;
    }
    const { error: detailError } = await supabase
      .from("room_detail").delete().eq("room_no", room.room_no);

    if (detailError) {
      console.error("ROOM_DETAIL DELETE ERROR:", detailError);
      throw detailError;
    }
    const { error: roomError } = await supabase
      .from("room")
      .delete()
      .eq("room_no", room.room_no);

    if (roomError) {
      console.error("ROOM DELETE ERROR:", roomError);
      alert(roomError.message);
      throw roomError;
    }
  };

  const deleteGroup = async (room) => {

    await supabase
      .from("room_img")
      .delete()
      .eq("room_no", room.room_no);

    // 2. room_detail 삭제
    await supabase
      .from("room_detail")
      .delete()
      .eq("room_no", room.room_no);

    const { data: children } = await supabase
      .from("room")
      .select("room_no")
      .eq("parent_no", room.room_no);

    const childRoomNos = children.map(c => c.room_no);

    if (childRoomNos.length > 0) {
      const { data: reservations } = await supabase
        .from("reservation")
        .select("id")
        .in("room_no", childRoomNos);

      if (reservations.length > 0) {
        alert("하위 객실 중 예약이 존재하여 삭제할 수 없습니다.");
        throw new Error("child has reservation");
      }
    }

    // 하위 객실 삭제
    await supabase
      .from("room")
      .delete()
      .eq("parent_no", room.room_no);

    // 그룹 삭제
    await supabase
      .from("room")
      .delete()
      .eq("room_no", room.room_no);
  };


  return (
    <Tree
      treeData={treeData}
      defaultExpandAll
      onSelect={handleSelect}
    />
  );
}



function TreeItem({ label, onDelete }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginLeft: "3px",

      }}
    >
      <span>{label}</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#ff4d4f",
          fontSize: "14px"
        }}
      >
        ✕
      </button>
    </div>
  );
}
