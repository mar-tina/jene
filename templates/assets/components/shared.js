import {
  createObjectOnCondition,
  addDeclarationToFunctionObject,
  checkIfAlreadyExists,
  addLoopToFunctionObject,
} from "../utils.js";
import { globalProvider } from "../provider.js";

export function handleDropOnPlay(e, self) {
  e.preventDefault();
  let existsInFunc = checkIfExistsInFunction(self.state.currentDragged);
  if (existsInFunc) {
    self.state.components.push(
      Array.isArray(existsInFunc) ? existsInFunc[0] : existsInFunc
    );
  } else {
    let data = JSON.parse(e.dataTransfer.getData("module"));
    self.state.components.push(createObjectOnCondition(data.name));
  }
  globalProvider.providers.globalCtx.proxyObject.components =
    self.state.components;
}

export function matchTypeToFunctionCall(type) {
  switch (type) {
    case "loop":
      return "loopDragStart";
    case "stmt":
      return "stmtDragStart";
  }
}

export function handleDragStartLoop(e, self) {
  var loop = {
    name: "loop",
    id: e.target.id,
  };
  e.dataTransfer.setData("module", JSON.stringify(loop));
  self.setState({ currentDragged: e.target.id }, false);
}

// Unnecessary. will merge with above function
export function handleDragStartStmt(e, self) {
  var item = {
    name: "stmt",
    id: e.target.id,
  };
  e.dataTransfer.setData("module", JSON.stringify(item));
  self.setState({ currentDragged: e.target.id }, false);
}

export function handleDropOnFunc(e, self) {
  e.preventDefault();
  e.stopPropagation();
  let data = JSON.parse(e.dataTransfer.getData("module"));
  let existingObj = checkIfAlreadyExists(data.id);
  if (existingObj) {
    addDeclarationToFunctionObject(
      e.target.id,
      self.state.components,
      existingObj
    );
  } else {
    let obj = createObjectOnCondition(data.name);
    addDeclarationToFunctionObject(e.target.id, self.state.components, obj);
  }

  // update ctx provider to trigger page refresh
  globalProvider.providers.globalCtx.proxyObject.components =
    self.state.components;
  console.log(self);
}

export function checkIfExistsInFunction(id) {
  let items = globalProvider.providers.globalCtx.proxyObject.components;
  let component;
  for (var i in items) {
    var modules = items[i];
    if (modules.getTypeOf() == "func") {
      var decls = modules.declarations;
      for (var j in decls) {
        if (decls[j].id == id) {
          component = modules.declarations.splice(j, 1);
        }
      }
    }
  }
  return component;
}
