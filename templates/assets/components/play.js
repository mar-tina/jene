import { Shadow, useState } from "../shadow.js";
import { createObjectOnCondition } from "../utils.js";
import { globalProvider, subToComponents } from "../provider.js";
import {
  handleDragStartLoop,
  handleDragStartStmt,
  handleDropOnFunc,
} from "./shared.js";

let state = {
  components: [],
};

export let Play = Shadow("play-el", {
  getInitialState: (self) => {
    return useState(state, self);
  },
  onMount: (self) => {
    subToComponents(self);
  },

  methods: {
    handleDrop: function (e, self) {
      e.preventDefault();
      let data = JSON.parse(e.dataTransfer.getData("module"));
      self.state.components.push(createObjectOnCondition(data.name));
      globalProvider.providers.globalCtx.proxyObject.components =
        self.state.components;
      console.log("Drop it", self.state, globalProvider.providers);
    },

    handleDragover: function (e, self) {
      e.preventDefault();
      console.log("Over");
    },

    loopDragStart: handleDragStartLoop,

    stmtDragStart: handleDragStartStmt,

    handleDropOnFunc,

    handleDragStart: function (e, self) {
      e.preventDefault();
      console.log("Drag start", e);
    },
  },

  template: (self) => /*html*/ `
        <style>
            .container{
                min-height: 80vh;
                border-top: 4px solid black;
                border-left: 4px solid black;
                border-right: 4px solid black;
                border-bottom: 4px solid black;
                border-radius: 3px;
                padding: 20px;
            }
            .func {
              border-left: 3px lightskyblue solid;
              padding: 10px;
              min-height: 150px;
              font-family: "Courier New", Courier, monospace;
              margin-top: 15px;
              margin-bottom: 15px;
              font-weight: 600;
            }

            .stmt {
              border-left: 3px lightgreen solid;
              padding: 10px;
              min-height: 30px;
              font-family: "Courier New", Courier, monospace;
              margin-top: 15px;
              margin-bottom: 15px;
              font-weight: 600;
              background-color: lightgreen;
            }

            .loop {
              border-left: 3px yellow solid;
              padding: 10px;
              min-height: 30px;
              font-family: "Courier New", Courier, monospace;
              margin-top: 15px;
              margin-bottom: 15px;
              font-weight: 600;
              background-color: yellow;
            }
        </style>
        <div @dragover="handleDragover" @dragenter="handleDragStart" @drop="handleDrop" class="container"> 
            ${componentList(self)}
        </div>
    `,
});

let componentList = (ctx) => {
  return `${
    ctx.state.components &&
    ctx.state.components
      .map((x) => {
        if (x.getTypeOf() == "func") {
          return `<div id=${
            x.id
          } class="${x.getTypeOf()}" @drop="handleDropOnFunc" @click="hi" draggable="true">
            ${x.id}${ctx.state.components.length}${x.name}
            ${
              x.declarations &&
              x.declarations
                .map((x) => {
                  return `<div class="${
                    Array.isArray(x) ? x[0].getTypeOf() : x.getTypeOf()
                  }"> ${x.id} </div>`;
                })
                .join("")
            }

          </div>`;
        } else {
          return `<div id=${
            x.id
          } class="${x.getTypeOf()}" draggable="true" @dragstart="${
            x.getTypeOf() == `loop` ? `loopDragStart` : `stmtDragStart`
          }"  >
            ${x.id}${ctx.state.components.length}
          </div>`;
        }
      })
      .join("")
  }
  `;
};
