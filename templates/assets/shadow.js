const parseRange = document.createRange();
const parse = Range.prototype.createContextualFragment.bind(parseRange);

export let initApp = (id, content, doc) => {
  let entrydiv = document.createElement("div");
  entrydiv.innerHTML = content();
  let docref = doc.body.querySelector(id);
  docref.appendChild(entrydiv);
};

export function Shadow(label, args, styleObject) {
  customElements.define(
    label,
    class extends HTMLElement {
      connectedCallback() {
        !!args.onMount ? args.onMount(this) : {};
        this.render();
      }
      constructor() {
        super();
        this.state = args.state;
        this.VDomNodes = {};
        this.BindNodes = {};
        this._shadowRoot = this.attachShadow({
          mode: "open",
        });
        !!args.getInitialState
          ? ([this.state, this.setState] = args.getInitialState(this))
          : {};
      }

      render() {
        this.parsedTemplate = parse(args.template(this));
        this.template = document.createElement("div");
        this.template.style.height = "parent";
        this.template.appendChild(this.parsedTemplate);
        this._shadowRoot.appendChild(this.template.cloneNode(true));
        recursivelyCheckForNodes(this._shadowRoot, this.VDomNodes);
        this.setAttributes();
      }

      clear() {
        this.shadowRoot.innerHTML = "";
      }

      setAttributes() {
        for (var key in this.VDomNodes) {
          if (this.VDomNodes.hasOwnProperty(key)) {
            if (this.VDomNodes[key].parent != undefined) {
              // Get element in template and modify element
              let el = this._shadowRoot.querySelector(`#${key}`);
              let attr;
              !!el ? (attr = el.attributes) : (attr = {});
              for (var prop in attr) {
                if (attr[prop].nodeName != null) {
                  if (attr[prop].nodeName.startsWith("@")) {
                    let f = args.methods[`${attr[prop].nodeValue}`];
                    attr[prop].nodeName === "@bind"
                      ? setBindNodes(el, attr[prop].nodeValue, this.BindNodes)
                      : el.addEventListener(
                          `${attr[prop].nodeName.substr(1)}`,
                          (e) => f(e, this)
                        );
                    // el.removeAttribute(`${attr[prop].nodeName}`);
                  }
                }
              }
            }
          }
        }
      }
    }
  );

  return args.template;
}

/**
 *
 * @param {*} node -> The node with the bind attribute
 * @param {*} stateValue -> The state value the node is bound to
 * @param {*} bindNodes -> The object holding all the bind nodes
 */
function setBindNodes(node, stateValue, bindNodes) {
  !bindNodes.hasOwnProperty(`${stateValue}`)
    ? (bindNodes[`${stateValue}`] = {
        nodes: [],
      })
    : {};

  bindNodes[`${stateValue}`][`nodes`].push(node);
}

function recursivelyCheckForNodes(node, allNodes) {
  let DomNode = {};
  node.id == "" ? (node.id = randStr() + uuid(8)) : {};
  DomNode[`${node.id}`] = {};

  !allNodes.hasOwnProperty(Object.keys(DomNode)[0])
    ? (allNodes[`${Object.keys(DomNode)[0]}`] = {})
    : {};

  allNodes[`${Object.keys(DomNode)[0]}`][`parent`] = node.parentNode;
  allNodes[`${Object.keys(DomNode)[0]}`][`attributes`] = node.attributes;

  if (node.hasChildNodes() == true) {
    for (var i = 0; i < node.children.length; i++) {
      recursivelyCheckForNodes(node.children[i], allNodes);
    }
  }
}

/*** HOOK-ALIKE Implementation */
export function useState(state, ctx) {
  const handler = {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    },

    set(target, property, value, receiver) {
      return Reflect.set(target, property, value);
    },
  };
  let proxyObject = new Proxy(state, handler);
  let setState = createStateHandler(proxyObject, ctx);
  return [state, setState];
}

let bindState = (target, value) => {
  target.innerText = value;
};

/**
 * @param {*} proxy -> The proxy object watching state
 * @param {*} self -> The execution context for the component. 'this'
 */
let createStateHandler = (proxy, self) => (state, rerender) => {
  for (var key in proxy) {
    if (state.hasOwnProperty(key)) {
      proxy[key] = state[key];
      // if rerender is set to true the element is cleared and re-rendered
      if (rerender) {
        self.clear();
        self.render();
      }

      if (self.BindNodes[`${key}`] != undefined) {
        for (var node in self.BindNodes[`${key}`].nodes) {
          bindState(self.BindNodes[`${key}`].nodes[node], state[`${key}`]);
        }
      }
    }
  }
};

function randStr() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
}

// A package by: lukeed Github Repository link: https://github.com/lukeed/uid/blob/master/src/index.js
var IDX = 36,
  HEX = "";
while (IDX--) HEX += IDX.toString(36);

function uuid(len) {
  var str = "",
    num = len || 11;
  while (num--) str += HEX[(Math.random() * 36) | 0];
  return str;
}

export let ContextProvider = (function () {
  function ContextProvider() {
    this.providers = {};
  }

  ContextProvider.prototype.addNewContext = function (label, data) {
    // Checks if the new context exists if not it creates a new empty object to avoid failing
    if (!this.providers.hasOwnProperty(label)) {
      this.providers[`${label}`] = {};
    }
    let self = this.providers[`${label}`];
    self.data = data;
    self.subs = [];

    // Implementation of the Javascript proxy object
    const handler = {
      get(target, property, receiver) {
        self.subs.forEach((item) => {
          if (item.listenOn === "get") {
            item.f(property, target[property]);
          }
        });
        return Reflect.get(target, property, receiver);
      },

      set(target, property, value, receiver) {
        let setResult = Reflect.set(target, property, value);
        self.subs.forEach((item) => {
          if (item.listenOn === "set") {
            item.f(property, target[property]);
          }
        });
        return setResult;
      },
    };

    // Returns the ctx to the elements calling publish to allow the elements
    // to manipulate the object being watched.
    self.proxyObject = new Proxy(self.data, handler);
    return self;
  };

  ContextProvider.prototype.subToContext = function (label, callback) {
    let self = this;
    if (!this.providers[`${label}`]) {
      throw new Error("Provider does not exist");
    } else {
      this.providers[`${label}`].subs.push(callback);
      // Returns the ctx to the elements calling subscribe to allow the elements
      // to manipulate the object being watched.
      return self;
    }
  };
  return ContextProvider;
})();
