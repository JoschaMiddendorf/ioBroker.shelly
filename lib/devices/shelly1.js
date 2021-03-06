/* jshint -W097 */
/* jshint -W030 */
/* jshint strict:true */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';

const shellyHelper = require('../shelly-helper');

/**
 * Shelly 1 / SHSW-1 / shelly1
 * CoAP:
 *  {"blk":[{"I":0,"D":"Relay0"},{"I":1,"D":"Sensors"}],"sen":[{"I":112,"T":"S","D":"Switch","R":"0/1","L":0},{"I":118,"T":"S","D":"Input","R":"0(off)/1(on)/2(longpush)","L":0}]}
 */
let shelly1 = {
  'Relay0.Switch': {
    coap: {
      coap_publish: '112',
      coap_publish_funct: (value) => { return value == 1 ? true : false; },
      http_cmd: '/relay/0',
      http_cmd_funct: (value) => { return value === true ? { turn: 'on' } : { turn: 'off' }; },
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/relay/0',
      mqtt_publish_funct: (value) => { return value === 'on'; },
      mqtt_cmd: 'shellies/shelly1-<deviceid>/relay/0/command',
      mqtt_cmd_funct: (value) => { return value === true ? 'on' : 'off'; },
    },
    common: {
      'name': 'Switch',
      'type': 'boolean',
      'role': 'switch',
      'read': true,
      'write': true,
      'def': false
    }
  },
  'Relay0.Input': {
    coap: {
      coap_publish: '118',
      coap_publish_funct: (value) => { return value === 1 || value === 2 ? true : false; },
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/input/0',
      mqtt_publish_funct: (value) => { return value == 1 ? true : false; },
    },
    common: {
      'name': 'Input / Detach',
      'type': 'boolean',
      'role': 'state',
      'read': true,
      'write': false,
      'def': false
    }
  },
  'Relay0.longpush': {
    coap: {
      coap_publish: '118',
      coap_publish_funct: (value) => { return value === 2 ? true : false; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/longpush/0',
      mqtt_publish_funct: (value) => { return value == 1 ? true : false; },
    },
    common: {
      'name': 'Longpush',
      'type': 'boolean',
      'role': 'state',
      'read': true,
      'write': false,
      'def': false
    }
  },
  'Relay0.AutoTimerOff': {
    coap: {
      http_publish: '/settings',
      http_publish_funct: (value) => { return value ? JSON.parse(value).relays[0].auto_off : undefined; },
      http_cmd: '/settings/relay/0',
      http_cmd_funct: (value) => { return { auto_off: value }; }
    },
    mqtt: {
      http_publish: '/settings',
      http_publish_funct: (value) => { return value ? JSON.parse(value).relays[0].auto_off : undefined; },
      http_cmd: '/settings/relay/0',
      http_cmd_funct: (value) => { return { auto_off: value }; }
    },
    common: {
      'name': 'Auto Timer Off',
      'type': 'number',
      'role': 'level.timer',
      'def': 0,
      'unit': 's',
      'read': true,
      'write': true
    }
  },
  'Relay0.AutoTimerOn': {
    coap: {
      http_publish: '/settings',
      http_publish_funct: (value) => { return value ? JSON.parse(value).relays[0].auto_on : undefined; },
      http_cmd: '/settings/relay/0',
      http_cmd_funct: (value) => { return { auto_on: value }; }
    },
    mqtt: {
      http_publish: '/settings',
      http_publish_funct: (value) => { return value ? JSON.parse(value).relays[0].auto_on : undefined; },
      http_cmd: '/settings/relay/0',
      http_cmd_funct: (value) => { return { auto_on: value }; }
    },
    common: {
      'name': 'Auto Timer Off',
      'type': 'number',
      'role': 'level.timer',
      'def': 0,
      'unit': 's',
      'read': true,
      'write': true
    }
  },
  'Relay0.ButtonType': {
    coap: {
      http_publish: '/settings',
      http_cmd: '/settings/relay/0',
      http_publish_funct: (value) => { return value ? JSON.parse(value).relays[0].btn_type : undefined; },
      http_cmd_funct: (value) => { return { btn_type: value }; }
    },
    mqtt: {
      http_publish: '/settings',
      http_cmd: '/settings/relay/0',
      http_publish_funct: (value) => { return value ? JSON.parse(value).relays[0].btn_type : undefined; },
      http_cmd_funct: (value) => { return { btn_type: value }; }
    },
    common: {
      'name': 'Button Type',
      'type': 'string',
      'role': 'state',
      'read': true,
      'write': true,
      'states': 'momentary:momentary;toggle:toggle;edge:edge;detached:detached;action:action;cycle:cycle;momentary_on_release:momentary_on_release'
    }
  },
  'Relay0.ButtonReverse': {
    coap: {
      http_publish: '/settings',
      http_cmd: '/settings/relay/0',
      http_publish_funct: (value) => { return value ? JSON.parse(value).relays[0].btn_reverse : undefined; },
      http_cmd_funct: (value) => { return { btn_reverse: value }; }
    },
    mqtt: {
      http_publish: '/settings',
      http_cmd: '/settings/relay/0',
      http_publish_funct: (value) => { return value ? JSON.parse(value).relays[0].btn_reverse : undefined; },
      http_cmd_funct: (value) => { return { btn_reverse: value }; }
    },
    common: {
      'name': 'Button Type',
      'type': 'number',
      'role': 'state',
      'read': true,
      'write': true,
      'states': '0:normal;1:inverted'
    }
  },
  'ext.temperatureC1': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtTemp(JSON.parse(value), '0', 'C') : undefined; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/ext_temperature/0',
      mqtt_publish_funct: (value) => { return String(value).replace(/[^0-9\.]/g, ''); }
    },
    common: {
      'name': 'External Temperature',
      'type': 'number',
      'role': 'value.temperature',
      'unit': '°C',
      'read': true,
      'write': false
    }
  },
  'ext.temperatureC2': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtTemp(JSON.parse(value), '1', 'C') : undefined; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/ext_temperature/1',
      mqtt_publish_funct: (value) => { return String(value).replace(/[^0-9\.]/g, ''); }
    },
    common: {
      'name': 'External Temperature',
      'type': 'number',
      'role': 'value.temperature',
      'unit': '°C',
      'read': true,
      'write': false
    }
  },
  'ext.temperatureC3': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtTemp(JSON.parse(value), '2', 'C') : undefined; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/ext_temperature/2',
      mqtt_publish_funct: (value) => { return String(value).replace(/[^0-9\.]/g, ''); }
    },
    common: {
      'name': 'External Temperature',
      'type': 'number',
      'role': 'value.temperature',
      'unit': '°C',
      'read': true,
      'write': false
    }
  },
  'ext.temperatureC4': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtTemp(JSON.parse(value), '3', 'C') : undefined; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/ext_temperature/3',
      mqtt_publish_funct: (value) => { return String(value).replace(/[^0-9\.]/g, ''); }
    },
    common: {
      'name': 'External Temperature',
      'type': 'number',
      'role': 'value.temperature',
      'unit': '°C',
      'read': true,
      'write': false
    }
  },
  'ext.temperatureF1': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtTemp(JSON.parse(value), '0', 'F') : undefined; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/ext_temperature_f/0',
      mqtt_publish_funct: (value) => { return String(value).replace(/[^0-9\.]/g, ''); }
    },
    common: {
      'name': 'External Temperature',
      'type': 'number',
      'role': 'value.temperature',
      'unit': '°F',
      'read': true,
      'write': false
    }
  },
  'ext.temperatureF2': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtTemp(JSON.parse(value), '1', 'F') : undefined; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/ext_temperature_f/1',
      mqtt_publish_funct: (value) => { return String(value).replace(/[^0-9\.]/g, ''); }
    },
    common: {
      'name': 'External Temperature',
      'type': 'number',
      'role': 'value.temperature',
      'unit': '°F',
      'read': true,
      'write': false
    }
  },
  'ext.temperatureF3': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtTemp(JSON.parse(value), '2', 'F') : undefined; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/ext_temperature_f/2',
      mqtt_publish_funct: (value) => { return String(value).replace(/[^0-9\.]/g, ''); }
    },
    common: {
      'name': 'External Temperature',
      'type': 'number',
      'role': 'value.temperature',
      'unit': '°F',
      'read': true,
      'write': false
    }
  },
  'ext.temperatureF4': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtTemp(JSON.parse(value), '3', 'F') : undefined; }
    },
    mqtt: {
      mqtt_publish: 'shellies/shelly1-<deviceid>/ext_temperature_f/3',
      mqtt_publish_funct: (value) => { return String(value).replace(/[^0-9\.]/g, ''); }
    },
    common: {
      'name': 'External Temperature',
      'type': 'number',
      'role': 'value.temperature',
      'unit': '°F',
      'read': true,
      'write': false
    }
  },
  'ext.humidity1': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtHum(JSON.parse(value), '0') : undefined; }
    },
    mqtt: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtHum(JSON.parse(value), '0') : undefined; }
    },
    common: {
      'name': 'External Humidity',
      'type': 'number',
      'role': 'value.humidity',
      'read': true,
      'write': false,
      'min': 0,
      'max': 100,
      'unit': '%'
    }
  },
  'ext.humidity2': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtHum(JSON.parse(value), '1') : undefined; }
    },
    mqtt: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtHum(JSON.parse(value), '1') : undefined; }
    },
    common: {
      'name': 'External Humidity',
      'type': 'number',
      'role': 'value.humidity',
      'read': true,
      'write': false,
      'min': 0,
      'max': 100,
      'unit': '%'
    }
  },
  'ext.humidity3': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtHum(JSON.parse(value), '2') : undefined; }
    },
    mqtt: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtHum(JSON.parse(value), '2') : undefined; }
    },
    common: {
      'name': 'External Humidity',
      'type': 'number',
      'role': 'value.humidity',
      'read': true,
      'write': false,
      'min': 0,
      'max': 100,
      'unit': '%'
    }
  },
  'ext.humidity4': {
    coap: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtHum(JSON.parse(value), '3') : undefined; }
    },
    mqtt: {
      http_publish: '/status',
      http_publish_funct: (value) => { return value ? shellyHelper.getExtHum(JSON.parse(value), '3') : undefined; }
    },
    common: {
      'name': 'External Humidity',
      'type': 'number',
      'role': 'value.humidity',
      'read': true,
      'write': false,
      'min': 0,
      'max': 100,
      'unit': '%'
    }
  }
};


module.exports = {
  shelly1: shelly1
};
