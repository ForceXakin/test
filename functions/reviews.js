
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === "POST") {
    const { username, content } = await request.json();
    if (!username || !content) return new Response("Missing fields", { status: 400 });

    const review = {
      username,
      content,
      date: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
      timestamp: Date.now()
    };

    let current = await env.REVIEWS.get("data");
    let reviews = current ? JSON.parse(current) : [];
    reviews.unshift(review);
    await env.REVIEWS.put("data", JSON.stringify(reviews.slice(0, 50)));
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  }

  if (request.method === "GET") {
    const data = await env.REVIEWS.get("data");
    return new Response(data || "[]", {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Not found", { status: 404 });
}
