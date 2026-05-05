// modules/controller.js

import { sendTwistCommand, sendStopCommand } from '../utils/protocol.js';

export function mount(root) {
  root.innerHTML = `
    <h2>Basic Controller</h2>

    <div id="controls" style="display:block;">
    <button id="fwd">
      <span class="label-full">Forward ⬆️</span>
      <span class="label-short">⬆️</span>
    </button><br>
    <button id="ccw">
      <span class="label-full">CCW ↪️</span>
      <span class="label-short">↪️</span>
    </button>
    <button id="stop">
      <span class="label-full">🛑 Stop</span>
      <span class="label-short">🛑</span>
    <button id="cw">
      <span class="label-full">↩️ CW</span>
      <span class="label-short">↩️</span>
    </button><br>
    <button id="back">
      <span class="label-full">⬇️ Back</span>
      <span class="label-short">⬇️</span>
    </button>
    </div>
  `;

  const spd = .8;
  root.querySelector("#fwd").onclick = () => {
    sendTwistCommand(0, spd)
  };

  root.querySelector("#back").onclick = () => {
    sendTwistCommand(Math.PI, spd)
  };

  root.querySelector("#ccw").onclick = () => {
    sendTwistCommand(Math.PI/2, spd)
  };

  root.querySelector("#cw").onclick = () => {
    sendTwistCommand(3*Math.PI/2, spd)
  };

  root.querySelector("#stop").onclick = () => {
    sendStopCommand();
  };

  return () => {
    sendStopCommand();
  };
}