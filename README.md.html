<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Robot Controller</title>
  <style>
    body {
      font-family: sans-serif;
      text-align: center;
      margin: 2em;
    }
    button {
      font-size: 1.2em;
      margin: 0.5em;
      padding: 0.6em 1.2em;
      border: none;
      border-radius: 0.5em;
      background-color: #007aff;
      color: white;
    }
    button:disabled {
      background-color: #aaa;
    }
  </style>
</head>
<body>
  <h3><i>[....all mimsy were the borogroves....]</i></h3>
  <h1>Robot Controller</h1>
  <button id="connect" onclick="connectRequest()">🔗 Connect</button>
  <p id="status">Not connected</p>
  <div id="controls" style="display:block;">
    <button onclick="sendCommand('f')">⬆️ Forward</button><br>
    <button onclick="sendCommand('l')">CCW ↪️</button>
    <button onclick="sendCommand('s')">🛑 Stop</button>
    <button onclick="sendCommand('r')">↩️ CW</button><br>
    <button onclick="sendCommand('b')">⬇️ Back</button><br><br>
    <button onclick="sendCommand('e')">👀 Look Up</button>
    <button onclick="sendCommand('w')">👋 Wave</button>
    <button onclick="sendCommand('p')">🎃 Pumpkin</button>
  </div>

  <script>
    let txCharacteristic = null;

    async function disconnectRequest() {
      const server = await device.gatt.disconnect();
      document.getElementById('connect').textContent = 'TODO: Why can\'t we reconnect';
      document.getElementById('status').textContent = 'Not connected';
      document.getElementById('controls').style.display = 'none';
    };

    async function connectRequest() {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: 'Mimsy' }], // change to match your device’s name
          optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] // esp32
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
        txCharacteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
        rxCharacteristic = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');

        document.getElementById('connect').textContent = '✖️ Disconnect';
        document.getElementById('connect').onclick = disconnectRequest();
        document.getElementById('status').textContent = '✅ Connected to ' + device.name;
        document.getElementById('controls').style.display = 'block';
      } catch (error) {
        document.getElementById('status').textContent = '❌ ' + error;
      }
    };

    async function sendCommand(cmd) {
      if (!txCharacteristic) {
        document.getElementById('status').textContent = 'Error: No TX characteristic.';
        return;
      }

      const data = new TextEncoder().encode(cmd + '\n');

      try {
        if (txCharacteristic.properties.write) {
          await txCharacteristic.writeValue(data);
        } else if (txCharacteristic.properties.writeWithoutResponse) {
          await txCharacteristic.writeValueWithoutResponse(data);
        } else {
          throw new Error('Characteristic not writable.');
        }

        document.getElementById('status').textContent = 'Sent: ' + cmd;
      } catch (error) {
        document.getElementById('status').textContent = 'Error: ' + error;
        console.error(error);
      }
    };
  </script>
</body>
</html>
