import { Shadow } from "./shadow.js";
import { globalProvider, pubglobalCtx } from "./provider.js";
import "./components/dash.js";
import "./components/header.js";

export let App = Shadow("app-el", {
  onMount: (self) => {
    pubglobalCtx(self);
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
