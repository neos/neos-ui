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

namespace Neos\Neos\Ui\Framework\Api\Query;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\ApiException;
use Neos\Neos\Ui\Framework\TypeUtility;

#[Flow\Proxy(false)]
final class CannotHandleQueryException extends ApiException
{
    private function __construct(
        string $scope,
        string $message,
        int $code,
        ?\Throwable $cause = null
    ) {
        parent::__construct(
            sprintf('[%s]: Cannot handle query, because %s', $scope, $message),
            $code,
            $cause
        );
    }

    public static function becauseNoQueryClassNameWasSpecified(
        string $apiClassName
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            'the incoming query did not specify a "__type" field.',
            1673535621
        );
    }

    public static function becauseQueryClassNameIsUnknown(
        string $apiClassName,
        string $queryClassName
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf('the query class "%s" is unknown.', $queryClassName),
            1673535622
        );
    }

    public static function becauseQueryCouldNotBeDeserialized(
        string $apiClassName,
        string $queryClassName,
        \Throwable $cause
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf(
                'the incoming query could not be deserialized into "%s".',
                TypeUtility::getShortNameForClassName($queryClassName)
            ),
            1673535623,
            $cause
        );
    }

    public static function becauseQueryHandlerDoesNotExist(
        string $apiClassName,
        string $queryClassName,
        string $queryHandlerClassName
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf(
                'the query "%s" specifies an unknown query handler class "%s".',
                TypeUtility::getShortNameForClassName($queryClassName),
                $queryHandlerClassName
            ),
            1673535624
        );
    }

    public static function becauseQueryHandlerCouldNotBeInstantiated(
        string $apiClassName,
        string $queryHandlerClassName,
        \Throwable $cause
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf(
                'query handler "%s" could not be instantiated.',
                TypeUtility::getShortNameForClassName($queryHandlerClassName)
            ),
            1673535625,
            $cause
        );
    }
}
