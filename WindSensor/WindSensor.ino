/*
   A demo sketch for the Modern Device Rev P Wind Sensor
  Requires a Wind Sensor Rev P from Modern Device
  http://moderndevice.com/product/wind-sensor-rev-p/
  The Rev P requires at least at least an 8 volt supply. The easiest way to power it
  if you are using an Arduino is to use a 9 volt or higher supply on the external power jack
  and power the sensor from Vin.
  Hardware hookup
  Sensor     Arduino Pin
  Ground     Ground
  +10-12V      Vin
  Out          A0
  TMP          A2
  Paul Badger
  code in the public domain*/

const int OutPin  = A0;   // wind sensor analog pin  hooked up to Wind P sensor "OUT" pin
const int TempPin = A2;   // temp sesnsor analog pin hooked up to Wind P sensor "TMP" pin

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Read wind.
  int windADunits = analogRead(OutPin);
  // Serial.print("RW ");   // print raw A/D for debug
  // Serial.print(windADunits);
  // Serial.print("\t");

  // Wind formula derived from a wind tunnel data,
  // annemometer and some fancy Excel regressions.
  // This scalin doesn't have any temperature correction in it yet.
  float offset = 264.0;
  float windMPH = windADunits < offset
                  ? 0
                  : pow((((float)windADunits - offset) / 85.6814), 3.36814);
                  
  Serial.print(windMPH);
  Serial.print("\n");
  
  delay(50);
}
