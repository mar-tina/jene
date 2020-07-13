import { showVariables } from "./vars.js";
import {
  getRandom,
  createObjectOnCondition,
  objectContainer,
} from "./index.js";
// Create Func DIV.
export function createFunctionDef(idx) {
  var idc = getRandom();
  var temp = document.createElement("div");
  temp.className = "func-def";
  temp.innerHTML = "func-" + idc;
  temp.id = idx;
  temp.contentEditable = true;
  document.getElementById("playground").appendChild(temp);
  temp.ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("something was dropped", e.dataTransfer);
    createObjectOnCondition(e.dataTransfer.getData("rand"), idc, temp.id);
  };

  temp.onclick = function (e) {
    console.log("clicked", this.id);
    const found = objectContainer
      .getAll()
      .find((element) => element.id == this.id);
    console.log("FOUND", found);
    showVariables(found.getAll());
  };

  return temp.id;
}

export function createVarDef(parent, idx) {
  var ida = getRandom();
  var temp = document.createElement("div");
  temp.id = idx;
  temp.className = "var-def";
  temp.innerHTML = "var-" + ida;
  document.getElementById(parent).appendChild(temp);
}
