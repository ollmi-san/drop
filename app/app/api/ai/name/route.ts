import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface NameRequest {
  image: string; // dataURL: data:image/jpeg;base64,...
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not set — set it in .env.local to enable AI naming" },
      { status: 503 }
    );
  }

  let body: NameRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.image?.startsWith("data:image/")) {
    return NextResponse.json({ error: "image must be a dataURL" }, { status: 400 });
  }

  const [meta, b64] = body.image.split(",");
  const mediaType = meta.match(/data:(image\/[a-z]+);/)?.[1] ?? "image/jpeg";

  // Call Claude API with vision
  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: b64 },
              },
              {
                type: "text",
                text: `Identifiziere dieses Kleidungsstück auf dem Foto. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt in diesem exakten Format (kein anderer Text):
{"name":"kurzer deutscher Name","nameEn":"short english name","category":"Oberteile|Unterteile|Kleider|Schuhe|Jacken|Accessoires|Hüte|Taschen|Schmuck|Sportswear","confidence":0.0-1.0}`,
              },
            ],
          },
        ],
      }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return NextResponse.json({ error: "Claude API error", detail: err }, { status: 502 });
    }

    const data = await apiRes.json();
    const text = data.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Claude did not return JSON" }, { status: 502 });
    }
    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (e) {
    return NextResponse.json({ error: "Network error", detail: String(e) }, { status: 500 });
  }
}
