# signalk-raspberry-pi-bme280
BME-280/BMP-280 temperature, pressure and humidity (BME only) sensor information for SignalK. This plugin can be downloaded via the SignalK application.

## Getting Started
You will need a raspberry pi with SignalK installed along with a BME280 or BMP280 sensor.

### The BME280 sensor
Personally I am using the sensor found at the following link on Amazon. However there are many manufacturers to pick from. I liked the form factor and cable harness of this one.

Waveshare BME280 Environmental Sensor Sensing Environmental Temperature Humidity and barometric Pressure for Raspberry Pi Arduino STM32 I2C and SPI Interfaces
by waveshare
Learn more: https://smile.amazon.com/dp/B07GZCZFVG/ref=cm_sw_em_r_mt_dp_U_goxICbDQBFVHW

### Connecting the Sensor
All you need are pins 1 (3.3V Power), 3 (I2C1 SDA), 5 (I2C1 SCL) and 9 (GND). You need to connect these pins to VIN, SDA, SCL and GND pins of the BME module respectively. You need to make sure Raspberry Pi is turned off while doing this!

In order to use the sensor, the i2c bus must be enabled on your rasbperry pi. This can be accomplished using
sudo raspi-config.

## Troubleshooting
When you first start SK, you should see one of two things in the /var/log/syslog; BME280 initialization succeeded or BME280 initialization failed along with details of the failure.

If the sensor isn't found you can run `ls /dev/*i2c*` which should return `/dev/i2c-1`. If it doesnt return then make sure that the i2c bus is enabled using raspi-config.

You can also download the i2c-tools by running `sudo apt-get install -y i2c-tools`. Once those are installed you can run `i2cdetect -y 1`. You should see the BME280 detected as address 0x76 or 0x77. Here it is detected at 0x77. 

![i2cdetect](https://user-images.githubusercontent.com/30420708/77917295-02f10c00-7260-11ea-93e7-ae66e7deb47b.png)

If the sensor isn't detcted then go back and check the sensor wiring.

## Authors
* **Jeremy Carter** - *Author of this plugin*
