import { Shadow, useState } from "../shadow.js";
import { createObjectOnCondition } from "../utils.js";
import { globalProvider, subToComponents } from "../provider.js";
import {
  handleDragStartLoop,
  handleDragStartStmt,
  handleDropOnFunc,
  matchTypeToFunctionCall,
  checkIfExistsInFunction,
  handleDropOnPlay,
} from "./shared.js";

let state = {
  components: [],
  currentDragged: "",
};

export let Play = Shadow("play-el", {
  getInitialState: (self) => {
    return useState(state, self);
  },
  onMount: (self) => {
    subToComponents(self);
  },

  methods: {
    handleDropOnPlay,
    handleDragover: function (e, self) {
      e.preventDefault();
    },
    hello: handleDragStartStmt,
    loopDragStart: handleDragStartLoop,
    stmtDragStart: handleDragStartStmt,
    handleDropOnFunc,
    handleDragStart: function (e, self) {
      e.preventDefault();
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
        <div @dragover="handleDragover" @dragenter="handleDragStart" @drop="handleDropOnPlay" class="container"> 
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
          } class="${x.getTypeOf()}" @drop="handleDropOnFunc" @dragstart="handleDragStartInFunc"  draggable="true">
            ${x.id}${ctx.state.components.length}${x.name}
            ${
              x.declarations &&
              x.declarations
                .map((x) => {
                  return `<div id="${
                    x.id
                  }" class="${x.getTypeOf()}" @click="hi" draggable="true" @dragstart="${matchTypeToFunctionCall(
                    x.getTypeOf()
                  )}" > ${x.id} </div>`;
                })
                .join("")
            }

          </div>`;
        } else {
          return `<div id=${
            x.id
          } class="${x.getTypeOf()}" draggable="true" @dragstart="${matchTypeToFunctionCall(
            x.getTypeOf()
          )}"  >
            ${x.id}${ctx.state.components.length}
          </div>`;
        }
      })
      .join("")
  }
  `;
};
