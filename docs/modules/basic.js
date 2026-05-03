// modules/controller.js

import { send } from '../core/ble.js';
import { sendCommand } from '../utils/protocol.js';

const CMD_STOP = 'X';
const CMD_BASIC = 'W';

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

  root.querySelector("#fwd").onclick = () => {
    sendCommand(send, CMD_BASIC,"F", 0, 0);
  };

  root.querySelector("#back").onclick = () => {
    sendCommand(send, CMD_BASIC,"B", 0, 0);
  };

  root.querySelector("#ccw").onclick = () => {
    sendCommand(send, CMD_BASIC,"L", 0, 0);
  };

  root.querySelector("#cw").onclick = () => {
    sendCommand(send, CMD_BASIC,"R", 0, 0);
  };

  root.querySelector("#stop").onclick = () => {
    sendCommand(send, CMD_STOP, 0, 0, 0);
  };

  return () => {};
}