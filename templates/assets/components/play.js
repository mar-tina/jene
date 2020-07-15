import { Shadow } from "../shadow.js";

let show = false;

export let Play = Shadow("play-el", {
  onMount: (self) => {
    console.log("Play is here", self);
  },

  methods: {
    handleDrop: function (e, self) {
      console.log("hshshshsh");
    },

    handleDragover: function (e, self) {
      console.log("overr");
    },

    handleDragStart: function (e, self) {
      console.log("sjdjsd");
    },
  },

  template: (self) => /*html*/ `
        <style>
            .container{
                height: 100vh;
                background-color: #DCDCDC;
            }
        </style>
        <div @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragStart" class="container"> 
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
