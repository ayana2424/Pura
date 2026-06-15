#include <Stepper.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "secrets.h"          

const int RELAY_PIN = 5;       
const int SOIL_PIN = 34;       
const int stepsPerRevolution = 2048; 

// motors are mapped as IN1, IN3, IN2, IN4
// motor 1
Stepper roofMotor1(stepsPerRevolution, 19, 5, 18, 17);

// motor 2 (not connected yet)
// Stepper roofMotor2(stepsPerRevolution, 21, 23, 22, 16);

// global var
bool isRaining = false;
bool roofIsOpen = true;        
unsigned long previousMillis = 0;
const long interval = 10000;   

// FreeRTOS task handler
TaskHandle_t WeatherTask;
TaskHandle_t HardwareTask;

void setup() {
  Serial.begin(9600);
  delay(1000);

  roofMotor1.setSpeed(10); 
  // roofMotor2.setSpeed(10); 

  Serial.println("\nSystem Ready");
  Serial.println("Type 'm' to manually water for 5 seconds.");
  Serial.println("Type 'a' to manually toggle the roof motors.");
  Serial.println("--------------------------------------------------");

  pinMode(RELAY_PIN, INPUT);

  // wifi connect
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");

  // tasks for cores
  xTaskCreatePinnedToCore(WeatherAPICheck, "WeatherTask", 10000, NULL, 1, &WeatherTask, 0);
  xTaskCreatePinnedToCore(HardwareControl, "HardwareTask", 10000, NULL, 1, &HardwareTask, 1);
}

// soil sensor logic
int check_soil_moisture() {
  int raw_value = analogRead(SOIL_PIN);
  int moisture_percent = map(raw_value, 1023, 400, 0, 100);
  moisture_percent = constrain(moisture_percent, 0, 100);
  return moisture_percent;
}

// water pump logic
void water_the_plant(int run_time_seconds) {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  delay(run_time_seconds * 1000);     
  pinMode(RELAY_PIN, INPUT);
}

// roof motor logic
void moveRoofs(bool closeRoof) {
  int totalSteps = 7 * stepsPerRevolution; 
  int chunkSize = 32; 
  
  if (closeRoof) {
    Serial.println("[Motors] Closing Roof");
    for (int stepsTaken = 0; stepsTaken < totalSteps; stepsTaken += chunkSize) {
      roofMotor1.step(chunkSize);
      // roofMotor2.step(chunkSize); 
      yield(); 
    }
  } else {
    Serial.println("[Motors] Opening Roof");
    for (int stepsTaken = 0; stepsTaken < totalSteps; stepsTaken += chunkSize) {
      roofMotor1.step(-chunkSize);
      // roofMotor2.step(-chunkSize); 
      yield();
    }
  }
}

// CORE 0
// network & API
void WeatherAPICheck(void * parameter) {
  for(;;) { 
    if(WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
    
      String url = "http://api.weatherapi.com/v1/current.json?key=" + String(SECRET_WEATHER_API_KEY) + "&q=Taipei";
      
      http.begin(url); 
      int httpCode = http.GET();

      if (httpCode > 0) {
        String payload = http.getString();
        
        if (payload.indexOf("rain") > 0) {
          isRaining = true;
        } else {
          isRaining = false;
        }
      }
      http.end();
    }
    
    // check the API every 5 minutes (300,000 ms)
    vTaskDelay(300000 / portTICK_PERIOD_MS); 
  }
}

// CORE 1
// hardware
void HardwareControl(void * parameter) {
  for(;;) { 
    
    // manual roof operation watch trigger
    if (Serial.available() > 0) {
      char user_input = Serial.read();
      if (user_input == 'm' || user_input == 'M') {
        Serial.println("\n[Manual Test Triggered]");
        water_the_plant(5);
      } else if (user_input == 'a' || user_input == 'A') {
        Serial.println("\n[Manual Roof Toggle Triggered]");
        roofIsOpen = !roofIsOpen;       
        moveRoofs(!roofIsOpen);         
      }
    }

    // automated roof
    if (isRaining && roofIsOpen) {
      Serial.println("Weather API reports RAIN. Closing roofs.");
      moveRoofs(true); 
      roofIsOpen = false;
    } 
    else if (!isRaining && !roofIsOpen) {
      Serial.println("Weather API reports CLEAR. Opening roofs.");
      moveRoofs(false); 
      roofIsOpen = true;
    }

    // automated soil moisture
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      
      int current_moisture = check_soil_moisture();
      
      if (current_moisture < 40) {
          Serial.println("Soil is too dry! Triggering watering sequence.");
          water_the_plant(3);
      } 
    }
    
    vTaskDelay(10 / portTICK_PERIOD_MS); 
  }
}

void loop() {}