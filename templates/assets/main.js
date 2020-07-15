import { Shadow, initApp } from "./shadow.js";
import "./app.js";
// Entry is not similar to other shadow elements
let Entry = new Shadow("entry-point", {
  template: (self) => /*html*/ ` 
    <app-el> </app-el> 
  `,
});

initApp("#app", Entry, document);
