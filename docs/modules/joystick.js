// modules/joystick.js

import { send } from '../core/ble.js';
import { sendCommand } from '../utils/protocol.js';

const CMD_STOP = 'X';
const CMD_JOYSTICK = 'J';

export function mount(root) {
  root.innerHTML = `
    <div class="joy-outer">
      <div class="joy-inner"></div>
    </div>
  `;

  const outer = root.querySelector(".joy-outer");
  const inner = root.querySelector(".joy-inner");

  // styling
  Object.assign(outer.style, {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "#222",
    position: "relative",
    margin: "20px"
  });

  Object.assign(inner.style, {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "gray",
    position: "absolute",
    left: "70px",
    top: "70px"
  });

  let dragging = false;

  function update(x, y) {
    const rect = outer.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    let dx = x - rect.left - cx;
    let dy = y - rect.top - cy;

    const r = Math.sqrt(dx * dx + dy * dy);
    const max = rect.width / 2;

    let mag = Math.min(r / max, 1);
    let angle = Math.atan2(dy, dx); // radians

    // clamp position
    if (r > max) {
      dx *= max / r;
      dy *= max / r;
    }

    inner.style.left = `${cx + dx - 30}px`;
    inner.style.top = `${cy + dy - 30}px`;

    // color intensity
    const intensity = Math.floor(255 * mag);
    inner.style.background = `rgb(${255 - intensity}, ${intensity}, 0)`;

    sendCommand(send, CMD_JOYSTICK, 0, angle, mag);
  }

  function reset() {
    inner.style.left = "70px";
    inner.style.top = "70px";
    inner.style.background = "gray";
    sendCommand(send, CMD_STOP, 0, 0, 0);
  }

  function start(e) {
    dragging = true;
    move(e);
  }

  function move(e) {
    if (!dragging) return;

    const touch = e.touches ? e.touches[0] : e;
    update(touch.clientX, touch.clientY);
  }

  function end() {
    dragging = false;
    reset();
  }

  outer.addEventListener("mousedown", start);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);

  outer.addEventListener("touchstart", start);
  window.addEventListener("touchmove", move);
  window.addEventListener("touchend", end);

  return () => {
    outer.removeEventListener("mousedown", start);
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", end);

    outer.removeEventListener("touchstart", start);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", end);
  };
}