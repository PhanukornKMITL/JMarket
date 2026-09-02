export async function uploadFile(file: File, prefix: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("prefix", prefix);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !json.url) {
    throw new Error(json.error ?? "อัปโหลดไม่สำเร็จ");
  }
  return json.url;
}
