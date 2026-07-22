import { supabase } from "../lib/supabase";

export const getMessages = async () => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true });

    console.log("data:", data);
  console.log("error:", error);

  if (error) throw error;

  return data;
};


export const getManagers = async (excludeUserId) => {
  const { data, error } = await supabase
    .from("member")
    .select("id, name, role")
    .in("role", ["admin", "manager"])
    .neq("id", excludeUserId) // 본인제외
    .order("name");

  if (error) throw error;

  return data;
};


// chatApi.js
export const getOrCreateRoom = async (myId, otherId) => {
  // 1. 기존 room 찾기 (순서 상관없이)
  const { data: existing, error: findError } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(
      `and(user1_id.eq.${myId},user2_id.eq.${otherId}),and(user1_id.eq.${otherId},user2_id.eq.${myId})`
    )
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing;

  // 2. 없으면 새로 생성
  const { data: created, error: createError } = await supabase
    .from("chat_rooms")
    .insert({ user1_id: myId, user2_id: otherId })
    .select()
    .single();

  if (createError) throw createError;
  return created;
};

export const getMessagesByRoom = async (roomId) => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const sendMessage = async ({ roomId, senderId, senderName, message }) => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ room_id: roomId, sender_id: senderId, sender_name: senderName, message })
    .select()
    .single();

  if (error) throw error;
  return data;
};