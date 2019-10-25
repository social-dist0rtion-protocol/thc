//import { version } from "../package.json";
import Router from "svelte-spa-router";
import App from "./App.svelte";
import Solution from "./Solution.svelte";

const routes = {
  "/": App,
  "/solution/:message": Solution
};

new Router({
  target: document.body,
  props: {
    routes: routes
  }
});
