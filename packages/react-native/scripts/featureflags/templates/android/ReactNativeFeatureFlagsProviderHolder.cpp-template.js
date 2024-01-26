/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

const {
  DO_NOT_MODIFY_COMMENT,
  getCxxTypeFromDefaultValue,
} = require('../../utils');
const signedsource = require('signedsource');

module.exports = config =>
  signedsource.signFile(`/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * ${signedsource.getSigningToken()}
 */

${DO_NOT_MODIFY_COMMENT}

#include "ReactNativeFeatureFlagsProviderHolder.h"

namespace facebook::react {

${Object.entries(config.common)
  .map(
    ([flagName, flagConfig]) =>
      `${getCxxTypeFromDefaultValue(
        flagConfig.defaultValue,
      )} ReactNativeFeatureFlagsProviderHolder::${flagName}() {
  static const auto method =
      facebook::jni::findClassStatic(
          "com/facebook/react/internal/featureflags/ReactNativeFeatureFlagsProvider")
          ->getMethod<jboolean()>("${flagName}");
  return method(javaProvider_);
}`,
  )
  .join('\n\n')}

} // namespace facebook::react
`);