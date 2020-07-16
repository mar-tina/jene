import { Shadow } from "../shadow.js";

export let Header = Shadow("header-el", {
  onMount: (self) => {
    console.log("Mounted Header");
  },

  template: (self) => /*html*/ `
    <style>
      .header {
        display: flex;
        color: black;
        padding: 20px;
        font-family: "Courier New", Courier, monospace;
        font-weight: 600;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px #333333 solid;
      }

      .menu {
        display: flex;
        flex-direction: row;
        justify: space-between;
      }

      .menu-item {
        margin-left: 100px;
      }
    </style> 
    
    
    <div class="header">
        <div class="logo" > JENE </div>
        <div class="menu">
          <div class="menu-item"> About </div>
          <div class="menu-item"> GITHUB </div>
        </div>
    </div>
  `,
});
