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
use Neos\Neos\Ui\Framework\Api\ApiException;
use Neos\Neos\Ui\Framework\Api\Dto\Property\SanitizationFailedException;

#[Flow\Proxy(false)]
final class DeserializationFailedException extends ApiException
{
    private function __construct(
        public readonly string $dtoClassName,
        public readonly array $givenDataStructure,
        string $message,
        int $code,
        private readonly ?ApiException $previousApiException
    ) {
        parent::__construct(
            sprintf('Deserialization of "%s" failed: %s', $dtoClassName, $message),
            $code,
            $previousApiException
        );
    }

    public static function becauseNoTypeWasGiven(string $dtoClassName, array $givenDataStructure): self
    {
        return new self(
            dtoClassName: $dtoClassName,
            givenDataStructure: $givenDataStructure,
            message: 'The provided data structure did not contain a "__type" key.',
            code: 1671898882,
            previousApiException: null
        );
    }

    public static function becauseTheWrongTypeWasGiven(string $dtoClassName, array $givenDataStructure, string $givenType): self
    {
        return new self(
            dtoClassName: $dtoClassName,
            givenDataStructure: $givenDataStructure,
            message: sprintf(
                'The provided type was expected to be "%s", got "%s" instead.',
                $dtoClassName,
                $givenType
            ),
            code: 1671898883,
            previousApiException: null
        );
    }

    public static function becauseAPropertyIsMissing(string $dtoClassName, array $givenDataStructure, string $propertyName, string $expectedType): self
    {
        return new self(
            dtoClassName: $dtoClassName,
            givenDataStructure: $givenDataStructure,
            message: sprintf(
                'Expected a property "%s" of type "%s" to be provided, but it was missing.',
                $propertyName,
                $expectedType
            ),
            code: 1671898884,
            previousApiException: null
        );
    }

    public static function becauseTheGivenPropertyHasTheWrongType(string $dtoClassName, array $givenDataStructure,string $propertyName, string $expectedType, string $givenType): self
    {
        return new self(
            dtoClassName: $dtoClassName,
            givenDataStructure: $givenDataStructure,
            message: sprintf(
                'Expected a property "%s" of type "%s" to be provided, got "%s" instead.',
                $propertyName,
                $expectedType,
                $givenType
            ),
            code: 1671898885,
            previousApiException: null
        );
    }
    public static function becauseSanitizationFailed(
        string $dtoClassName,
        SanitizationFailedException $sanitizationFailedException,
        array $givenDataStructure
    ): self {
        return new self(
            dtoClassName: $dtoClassName,
            givenDataStructure: $givenDataStructure,
            message: $sanitizationFailedException->getMessage(),
            code: 1671898886,
            previousApiException: $sanitizationFailedException
        );
    }

    public function jsonSerialize(): mixed
    {
        return [
            ...parent::jsonSerialize(),
            'dtoClassName' => $this->dtoClassName,
            'givenDataStructure' => @json_decode(@json_encode($this->givenDataStructure)),
            'previousApiException' => $this->previousApiException
        ];
    }
}
