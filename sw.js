self.addEventListener("push", event => {
  const data = {
    title: "Hello 👋",
    body: "Background notification working!"
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png"
    })
  );
});
