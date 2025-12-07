// /api/deleteUser.js
import { createClient } from "@supabase/supabase-js";
//import {supabase} from "../src/lib/supabase"

export default async function handler(req, res) {
  const { userId } = req.body;

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('userId-->', userId)

  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) {
    console.log("AUTH 삭제 실패:", authError);

    return res.status(400).json({
      success: false,
      step: "auth",
      message: "Auth 계정 삭제 실패 — member 삭제도 진행하지 않음",
      error: authError,
    });
  }


  const { error: memberError } = await supabase
    .from("member")
    .delete()
    .eq("id", userId);

  if (memberError) {
    console.log("member 삭제 실패:", memberError);

    return res.status(400).json({
      success: false,
      step: "member",
      message: "member 삭제 실패 — Auth는 이미 삭제됨!",
      error: memberError,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Auth + member 삭제 완료",
  });
}
