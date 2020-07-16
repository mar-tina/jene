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
      #search {
        font-family: "Courier New", Courier, monospace;
        font-weight: 600; 
      }
      #wd {
        font-family: "Courier New", Courier, monospace;
        font-weight: 600; 
      }
      #side-content {
        font-family: "Courier New", Courier, monospace;
        font-weight: 600;
      }
    </style>
    <div class="container">
      <div>
        <p id="search"> Search Modules </p>
        <modules-el></modules-el>
      </div>
      <div> 
        <p id="wd"> Working Directory: gen/main.go </p>
        <play-el></play-el>
      </div>
      <div>
        <p id="side-content"> Content and Variables </p>
      </div>
    </div>
  `,
});
