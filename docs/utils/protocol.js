// utils/protocol.js


export function makeDecoder(spec) {
  const littleEndian = spec.endianness === "little";

  const readers = {
    uint8:   (dv, o) => [dv.getUint8(o), 1],
    int8:    (dv, o) => [dv.getInt8(o), 1],
    uint16:  (dv, o) => [dv.getUint16(o, littleEndian), 2],
    int16:   (dv, o) => [dv.getInt16(o, littleEndian), 2],
    uint32:  (dv, o) => [dv.getUint32(o, littleEndian), 4],
    int32:   (dv, o) => [dv.getInt32(o, littleEndian), 4],
    float32: (dv, o) => [dv.getFloat32(o, littleEndian), 4],
    float64: (dv, o) => [dv.getFloat64(o, littleEndian), 8],
  };

  const layout = [...(spec.header || []), ...(spec.payload || [])];

  return function decode(buffer) {
    const dv = new DataView(buffer);
    let offset = 0;
    const out = {};

    for (const field of layout) {
      const reader = readers[field.type];
      if (!reader) throw new Error(`Unsupported type: ${field.type}`);
      
      const [value, size] = reader(dv, offset);
      offset += size;
      out[field.name] = value;
    }
    
    return out;
  };
}

export function extractChannels(spec) {
  const payload = spec.payload;

  const xField = payload.find(f => f.role === "x");
  if (!xField) throw new Error("No x-axis field defined");

  const yFields = payload.filter(f => f !== xField);

  return {
    x: xField.name,
    ys: yFields.map(f => f.name),
  };
}
