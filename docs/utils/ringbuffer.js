// utils/ringbuffer.js

export class RingBuffer {
  constructor(size, channels) {
    this.size = size;
    this.channels = channels;
    this.data = Array.from({ length: channels }, () => new Float64Array(size));
    this.index = 0;
    this.length = 0;
  }

  push(values) {
    for (let i = 0; i < this.channels; i++) {
      this.data[i][this.index] = values[i];
    }

    this.index = (this.index + 1) % this.size;
    if (this.length < this.size) this.length++;
  }

  // returns ordered arrays for plotting
  snapshot() {
    const out = this.data.map(arr => new Array(this.length));

    for (let i = 0; i < this.length; i++) {
      const idx = (this.index - this.length + i + this.size) % this.size;
      for (let ch = 0; ch < this.channels; ch++) {
        out[ch][i] = this.data[ch][idx];
      }
    }

    return out;
  }
}