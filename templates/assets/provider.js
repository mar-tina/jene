import { ContextProvider } from "./shadow.js";

export let globalProvider = new ContextProvider();

export let pubglobalCtx = (self) => {
  let props = {
    todos: [],
    components: [],
    currentmod: "",
  };
  return globalProvider.addNewContext("globalCtx", props);
};

export let subToComponents = (self) => {
  let callback = {
    listenOn: "set",
    f: (property, args) => {
      if ((property = "components")) {
        self.setState({ components: args }, true);
      }
    },
  };
  try {
    return globalProvider.subToContext("globalCtx", callback);
  } catch (error) {
    console.log("Failed to sub to globalCtx", error);
  }
};
