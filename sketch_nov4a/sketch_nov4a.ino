#include <ESP8266WiFi.h>
#include <SocketIOclient.h>

// const char* ssid = "OnePlus NordCE 5G";
// const char* password = "12345678";
const char* ssid = "Nabil Newaz";
const char* password = "nabilnewaz@1998@04@11";

// Socket.IO server details
const char* serverUrl = "51.79.250.45"; // e.g., "192.168.1.100"
const uint16_t serverPort = 9000; // Port where your WebSocket server is running

SocketIOclient socketIO;
#define USE_SERIAL Serial

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      USE_SERIAL.printf("[IOc] Disconnected!\n");
      break;
    case sIOtype_CONNECT:
      USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);
      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");
      break;
    case sIOtype_EVENT:
      USE_SERIAL.printf("[IOc] get event: %s\n", payload);

      // Check if the payload matches the exact string ["MOVE_SERVO"]
      if (strcmp((char*)payload, "[\"MOVE_SERVO\"]") == 0) {
        // USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);
          Serial.println("MOVE_SERVO");
          // Handle the MOVE_SERVO command here
      } else if (strcmp((char*)payload, "[\"RESET_SERVO\"]") == 0) {
          Serial.println("RESET_SERVO");
          // Handle the RESET_SERVO command here
      } else {
          Serial.println("Unknown command received");
      }

      break;
    case sIOtype_ACK:
      USE_SERIAL.printf("[IOc] get ack: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_ERROR:
      USE_SERIAL.printf("[IOc] get error: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_BINARY_EVENT:
      USE_SERIAL.printf("[IOc] get binary: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_BINARY_ACK:
      USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
      hexdump(payload, length);
      break;
  }
}
void setup() {
  Serial.begin(9600);         // Start the Serial communication to send messages to the computer
  delay(10);
  Serial.println('\n');

  WiFi.begin(ssid, password);             // Connect to the network
  Serial.print("Connecting to ");
  Serial.print(ssid); Serial.println(" ...");

  int i = 0;
  while (WiFi.status() != WL_CONNECTED) { // Wait for the Wi-Fi to connect
    delay(1000);
    Serial.print(++i); Serial.print(' ');
  }

  Serial.println('\n');
  Serial.println("Connection established!");
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer


  //put your server ip address
   socketIO.begin(serverUrl, serverPort, "/socket.io/?EIO=4");

    // event handler
    socketIO.onEvent(socketIOEvent);

}

void loop() { 
    socketIO.loop();

     if (Serial.available() > 0) {
    String status = Serial.readStringUntil('\n');
    status.trim();

    if (status == "OPEN") {
      socketIO.sendEVENT("[\"status\", \"OPEN\"]");
      USE_SERIAL.println("Emitting OPEN status to server");
    } else if (status == "CLOSE") {
      socketIO.sendEVENT("[\"status\", \"CLOSED\"]");
      USE_SERIAL.println("Emitting CLOSED status to server");
    }
  }
  //
  }