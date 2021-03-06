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

/*eslint no-use-before-define: 0*/

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getPropType;

var _utilsDocblock = require('../utils/docblock');

var _getMembers = require('./getMembers');

var _getMembers2 = _interopRequireDefault(_getMembers);

var _getPropertyName = require('./getPropertyName');

var _getPropertyName2 = _interopRequireDefault(_getPropertyName);

var _utilsIsRequiredPropType = require('../utils/isRequiredPropType');

var _utilsIsRequiredPropType2 = _interopRequireDefault(_utilsIsRequiredPropType);

var _printValue = require('./printValue');

var _printValue2 = _interopRequireDefault(_printValue);

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

var _resolveToValue = require('./resolveToValue');

var _resolveToValue2 = _interopRequireDefault(_resolveToValue);

var types = _recast2['default'].types.namedTypes;

function getEnumValues(path) {
  return path.get('elements').map(function (elementPath) {
    return {
      value: (0, _printValue2['default'])(elementPath),
      computed: !types.Literal.check(elementPath.node)
    };
  });
}

function getPropTypeOneOf(argumentPath) {
  var type = { name: 'enum' };
  if (!types.ArrayExpression.check(argumentPath.node)) {
    type.computed = true;
    type.value = (0, _printValue2['default'])(argumentPath);
  } else {
    type.value = getEnumValues(argumentPath);
  }
  return type;
}

function getPropTypeOneOfType(argumentPath) {
  var type = { name: 'union' };
  if (!types.ArrayExpression.check(argumentPath.node)) {
    type.computed = true;
    type.value = (0, _printValue2['default'])(argumentPath);
  } else {
    type.value = argumentPath.get('elements').map(getPropType);
  }
  return type;
}

function getPropTypeArrayOf(argumentPath) {
  var type = { name: 'arrayOf' };
  var subType = getPropType(argumentPath);

  if (subType.name === 'unknown') {
    type.value = (0, _printValue2['default'])(argumentPath);
    type.computed = true;
  } else {
    type.value = subType;
  }
  return type;
}

function getPropTypeShape(argumentPath) {
  var type = { name: 'shape', value: 'unkown' };
  if (!types.ObjectExpression.check(argumentPath.node)) {
    argumentPath = (0, _resolveToValue2['default'])(argumentPath);
  }

  if (types.ObjectExpression.check(argumentPath.node)) {
    var value = {};
    argumentPath.get('properties').each(function (propertyPath) {
      var descriptor = getPropType(propertyPath.get('value'));
      var docs = (0, _utilsDocblock.getDocblock)(propertyPath);
      if (docs) {
        descriptor.description = docs;
      }
      descriptor.required = (0, _utilsIsRequiredPropType2['default'])(propertyPath.get('value'));
      value[(0, _getPropertyName2['default'])(propertyPath)] = descriptor;
    });
    type.value = value;
  }

  return type;
}

function getPropTypeInstanceOf(argumentPath) {
  return {
    name: 'instanceOf',
    value: (0, _printValue2['default'])(argumentPath)
  };
}

var simplePropTypes = {
  array: 1,
  bool: 1,
  func: 1,
  number: 1,
  object: 1,
  string: 1,
  any: 1,
  element: 1,
  node: 1
};

var propTypes = {
  oneOf: getPropTypeOneOf,
  oneOfType: getPropTypeOneOfType,
  instanceOf: getPropTypeInstanceOf,
  arrayOf: getPropTypeArrayOf,
  shape: getPropTypeShape
};

/**
 * Tries to identify the prop type by inspecting the path for known
 * prop type names. This method doesn't check whether the found type is actually
 * from React.PropTypes. It simply assumes that a match has the same meaning
 * as the React.PropTypes one.
 *
 * If there is no match, "custom" is returned.
 */

function getPropType(path) {
  var descriptor;
  (0, _getMembers2['default'])(path, true).some(function (member) {
    var node = member.path.node;
    var name;
    if (types.Literal.check(node)) {
      name = node.value;
    } else if (types.Identifier.check(node) && !member.computed) {
      name = node.name;
    }
    if (name) {
      if (simplePropTypes.hasOwnProperty(name)) {
        descriptor = { name: name };
        return true;
      } else if (propTypes.hasOwnProperty(name) && member.argumentsPath) {
        descriptor = propTypes[name](member.argumentsPath.get(0));
        return true;
      }
    }
  });
  if (!descriptor) {
    var node = path.node;
    if (types.Identifier.check(node) && simplePropTypes.hasOwnProperty(node.name)) {
      descriptor = { name: node.name };
    } else if (types.CallExpression.check(node) && types.Identifier.check(node.callee) && propTypes.hasOwnProperty(node.callee.name)) {
      descriptor = propTypes[node.callee.name](path.get('arguments', 0));
    } else {
      descriptor = { name: 'custom', raw: (0, _printValue2['default'])(path) };
    }
  }
  return descriptor;
}

module.exports = exports['default'];