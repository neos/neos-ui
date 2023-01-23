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

namespace Neos\Neos\Ui\Framework\Api\Dto;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Dto\Property\SanitizationFailedException;

#[Flow\Proxy(false)]
abstract class Dto implements \JsonSerializable
{
    public static function fromArray(array $json): static
    {
        if (!isset($json['__type'])) {
            throw DeserializationFailedException::becauseNoTypeWasGiven(
                dtoClassName: static::class,
                givenDataStructure: $json
            );
        }

        if ($json['__type'] !== static::class) {
            throw DeserializationFailedException::becauseTheWrongTypeWasGiven(
                dtoClassName: static::class,
                givenDataStructure: $json,
                givenType: $json['__type']
            );
        }

        unset($json['__type']);

        $dtoReflector = new ReflectionDto(new \ReflectionClass(static::class));
        foreach ($dtoReflector->getProperties() as $propertyName => $dtoPropertyReflector) {
            if (!array_key_exists($propertyName, $json)) {
                throw DeserializationFailedException::becauseAPropertyIsMissing(
                    dtoClassName: static::class,
                    givenDataStructure: $json,
                    propertyName: $propertyName,
                    expectedType: 'unknown'
                );
            }

            try {
                $json[$propertyName] = $dtoPropertyReflector->sanitizeValue($json[$propertyName]);
            } catch (SanitizationFailedException $e) {
                throw DeserializationFailedException::becauseSanitizationFailed(
                    dtoClassName: static::class,
                    sanitizationFailedException: $e,
                    givenDataStructure: $json,
                );
            }
        }

        return new static(...$json);
    }

    public function jsonSerialize(): mixed
    {
        return [
            '__type' => $this::class,
            ...((array) $this)
        ];
    }
}
