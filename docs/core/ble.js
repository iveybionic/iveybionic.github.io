// ble.js

export const state = {
  device: null,
  txCharacteristic: null,
  rxCharacteristic: null
};

const listeners = new Set();

export async function connect(req) {
  if (req == "y") {
    state.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'Mimsy' }], // change to match your device’s name
      optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] // esp32
    });

    const server = await state.device.gatt.connect();
    const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
    state.txCharacteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
    state.rxCharacteristic = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
    
    // await txcharacteristic.startNotifications();
  
    // rxcharacteristic.addEventListener('characteristicvaluechanged', (e) => {
    //   const value = e.target.value;
    //   listeners.forEach(fn => fn(value));
    // });
    console.log("BLE connected");
  
  } else if (req == "n") {
    const server = await state.device.gatt.disconnect();
    console.log("BLE disconnected");

  } else {
    console.log("Invalid command to connection handler");
  }

}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn); // unsubscribe
}

export function subscribeParsed(fn) {
  return subscribe((value) => {
    const text = new TextDecoder().decode(value);
    fn(text);
  });
}

export function send(data) {
  if (!state.txcharacteristic) return;
  return state.txcharacteristic.writeValue(data);
}

export function isConnected() {
  return !!state.rxcharacteristic;
}