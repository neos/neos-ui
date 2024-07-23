<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\TestNodeTypes\Application\WriteAdditionalSettings;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final class WriteAdditionalSettingsCommand
{
    /**
     * @param array<mixed> $settings
     */
    public function __construct(
        public readonly array $settings
    ) {
    }

    public static function fromArray(array $array): self
    {
        isset($array['settings']) or
            throw new \InvalidArgumentException('"settings" must be set.');

        is_array($array['settings']) or
            throw new \InvalidArgumentException('"settings" must be an array.');

        return new self(
            settings: $array['settings']
        );
    }
}
