'use strict';

const api = {};
api.os = require('os');
api.path = require('path');
api.events = require('events');
api.crypto = require('crypto');
api.common = {};
module.exports = api.common;

const submodules = [
  'data', // Data structures manipulations
  'strings', // Strings utilities
  'time', // Data and Time functions
  'misc', // Miscellaneous tools
  'units', // Units conversion
  'network', // Network utilities
  'id', // Kyes and identifiers
  'sort', // Sort compare functions
  'cache', // Cache (enhanced Map)
  'functional' // Functional programming
];

submodules
  .map(path => './lib/' + path)
  .map(require)
  .map(exports => exports(api));
