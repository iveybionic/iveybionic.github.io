// numpad.js

import { sendStopCommand, sendTwistCommand } from '../utils/protocol.js';

const layout = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
  ["*", 0, "#"]
];

// arrows for visual hint
const spd = 80.0;
const sqt2 = spd/Math.SQRT2;

const cmd = {
  8: [0, spd, "↑"], // 80% of full speed ahead
  2: [0, -spd, "↓"],
  4: [spd, 0, "←"], // pure rotation CCW
  6: [-spd, 0, "→"], // pure rotation CW
  7: [sqt2, sqt2, "↖"],
  9: [-sqt2, sqt2, "↗"],
  1: [sqt2, -sqt2, "↙"],
  3: [-sqt2, -sqt2, "↘"],
  5: [0, 0, "•"], // stop
  0: [0, 0, "★"]
};

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
  container.style.display = "grid";
  container.style.gap = "8px";

  function press(val) {
    const [omega, vel, icon] = cmd[val]
    sendTwistCommand(omega, vel);
  }

  function release() {
    sendStopCommand();
  }

  layout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";

    row.forEach(val => {
      const btn = document.createElement("button");
      btn.textContent = `${val} ${arrows[val] || ""}`;
      btn.style.flex = "1";
      btn.style.margin = "4px";
      btn.style.aspectRatio = "1";   // square buttons
      btn.style.fontSize = "clamp(14px, 4vw, 20px)";
      btn.style.maxWidth = "100px"

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
    sendStopCommand();
    window.removeEventListener("keydown", keydown);
    // window.removeEventListener("keyup", keyup);
  };
}