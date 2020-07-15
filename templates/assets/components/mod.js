import { Shadow, useState } from "../shadow.js";

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
      e.dataTransfer.setData("module", e.target.id);
    },
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
      (
        x
      ) => `<div id="${x[1].type}" class="mod" @dragstart="handleDragStart" draggable="true">
        ${x[1].name}
    </div>
  `
    )
    .join("")}
  `;
};
