/*
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 *
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getPropertyName = require('./getPropertyName');

var _getPropertyName2 = _interopRequireDefault(_getPropertyName);

var _docblock = require('./docblock');

/**
 *
 */

exports['default'] = function (documentation, propertyPath) {
  var propName = (0, _getPropertyName2['default'])(propertyPath);
  var propDescriptor = documentation.getPropDescriptor(propName);

  if (propDescriptor.description) {
    return;
  }

  propDescriptor.description = (0, _docblock.getDocblock)(propertyPath) || '';
};

module.exports = exports['default'];