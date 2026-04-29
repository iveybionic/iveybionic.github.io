// modules/plotter.js
import { subscribe } from '../core/ble.js';

export function mount(root) {
  root.innerHTML = `
    <h2>Plotter</h2>
    <pre id="log"></pre>
  `;

  const log = root.querySelector("#log");
  const decoder = new TextDecoder();

  const unsubscribe = subscribe((value) => {
    const text = decoder.decode(value);
    log.textContent = text + "\n" + log.textContent;
  });

  // cleanup when navigating away
  return () => {
    unsubscribe();
  };
}