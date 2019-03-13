# signalk-raspberry-pi-bme280
BME-280 temperature, humidity, and pressure sensor information for SignalK. This plugin can be downloaded via the SignalK application.

##Getting Started
You will need a raspberry pi with SignalK installed along with a BME280 sensor.

### The BME280 sensor
Personally I am using the sensor found at the following link on Amazon. However there are many manufacturers to pick from. I liked the form factor and cable harness of this one.

Waveshare BME280 Environmental Sensor Sensing Environmental Temperature Humidity and barometric Pressure for Raspberry Pi Arduino STM32 I2C and SPI Interfaces
by waveshare
Learn more: https://smile.amazon.com/dp/B07GZCZFVG/ref=cm_sw_em_r_mt_dp_U_goxICbDQBFVHW

### Connecting the Sensor
All you need are pins 1 (3.3V Power), 3 (I2C1 SDA), 5 (I2C1 SCL) and 9 (GND). You need to connect these pins to VIN, SDA, SCL and GND pins of the BME module respectively. You need to make sure Raspberry Pi is turned off while doing this!

In order to use the sensor, the i2c bus must be enabled on your rasbperry pi. This can be accomplished using
sudo raspi-config

## Authors
* **Jeremy Carter** - *Author of this plugin*
