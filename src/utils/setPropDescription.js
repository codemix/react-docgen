/*
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 *
 */

import type Documentation from '../Documentation';
import getPropertyName from './getPropertyName';
import { getDocblock } from './docblock';

/**
 *
 */
export default (documentation: Documentation, propertyPath: NodePath) => {
  const propName = getPropertyName(propertyPath);
  const propDescriptor = documentation.getPropDescriptor(propName);

  if (propDescriptor.description) {
    console.warn(`Description of prop '${propName}' already set. Don't mix propTypes and flow in one single component.`);
    return;
  }

  propDescriptor.description = getDocblock(propertyPath) || '';
}
