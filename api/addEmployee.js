import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, birth, email } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Invalid data" });
  }

  // 서버에서만 사용할 Supabase Admin Client
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 1) Auth 유저 생성
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: "1111",
      email_confirm: true,
    });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  const userId = authData.user.id;

  // 2) member 테이블 저장
  const { error: memberError } = await supabaseAdmin.from("member").insert([
    {
      id: userId,
      name,
      email,
      phone,
      birth,
      role: "manager",
    },
  ]);

  if (memberError) {

    await supabaseAdmin.auth.admin.deleteUser(userId); // error 떳을시 authentication 에 생성된 데이터 삭제
    return res.status(400).json({ error: memberError.message });
  }

  return res.status(200).json({ success: true });
}
