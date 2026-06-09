// --- Setup Pins for ESP8266 ---
const int RELAY_PIN = 5;  // (D1 on NodeMCU/Wemos)
const int SOIL_PIN = A0;  // The single analog pin

// Variables for our background stopwatch (replaces time.sleep)
unsigned long previousMillis = 0;
const long interval = 10000; // 10 seconds

void setup() {
  Serial.begin(9600);
  delay(1000); 

  Serial.println("\nSystem Ready!");
  Serial.println("Type 'm' and press Send to manually water for 5 seconds.");
  Serial.println("--------------------------------------------------");

  // Ensure pump is OFF to start 
  // (Using the open-drain hack to handle 5V/3.3V safety)
  pinMode(RELAY_PIN, INPUT);
}

// ==========================================
// BRICK 1: The Sensor Logic (Real Hardware)
// ==========================================
int check_soil_moisture() {
  // Read the raw voltage from the physical A0 pin
  int raw_value = analogRead(SOIL_PIN);
  
  // Convert it to a 0-100% scale
  int moisture_percent = map(raw_value, 1023, 400, 0, 100);

  // Keep the percentage locked between 0 and 100 
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
  }
}