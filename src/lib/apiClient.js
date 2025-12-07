export async function apiPost(path, body) {
  const url = path; 

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    console.error("JSON parse error:", err);
  }

  if (!res.ok) {
    throw new Error(data?.error || "API 요청 실패");
  }

  return data;
}
