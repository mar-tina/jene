import { ContextProvider } from "./shadow.js";

export let globalProvider = new ContextProvider();

export let pubTodoCtx = (self) => {
  let props = {
    todos: [],
  };
  return globalProvider.addNewContext("todoCtx", props);
};

export let subToTodos = (self) => {
  let callback = {
    listenOn: "set",
    f: (property, args) => {
      if (property === "todos") {
        self.setState({
          todos: args,
        });
      }
    },
  };
  try {
    return globalProvider.subToContext("todoCtx", callback);
  } catch (error) {
    console.log("Failed", error);
  }
};
