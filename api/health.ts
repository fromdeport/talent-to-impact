interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

export default function handler(_req: ApiRequest, res: ApiResponse) {
  return res.status(200).json({ ok: true, service: "talent-to-impact", runtime: "vercel" });
}
