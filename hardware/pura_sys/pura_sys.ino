#include <AccelStepper.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "secrets.h"        
#include "driver/gpio.h"
#include "hal/gpio_types.h"  

const int RELAY_PIN = 32;       
const int SOIL_PIN = 33;        
const int stepsPerRevolution = 2048; 

AccelStepper roofMotor1(AccelStepper::FULL4WIRE, 23, 21, 22, 19);
AccelStepper roofMotor2(AccelStepper::FULL4WIRE, 18, 4, 5, 2);

// global var
bool isRaining = false;
bool roofIsOpen = true;        
unsigned long previousMillis = 0;
const long interval = 10000;   

// Task Handle for Core 0
TaskHandle_t WeatherTask;

void setup() {
  Serial.begin(9600); 
  delay(1000);

  gpio_reset_pin(GPIO_NUM_16);
  gpio_reset_pin(GPIO_NUM_17);
  gpio_reset_pin(GPIO_NUM_18);
  gpio_reset_pin(GPIO_NUM_4);
  gpio_reset_pin(GPIO_NUM_5);
  gpio_reset_pin(GPIO_NUM_2);
  gpio_set_direction(GPIO_NUM_16, GPIO_MODE_OUTPUT);
  gpio_set_direction(GPIO_NUM_17, GPIO_MODE_OUTPUT);
  gpio_set_direction(GPIO_NUM_18, GPIO_MODE_OUTPUT);
  gpio_set_direction(GPIO_NUM_4, GPIO_MODE_OUTPUT);
  gpio_set_direction(GPIO_NUM_5, GPIO_MODE_OUTPUT);
  gpio_set_direction(GPIO_NUM_2, GPIO_MODE_OUTPUT);
  gpio_set_level(GPIO_NUM_18, 0); 
  gpio_set_level(GPIO_NUM_4, 0); 
  gpio_set_level(GPIO_NUM_5, 0); 
  gpio_set_level(GPIO_NUM_2, 0); 

  // Set both motors to a stable speed
  roofMotor1.setSpeed(3); 
  roofMotor2.setSpeed(3);

  Serial.println("\nSystem Ready (ESP32 Dual-Core)");
  Serial.println("Type 'water' to manually water for 5 seconds.");
  Serial.println("Type 'open' to manually open the roof.");
  Serial.println("Type 'close' to manually close the roof.");
  Serial.println("Type 'setopen' to set the roof state to OPEN");
  Serial.println("Type 'setclose' to set the roof state to CLOSED");
  Serial.println("--------------------------------------------------");

  pinMode(RELAY_PIN, INPUT);

  // wifi connect
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");

  // --- FREE RTOS CORE 0 TASK SETUP ---
  // We bind the Weather API check to Core 0 so it never interrupts the motors on Core 1
  xTaskCreatePinnedToCore(
    WeatherAPICheckCode, /* Task function. */
    "WeatherTask",       /* name of task. */
    10000,               /* Stack size of task */
    NULL,                /* parameter of the task */
    1,                   /* priority of the task */
    &WeatherTask,        /* Task handle to keep track of created task */
    0);                  /* pin task to core 0 */
}

// ---------------------------------------------------------
// CORE 0: WEATHER API LOOP
// ---------------------------------------------------------
void WeatherAPICheckCode(void * pvParameters) {
  for(;;) {
    if(WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;
    
      String url = "http://api.weatherapi.com/v1/current.json?key=" + String(WEATHER_API_KEY) + "&q=Taipei";
      
      http.begin(client, url); 
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
    // Wait 5 minutes (300,000 ms) before checking again
    vTaskDelay(300000 / portTICK_PERIOD_MS); 
  }
}

// ---------------------------------------------------------
// CORE 1: HARDWARE LOOP
// ---------------------------------------------------------

// soil sensor logic
int check_soil_moisture() {
  int raw_value = analogRead(SOIL_PIN);
  // ESP32 ADC is 12-bit (0-4095). 
  // 4095 = bone dry air, ~1600 = very wet soil (adjust 1600 based on testing)
  int moisture_percent = map(raw_value, 4095, 1600, 0, 100);
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
  long targetSteps = 7 * stepsPerRevolution;
  
  roofMotor1.setMaxSpeed(500);
  roofMotor1.setAcceleration(200);
  roofMotor2.setMaxSpeed(500);
  roofMotor2.setAcceleration(200);

  if (closeRoof) {
    roofMotor1.move(-targetSteps);
    roofMotor2.move(-targetSteps);
  } else {
    roofMotor1.move(targetSteps);
    roofMotor2.move(targetSteps);
  }

  // Run both motors simultaneously until done
  while (roofMotor1.distanceToGo() != 0 || roofMotor2.distanceToGo() != 0) {
    roofMotor1.run();
    roofMotor2.run();
    yield();
  }
}

void loop() {
  // manual operation watch trigger
  if (Serial.available() > 0) {
    String user_input = Serial.readStringUntil('\n');
    user_input.trim();
    user_input.toLowerCase();

    if (user_input == "water") {
      Serial.println("\n[Manual Test Triggered]");
      water_the_plant(5);
    } 
    else if (user_input == "open") {
      Serial.println("\n[Manual Roof Open Triggered]");
      if (!roofIsOpen) {
        moveRoofs(false);   
        roofIsOpen = true;  
      } else {
        Serial.println("Roof is already open.");
      }
    } 
    else if (user_input == "close") {
      Serial.println("\n[Manual Roof Close Triggered]");
      if (roofIsOpen) {
        moveRoofs(true);    
        roofIsOpen = false; 
      } else {
        Serial.println("Roof is already closed.");
      }
    }
    else if (user_input == "setopen") {
      if (roofIsOpen) {
        Serial.println("Roof is already open");
      } else {
        Serial.println("\n[Set roof state to open]");
        roofIsOpen = true;
      }
    }
    else if (user_input == "setclose") {
      if (!roofIsOpen) {
        Serial.println("Roof is already closed");
      } else {
        Serial.println("\n[Set roof state to closed]");
        roofIsOpen = false;
      }
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
  
  yield(); 
}