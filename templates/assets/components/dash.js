import { Shadow, useState } from "../shadow.js";
import { subToTodos } from "../provider.js";

import "./modules.js";
import "./play.js";

export let Dash = Shadow("dash-el", {
  onMount: (self) => {
    subToTodos(self);
  },

  template: (self) => /*html*/ `
    <style>
      .container {
        display: grid;
        margin: 10px;
        grid-template-columns: 1fr 2fr 1fr;
        grid-gap: 20px;
      }
    </style>
    <div class="container">
      <div>
        <modules-el></modules-el>
      </div>
      <div> <play-el></play-el> </div>
      <div> C </div>
    </div>
  `,
});
