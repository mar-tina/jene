import { Shadow } from "../shadow.js";

let show = false;

export let Play = Shadow("play-el", {
  onMount: (self) => {
    console.log("Play is here", self);
  },

  methods: {
    handleDrop: function (e, self) {
      e.preventDefault();
      console.log("Drop it");
    },

    handleDragover: function (e, self) {
      e.preventDefault();
      console.log("Over");
    },

    handleDragStart: function (e, self) {
      e.preventDefault();
      console.log("Drag start", e);
    },
  },

  template: (self) => /*html*/ `
        <style>
            .container{
                height: 100vh;
                background-color: #DCDCDC;
            }
        </style>
        <div @dragover="handleDragover" @dragenter="handleDragStart" @drop="handleDrop" class="container"> 
           <div >
            shdbhsbdsdh
            </div>

            ${emptyDropZone(show)}
        </div>
    `,
});

let emptyDropZone = (zone) => {
  if (zone) {
    return `
            DROPPPPPXXXXXOOOOOOONNNNNEEEE
        `;
  } else {
    return `
            herrreeeeee
        `;
  }
};
