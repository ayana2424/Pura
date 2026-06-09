// Include the built-in Arduino Stepper library [cite: 1]
#include <Stepper.h>

// --- Setup Pins for ESP8266 ---
const int RELAY_PIN = 5;  // (D1 on NodeMCU/Wemos) [cite: 8]
const int SOIL_PIN = A0;  // The single analog pin [cite: 9]

// --- Setup for Roof Motor ---
const int stepsPerRevolution = 2048; // The 28BYJ-48 motor requires 2048 tiny steps to make one full 360-degree rotation [cite: 1]
// Initialize the stepper library [cite: 2]
// QUIRK: For the ULN2003 driver, we MUST swap the middle two pins in the code! [cite: 2]
// The order goes IN1, IN3, IN2, IN4. Using your new pins: D2, D6, D5, D7. [cite: 3]
Stepper roofMotor(stepsPerRevolution, D2, D6, D5, D7);

// Variables for our background stopwatch (replaces time.sleep) [cite: 9]
unsigned long previousMillis = 0;
const long interval = 10000; // 10 seconds [cite: 10]

void setup() {
  Serial.begin(9600);
  delay(1000); 

  // Set the motor speed to 10 RPM (Revolutions Per Minute) [cite: 4]
  roofMotor.setSpeed(10); 

  Serial.println("\nSystem Ready!");
  Serial.println("Type 'm' and press Send to manually water for 5 seconds.");
  Serial.println("--------------------------------------------------");
  
  // Ensure pump is OFF to start [cite: 12]
  // (Using the open-drain hack to handle 5V/3.3V safety) [cite: 12]
  pinMode(RELAY_PIN, INPUT);
}

// ==========================================
// BRICK 1: The Sensor Logic (Real Hardware)
// ==========================================
int check_soil_moisture() {
  // Read the raw voltage from the physical A0 pin
  int raw_value = analogRead(SOIL_PIN);
  
  // Convert it to a 0-100% scale [cite: 14]
  int moisture_percent = map(raw_value, 1023, 400, 0, 100); 
  
  // Keep the percentage locked between 0 and 100 [cite: 15]
  moisture_percent = constrain(moisture_percent, 0, 100); 

  return moisture_percent;
}

// ==========================================
// BRICK 2: The Pump Logic
// ==========================================
void water_the_plant(int run_time_seconds) {
  // Sink the circuit to ground to turn on the relay
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); 
  
  delay(run_time_seconds * 1000);      
  
  // Turn into an INPUT so current stops flowing entirely 
  pinMode(RELAY_PIN, INPUT); 
}

// ==========================================
// BRICK 3: The Roof Motor Logic
// ==========================================
void control_roof_weather_test() {
  Serial.println("[Roof Test] Opening Roof (Spinning 5 Rotations)...");
  
  // 5 rotations * 2048 steps = 10,240 total steps
  int totalSteps = 7 * stepsPerRevolution; 
  int chunkSize = 32; // Take just 32 steps at a time before yielding
  
  // Move Forward
  for (int stepsTaken = 0; stepsTaken < totalSteps; stepsTaken += chunkSize) {
    roofMotor.step(chunkSize); 
    yield(); // Constantly reassures the ESP watchdog that the board hasn't crashed
  }
  
  delay(5000); // Pause for 5 seconds
  
  Serial.println("[Roof Test] Closing Roof (Spinning Counterclockwise)...");
  
  // Move Backward
  for (int stepsTaken = 0; stepsTaken < totalSteps; stepsTaken += chunkSize) {
    roofMotor.step(-chunkSize); 
    yield(); 
  }
}

// ==========================================
// THE MAIN BRAIN (The Loop)
// ==========================================
void loop() {
  
  // --- 1. MANUAL TEST LISTENER ---
  if (Serial.available() > 0) {
    char user_input = Serial.read();
    if (user_input == 'm' || user_input == 'M') { 
      Serial.println("\n[Manual Test Triggered]");
      water_the_plant(5); 
    } 
  }

  // --- 2. AUTOMATED LOGIC & JSON DATA SENDER ---
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) { 
    previousMillis = currentMillis; 
    
    // A. Check the real moisture
    int current_moisture = check_soil_moisture(); 
    
    // B. Simulate the AI running
    int ai_health_score = 85; 
    String ai_pest_status = "none"; 
    
    // C. Format all data into a JSON string for the dashboard app
    String jsonData = "{\"health\": " + String(ai_health_score) +  
                      ", \"pest\": \"" + ai_pest_status + "\"" + 
                      ", \"moisture\": " + String(current_moisture) + "}"; 
    
    // Send the data out to the Serial Monitor
    Serial.println(jsonData); 
    
    // D. Make the watering decision
    if (current_moisture < 40) { 
        Serial.println("Soil is too dry! Triggering watering sequence."); 
        water_the_plant(3); 
    } 

    // E. Run the Roof Motor Test 
    control_roof_weather_test();
  }
}