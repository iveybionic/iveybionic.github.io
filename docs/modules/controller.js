// modules/controller.js

import { send } from '../core/ble.js';

export function mount(root) {
  root.innerHTML = `
    <h2>Controller</h2>
    <button id="fwd">Forward</button>
    <button id="stop">Stop</button>
  `;

  root.querySelector("#fwd").onclick = () => {
    send(new TextEncoder().encode("F"));
  };

  root.querySelector("#stop").onclick = () => {
    send(new TextEncoder().encode("S"));
  };

  return () => {};
}