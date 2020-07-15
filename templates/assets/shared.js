import { showVariables } from "./vars.js";
import {
  getRandom,
  createObjectOnCondition,
  objectContainer,
} from "./index.js";
// Create Func DIV.
export function createFunctionDef(idx) {
  var box = createElement(getRandom(), "div", "box-func");
  var el = createElement(idx, "div", "func-def");
  el.innerHTML = "func-" + getRandom();
  el.draggable = true;
  el.contentEditable = true;
  var paramsEl = createElement(getRandom(), "div", "params-El");
  paramsEl.innerHTML = "+";
  paramsEl.contentEditable = false;
  paramsEl.id = getRandom();

  box.appendChild(el);
  box.appendChild(paramsEl);
  document.getElementById("playground").appendChild(box);
  el.ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    createObjectOnCondition(e.dataTransfer.getData("rand"), getRandom(), el.id);
  };

  const found = objectContainer.getAll().find((element) => element.id == idx);
  el.onclick = function (e) {
    console.log(found);
    showVariables(found.getAll(), found.getReturnValue());
  };

  paramsEl.addEventListener("click", () => {
    var inID = "input-params-el" + idx;
    var inputEl;
    if (!elementExists(inID)) {
      inputEl = createElement(getRandom(), "input", inID);
      paramsEl.appendChild(inputEl);
      inputEl.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          found.addParams(event.target.value);
          showVariables(found.getAll(), found.getReturnValue());
        }
      });
    }
  });

  return el.id;
}

export function createVarDef(parent) {
  var ida = getRandom();
  var el = createElement(ida, "div", "var-def");
  el.draggable = true;
  el.innerHTML = "var-" + ida;

  el.addEventListener("dragstart", function (e) {
    console.log("DRAGGING", this);
  });

  el.addEventListener("drop", function (e) {
    this.style.display = "none";
  });

  document.getElementById(parent).appendChild(el);
  return el.id;
}

function createElement(idx, type, className) {
  var temp = document.createElement(type);
  temp.id = idx;
  temp.className = className;
  return temp;
}

function elementExists(classname) {
  var el = document.getElementsByClassName(classname);
  if (el === undefined || el.length == 0) {
    return false;
  }
  return true;
}
