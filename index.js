/*
 * Copyright 2019 Jeremy Carter <jncarter@hotmail.com>
 *
 * Add the MIT license
 */

const BME280 = require('bme280-sensor')

module.exports = function (app) {
  let timer = null
  let plugin = {}

  plugin.id = 'signalk-raspberry-pi-bme280'
  plugin.name = 'Raspberry-Pi BME280'
  plugin.description = 'BME280 temperature sensors on Raspberry-Pi'

  plugin.schema = {
    type: 'object',
    properties: {
      rate: {
        title: "Sample Rate (in seconds) for all sensors",
        type: 'number',
        default: 60
      },
      sensors: {
        type: 'array',
        items: {
          type: 'object',
          minItems: 1,
          properties: {
            path: {
              type: 'string',
              title: 'SignalK Path',
              description: 'This is used to build the path in Signal K. It will be appended to \'environment\'',
              default: 'inside.salon'
            },
            i2c_bus: {
              type: 'integer',
              title: 'I2C bus number',
              default: 1,
            },
            i2c_address: {
              type: 'string',
              title: 'I2C address',
              default: BME280.BME280_DEFAULT_I2C_ADDRESS(),
            },
          }
        }
      }
    }
  }

  plugin.start = function (options) {
    function createDeltaMessage (observations) {
      const values_arr = []
      for (const[index, data] of observations.entries()) {
        //console.log(`Data: = ${JSON.stringify(data, null, 2)} Idx = ${JSON.stringify(index, null, 2)}`);
        const temperature = data.measurements.temperature_C + 273.15;
        const pressure = data.measurements.pressure_hPa * 100;
        const humidity = data.measurements.humidity;
        values_arr.push(
          {
            'path': 'environment.' + data.path + '.temperature',
            'value': temperature
          }
        );
        values_arr.push(
          {
            'path': 'environment.' + data.path + '.humidity',
            'value': humidity
          }
        );
        values_arr.push(
          {
            'path': 'environment.' + data.path + '.pressure',
             'value': pressure
           }
        );
      }; 
      return {
        'context': 'vessels.' + app.selfId,
        'updates': [
          {
            'source': {
              'label': plugin.id
            },
            'timestamp': (new Date()).toISOString(),
            'values': values_arr
          }
        ]
      }
    }

    // Read BME280 sensor data
    function readSensorData() {
      const all_data = []

      const data_complete = new Promise((resolve, reject) => {
        bme_sensors.forEach(function(value, index, array) {
          value.bme.readSensorData()
            .then((data) => {
              //console.log(`sensor_data[${value.path}] = ${JSON.stringify(data, null, 2)}`);
              all_data.push({path: value.path, measurements: data})
              if (index === array.length -1) resolve();
            })
            .catch((err) => {
              console.log(`BME280 read error: ${err}`);
            });
        });
      });
      data_complete.then(() => {
        // create message from all sensor data.
        const delta = createDeltaMessage(all_data)
    
        app.handleMessage(plugin.id, delta)
      });
    }

    // The BME280 constructor options are optional.
    const sensors = options.sensors
    const bme_sensors = [];
    for (const[index, value] of sensors.entries()) {
      //console.log(`Sensor settings[${index}] = ${JSON.stringify(value, null, 2)}`)
      const bmeoptions = {
        i2cBusNo   : value.i2c_bus || 1, // defaults to 1
        i2cAddress : Number(value.i2c_address || BME280.BME280_DEFAULT_I2C_ADDRESS()), // defaults to 0x77
      };
      const bme280 = new BME280(bmeoptions);
      bme_sensors.push({path: value.path, bme: bme280});
    };
    //TODO: Is it worth validating the input to ensure uniqueness?

    const init_complete = new Promise((resolve, reject) => {
      bme_sensors.forEach(function(value, index, array) {
        value.bme.init().then(() => {
          console.log(`BME280[${value.path}] initialization succeeded`);
          if (index === array.length -1) resolve();
        })
        .catch((err) => {
          console.error(`BME280[${value.path}] initialization failed: ${err} `);
        });
      }); 
    });
    init_complete.then(() => {
      readSensorData()

      timer = setInterval(readSensorData, options.rate * 1000);
    });
  }

  plugin.stop = function () {
    if (timer){
      clearInterval(timer);
      timeout = null;
    }
  }

  return plugin
}
