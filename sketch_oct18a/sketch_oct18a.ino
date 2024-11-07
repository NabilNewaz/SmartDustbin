#include <Servo.h>

Servo myservo;
int pos = 20;
bool isMoved = false;
bool manualControl = false;  // Flag to disable sensor control when in manual mode
const int trigPin = 6;
const int echoPin = 7;
long duration;
float distance;

void setup() {
  Serial.begin(9600);
  myservo.attach(9);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  myservo.write(pos);  // Initialize servo to the "CLOSE" position
}

void loop() {
  if (!manualControl) {
    // Ultrasonic sensor reading
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = 0.034 * (duration / 2);

    // Check if object is within range
    if (distance < 27) {
      if (!isMoved) {
        isMoved = true;
        Serial.println("OPEN");
        myservo.write(pos + 100);  // Move servo to "OPEN" position
      }
    } else {
      if (isMoved) {
        isMoved = false;
        Serial.println("CLOSE");
        myservo.write(pos);  // Move servo to "CLOSE" position
      }
    }
  }

  // Check for commands from ESP8266
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "MOVE_SERVO") {
      manualControl = true;       // Enter manual control mode
      isMoved = true;
      myservo.write(pos + 100);   // Move servo to "OPEN" position
      Serial.println("OPEN");
    } else if (command == "RESET_SERVO") {
      manualControl = false;      // Exit manual control mode
      isMoved = false;
      myservo.write(pos);         // Move servo to "CLOSE" position
      Serial.println("CLOSE");
    }
  }

  delay(100);  // Adjust delay as needed
}
