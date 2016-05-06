'use strict';

let util = require('util');
let EventEmitter = require('events');
let _ = require('lodash');
let endpoints = require('../endpoints.json');
let riot = require('riot-api-client');

function Riot() {
    EventEmitter.call(this);
}

util.inherits(Riot, EventEmitter);

Riot.prototype.getFreeChamps = (region) => {
      region = _.lowerCase(region);
      let endpoint = this.getEndpoint(region);
      
      if (_.isNull(endpoint)) {
          let err = new Error('Endpoint not found');
          this.emit('error', err);
          return;
      }
};

Riot.prototype.getEndpoint = (region) => {
    found = _.find(endpoints, {'region': region});
    return  (!_.isUndefined(found)) ? found.endpoint : null;  
};