// ble.js

export const state = {
  device: null,
  msg_chr: null,
  bulk_chr: null,
  _handler: null,
};

const listeners = new Set();

export async function connect(req) {
  const ping = (state.device?.gatt.connected == true);

  if (req == "y") {

    if (ping) {
      return true;
    }

    try {
      state.device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'Mimsy' }],
        optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
      });
    } catch (NotFoundError) {
      console.log("No device selected");
      return false;
    }

    if (!state.device) {
      console.warn("Unable to connect to device");
      return false;
    }

    const server = await state.device.gatt.connect();
    const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
    state.msg_chr = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
    state.bulk_chr = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
    
    state.device.addEventListener('gattserverdisconnected', () => {
      // TODO: clean up plotter objects so we start fresh on reconnect
      console.warn("BLE disconnected (event)");
      state.msg_chr = null;
      state.bulk_chr = null;
    });
    
    console.log("BLE connected");

    await state.bulk_chr.startNotifications();

    state._handler = (e) => {
      const value = e.target.value;
      listeners.forEach(fn => fn(value));
    };

    state.bulk_chr.addEventListener('characteristicvaluechanged', state._handler);
    console.log("BLE stream connected");
    return true;
  
  } else if (req == "n") {
    state.disconnect_req_sent = true;
    state.device?.gatt.disconnect();
    return false;
  } else {
    console.warn("Invalid command to connection handler");
    return ping;
  }

}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn); // unsubscribe
}

export function send(data) {
  if (!state.msg_chr) {
    return;
  }
  try {
    return state.msg_chr.writeValue(data);
  } catch (NetworkError) {
    return false;
  }
}

export function isConnected() {
  return !!(state.device && state.device.gatt.connected);
}