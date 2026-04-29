// modules/plotter.js

import { subscribe } from '../core/ble.js';
import { RingBuffer } from '../utils/ringbuffer.js';
import { makeDecoder, extractChannels } from '../utils/protocol.js';
import spec from '../shared/protocol.json' assert { type: 'json' };

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
  const series = [{}]; // x axis
  for (const name of ys) {
    series.push({ label: name });
  }

  const plot = new uPlot({
    width: 800,
    height: 400,
    series
  }, buffer.snapshot(), root.querySelector("#chart"));

  // let plot = null;

  // function initPlot() {
  //   const opts = {
  //     width: 800,
  //     height: 400,
  //     series,
  //   };

  //   plot = new uPlot(opts, buffer.snapshot(), root.querySelector("#chart"));
  // }

  // // wait for uPlot to load
  // script.onload = initPlot;

  // --- BLE subscription ---
  const unsubscribe = subscribe((value) => {
    const slice = value.buffer.slice(
      value.byteOffset,
      value.byteOffset + value.byteLength
    );

    const data = decode(slice);

    // optional: filter message type
    if (data.type !== 0) return;

    const row = [data[x], ...ys.map(k => data[k])];
    buffer.push(row);
  });

  // --- render loop ---
  const interval = setInterval(() => {
    plot.setData(buffer.snapshot());
  }, 50);

  return () => {
    unsubscribe();
    clearInterval(interval);
    plot.destroy();
  };
}