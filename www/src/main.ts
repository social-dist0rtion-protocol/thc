import App from "./App.svelte";

const target = document.getElementById("app");
let app: App;

if (target) {
  app = new App({
    target,
  });
} else {
  throw "Error: mount point for app doesn't exist.";
}
export default app;
