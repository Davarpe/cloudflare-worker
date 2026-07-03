export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.json();

    const githubResponse = await fetch(
      "https://api.github.com/repos/Davarpe/convo/dispatches",
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${env.GH_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event_type: "new_message",
          client_payload: {
            json: JSON.stringify(body),
            timestamp: Date.now()
          }
        })
      }
    );

    if (!githubResponse.ok) {
      return new Response("GitHub error: " + githubResponse.status, {
        status: 500
      });
    }

    return new Response("OK", { status: 200 });
  }
};
