import { Shadow, useState } from "../shadow.js";
import { handleDragStartStmt, handleDragStartLoop } from "./shared.js";

var modules = {
  func: {
    name: "Func",
    type: "func",
  },

  str: {
    name: "Statement",
    type: "stmt",
  },

  intr: {
    name: "Loop",
    type: "loop",
  },
};

export let Mod = Shadow("mod-el", {
  onMount: () => {},

  getInitialState: (self) => {
    return useState(modules, self);
  },

  methods: {
    handleDrop: (e, self) => {
      console.log("DROPPP", e, self.getRootNode().host);
    },

    handleDragStart: (e, self) => {
      var item = {
        name: "func",
        id: e.target.id,
      };
      e.dataTransfer.setData("module", JSON.stringify(item));
      console.log("is a drag", e.target.id);
    },

    handleDragStartStmt: handleDragStartStmt,
    handleDragStartLoop: handleDragStartLoop,
  },

  template: (self) => {
    return `
        <style>
          .mod {
            padding: 10px;
            border-left: 3px solid lightskyblue;
            margin: 10px;
            font-family: "Courier New", Courier, monospace;
            font-weight: 600;
          }
        </style>
        ${modList(self)}
    `;
  },
});

let modList = (ctx) => {
  return `${Object.entries(ctx.state)
    .map(
      (x) => `<div id="${x[1].type}" class="mod" @dragstart="${checkType(
        x[1].type
      )}" draggable="true">
        ${x[1].name}
    </div>
  `
    )
    .join("")}
  `;
};

function checkType(typ) {
  var retval;
  switch (typ) {
    case "stmt":
      retval = "handleDragStartStmt";
      break;
    case "loop":
      retval = "handleDragStartLoop";
      break;
    case "func":
      retval = "handleDragStart";
      break;
  }

  return retval;
}
