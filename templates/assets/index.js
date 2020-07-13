import { FuncObject, DeclarationObject, StackTree } from "./definition.js";
import { createFunctionDef, createVarDef } from "./shared.js";

export let objectContainer = new StackTree();

function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("rand", ev.target.id);
}

export function getRandom() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
}

function ListStackTree() {
  console.log("sjsjd", objectContainer.getAll()[0].getType());
}

export function createObjectOnCondition(cond, idx, parent) {
  switch (cond) {
    case "func":
      console.log("A FUNCTION");
      createFunctionDef(idx);
      break;
    case "string":
      console.log("A VARIABLE");
      createVarDef(parent, idx);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Get the element by id
  const element = document.getElementById("func");
  const elvars = document.getElementById("string");
  // Add the ondragstart event listener
  element.addEventListener("dragstart", dragstart_handler);
  elvars.addEventListener("dragstart", dragstart_handler);

  const container = document.getElementById("playground");
  container.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    var idx = getRandom();
    let func = new FuncObject(idx);
    func.addParams("name,string");
    func.getAll();
    objectContainer.addObject(func);
    ListStackTree();
    createObjectOnCondition(e.dataTransfer.getData("rand"), idx, "playground");
    console.log("DROPPPPEDD", e.dataTransfer.getData("rand"));
  });

  container.addEventListener("dragenter", (e) => {
    e.preventDefault();
    console.log("INNNN");
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    console.log("OVER");
  });
});

export function createElement(id, type) {
  var node = document.createElement(type);
  node.id = id;
  return node;
}
