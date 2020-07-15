import { Shadow, useState } from "../shadow.js";

var modules = {
  func: {
    name: "func",
  },

  str: {
    name: "string",
  },

  intr: {
    name: "int",
  },
};

export let Mod = Shadow("mod-el", {
  onMount: () => {},

  getInitialState: (self) => {
    return useState(modules, self);
  },

  methods: (self) => {
    handleDrag = (e) => {
      console.log("DRRRRAAAAAGGGG");
    };
  },

  template: (self) => {
    return `
        ${modList(self)}
    `;
  },
});

let modList = (ctx) => {
  return `${Object.entries(ctx.state)
    .map(
      (x) => `<div draggable="true">
        ${x[1].name}
    </div>
  `
    )
    .join("")}
  `;
};
