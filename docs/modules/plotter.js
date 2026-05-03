// modules/plotter.js

import { subscribe } from '../core/ble.js';
import { RingBuffer } from '../utils/ringbuffer.js';
import { makeDecoder, extractChannels } from '../utils/protocol.js';
import spec from '../shared/protocol.json' with { type: 'json' };


function generateColors(n) {
  const colors = [];
  for (let i = 0; i < n; i++) {
    const hue = (i * 360 / n) % 360;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
}

export function mount(root) {
  root.innerHTML = `
    <h2>Plotter</h2>
    <div id="chart"></div>
  `;

  const script = document.createElement("script");
  script.src = "https://unpkg.com/uplot/dist/uPlot.iife.min.js";
  document.head.appendChild(script);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/uplot/dist/uPlot.min.css";
  document.head.appendChild(link);

  // config
  const decode = makeDecoder(spec);
  const { x, ys } = extractChannels(spec);

  const CHANNELS = 1 + ys.length; // x + y's
  const MAX_POINTS = 500;

  const buffer = new RingBuffer(MAX_POINTS, CHANNELS);

  // --- setup uPlot dynamically ---
  const colors = generateColors(ys.length);
  const series = [{label: x}]; // x axis
  let i = 0;
  for (const name of ys) {
    series.push({ 
      label: name, 
      stroke: colors[i],
      width: 2 
    });
    i++;
  }

  let plot = null;

  function initPlot() {
    const opts = {
      class: "uplot-dark",
      width: 1000,
      height: 400,
      series,
      title: "IMU Data",
      scales: { x: { time: false } }
    };

    plot = new uPlot(opts, buffer.snapshot(), root.querySelector("#chart"));
  }

  // wait for uPlot to load
  script.onload = initPlot;

  // --- BLE subscription ---
  const unsubscribe = subscribe((value) => {
    // console.log("value byte offset: ", value.byteOffset);
    const slice = value.buffer.slice(
      value.byteOffset,
      value.byteOffset + value.byteLength
    );
    
    // console.log("packet length in plotter:", value.byteLength);
    // console.log("slice byte length: ", slice.byteLength);

    const data = decode(slice);

    // optional: filter message type
    if (data.type !== 0) return;

    const row = [data[x], ...ys.map(k => data[k])];
    buffer.push(row);
  });

  // --- render loop ---
  const interval = setInterval(() => {
    if (plot) {
      plot.setData(buffer.snapshot());
    }
  }, 50);

  return () => {
    unsubscribe();
    clearInterval(interval);
    if (plot) {
      plot.destroy();
    }
  };
}