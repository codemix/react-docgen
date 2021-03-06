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
exports['default'] = getTypeAnnotation;

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

var types = _recast2['default'].types.namedTypes;

function hasTypeAnnotation(path) {
  return !!path.node.typeAnnotation;
}

/**
 * Gets the most inner valuable TypeAnnotation from path. If no TypeAnnotation
 * can be found nothing is returned
 */

function getTypeAnnotation(path) {
  if (!hasTypeAnnotation(path)) return null;

  var resultPath = path;
  do {
    resultPath = resultPath.get('typeAnnotation');
  } while (hasTypeAnnotation(resultPath) && !types.Type.check(resultPath.node));

  return resultPath;
}

module.exports = exports['default'];