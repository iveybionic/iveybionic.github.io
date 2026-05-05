// modules/joystick.js

import { sendTwistCommand, sendStopCommand } from '../utils/protocol.js';

export function mount(root) {
  root.innerHTML = `
    <div class="joy-outer">
      <div class="joy-inner"></div>
    </div>
  `;

  const outer = root.querySelector(".joy-outer");
  const inner = root.querySelector(".joy-inner");
  outer.style.touchAction = "none";
  
  
  // styling
  function resize() {
    const osize = Math.min(root.clientWidth, 200);
    Object.assign(outer.style, {
      width: osize + "px",
      height: osize + "px",
      borderRadius: "50%",
      background: "#222",
      position: "center",
      margin: "20px"
    });
    
    const isize = Math.min(root.clientWidth / 4, 60);
    Object.assign(inner.style, {
      width: isize + "px",
      height: isize + "px",
      borderRadius: "50%",
      background: "gray",
      position: "relative",
      top: isize + 10 + "px",
      left: isize + 10 + "px"
    });
  }

  window.addEventListener("resize", resize);
  resize();

  let dragging = false;

  function update(x, y) {
    const rect = outer.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    let dx = x - rect.left - cx;
    let dy = y - rect.top - cy;

    const r = Math.sqrt(dx * dx + dy * dy);
    const max = rect.width / 2;

    // let angle = Math.atan2(dy, dx); // radians
    
    // clamp position
    if (r > max) {
      dx *= max / r;
      dy *= max / r;
    }
    
    console.log(`dx: ${-dx} dy: ${-dy}`)
    
    inner.style.left = `${cx + dx - 30}px`;
    inner.style.top = `${cy + dy - 30}px`;
    
    // color intensity
    let mag = Math.min(r / max, 1);
    const intensity = Math.floor(255 * mag);
    inner.style.background = `rgb(${255 - intensity}, ${intensity}, 0)`;

    sendTwistCommand(-dx, -dy);
  }

  function reset() {
    inner.style.left = "70px";
    inner.style.top = "70px";
    inner.style.background = "gray";
    sendStopCommand();
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
    sendStopCommand();

    outer.removeEventListener("mousedown", start);
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", end);

    outer.removeEventListener("touchstart", start);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", end);
  };
}