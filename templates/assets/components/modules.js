import { Shadow, useState } from "../shadow.js";
import { sanitize } from "../utils.js";

import "./mod.js";

export let Modules = Shadow("modules-el", {
  onMount: (self) => {},

  getInitialState: (self) => {
    let state = {
      name: "",
    };
    return useState(state, self);
  },

  methods: {
    handleInput: function (e, self) {
      e.preventDefault();
      let value = sanitize(e.target.value);
      self.setState({ name: value }, false);
    },
  },

  template: (self) => /*html*/ `
    <style>
      .container {
        height: 100vh;
        display: grid;
        grid-template-rows: 60px auto;
      }
      .iname {
        padding: 10px;
        margin: 20px;
        border-radius: 4px;
        border-width: 3px;
      }
      input {
        font-family: "Courier New", Courier, monospace;
        font-weight: 600;
      }
    </style>
    <div class="container">
        <div>
            <input class="iname" @input="handleInput" /> 
        </div>
        <div> 
            <mod-el> </mod-el>  
        </div>
    </div>
  `,
});
