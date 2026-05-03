// numpad.js

import { send } from '../core/ble.js';
import { sendCommand } from '../utils/protocol.js';

const CMD_STOP = 'X';
const CMD_NUMPAD = 'N';

const layout = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
  ["*", 0, "#"]
];

// arrows for visual hint
const arrows = {
  8: "↑",
  2: "↓",
  4: "←",
  6: "→",
  7: "↖",
  9: "↗",
  1: "↙",
  3: "↘",
  5: "•",
  0: "★"
};

export function mount(root) {
  root.innerHTML = `<div class="numpad"></div>`;
  const container = root.querySelector(".numpad");

  function press(val) {
    sendCommand(send, CMD_NUMPAD, val, 0, 0);
  }

  function release() {
    sendCommand(send, CMD_STOP, 0, 0, 0);
  }

  layout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";

    row.forEach(val => {
      const btn = document.createElement("button");
      btn.textContent = `${val} ${arrows[val] || ""}`;
      btn.style.flex = "1";
      btn.style.margin = "4px";
      btn.style.height = "60px";

      btn.onmousedown = () => press(val);
    //   btn.onmouseup = release;
    //   btn.onmouseleave = release;
      btn.ontouchstart = (e) => { e.preventDefault(); press(val); };
    //   btn.ontouchend = release;

      rowDiv.appendChild(btn);
    });

    container.appendChild(rowDiv);
  });

  // keyboard support
  function keydown(e) {
    if (e.code.startsWith("Numpad")) {
      const val = e.code.replace("Numpad", "");
      if (!isNaN(val)) press(val);
    }
  }

//   function keyup(e) {
//     if (e.code.startsWith("Numpad")) {
//       release();
//     }
//   }

  window.addEventListener("keydown", keydown);
//   window.addEventListener("keyup", keyup);

  return () => {
    window.removeEventListener("keydown", keydown);
    // window.removeEventListener("keyup", keyup);
  };
}