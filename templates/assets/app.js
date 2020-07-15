import { Shadow } from "./shadow.js";
import { globalProvider, pubTodoCtx } from "./provider.js";
import "./components/dash.js";
import "./components/header.js";

export let App = Shadow("app-el", {
  onMount: (self) => {
    pubTodoCtx(self);
    console.log("global provider", globalProvider);
  },

  template: (self) => /*html*/ `
    <style>
      .container {
        height: 100vh;
      }
    </style>
    <div class="container">
      <header-el></header-el>
      <dash-el></dash-el>
    </div>
  `,
});
