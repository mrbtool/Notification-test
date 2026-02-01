import webpush from "web-push";

const subscriptions = [];

const VAPID_PUBLIC = "YOUR_PUBLIC_KEY";
const VAPID_PRIVATE = "YOUR_PRIVATE_KEY";

webpush.setVapidDetails(
  "mailto:test@test.com",
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

export default {
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/subscribe") {
      const sub = await req.json();
      subscriptions.push(sub);
      return new Response("saved");
    }

    if (url.pathname === "/send") {
      const payload = JSON.stringify({
        title: "🔥 Push Working",
        body: "Hello from Cloudflare Worker"
      });

      for (const sub of subscriptions) {
        await webpush.sendNotification(sub, payload);
      }

      return new Response("sent");
    }

    return new Response("ok");
  }
};
