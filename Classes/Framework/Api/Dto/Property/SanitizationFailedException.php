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

namespace Neos\Neos\Ui\Framework\Api\Dto\Property;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\ApiException;

#[Flow\Proxy(false)]
final class SanitizationFailedException extends ApiException
{
    private function __construct(
        public readonly string $propertyName,
        string $message,
        int $code
    ) {
        parent::__construct(
            sprintf('Sanitization for property "%s" failed: %s', $propertyName, $message),
            $code
        );
    }

    public static function becauseTheGivenValueHasTheWrongTypeAnCannotBeConverted(
        string $propertyName,
        string $expectedType,
        string $givenType
    ): self {
        return new self(
            propertyName: $propertyName,
            message: sprintf(
                'Expected property "%s" to be of type "%s". Got value of type "%s" instead, '
                . 'which could not be converted to "%s".',
                $propertyName,
                $expectedType,
                $givenType,
                $expectedType
            ),
            code: 1671922175
        );
    }

    public function jsonSerialize(): mixed
    {
        return [
            ...parent::jsonSerialize(),
            'propertyName' => $this->propertyName
        ];
    }
}
