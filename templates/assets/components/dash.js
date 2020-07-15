import { Shadow, useState } from "../shadow.js";
import { subToComponents } from "../provider.js";

import "./modules.js";
import "./play.js";

let state = {
  components: [],
};

export let Dash = Shadow("dash-el", {
  onMount: (self) => {
    subToComponents(self);
  },

  getInitialState: (self) => {
    return useState(state, self);
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
      <div>  </div>
    </div>
  `,
});
