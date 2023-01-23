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

namespace Neos\Neos\Ui\Framework\Api\Command;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\ApiException;
use Neos\Neos\Ui\Framework\TypeUtility;

#[Flow\Proxy(false)]
final class CannotHandleCommandException extends ApiException
{
    private function __construct(
        string $scope,
        string $message,
        int $code,
        ?\Throwable $cause = null
    ) {
        parent::__construct(
            sprintf('[%s]: Cannot handle command, because %s', $scope, $message),
            $code,
            $cause
        );
    }

    public static function becauseNoCommandClassNameWasSpecified(
        string $apiClassName
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            'the incoming command did not specify a "__type" field.',
            1673537411
        );
    }

    public static function becauseCommandClassNameIsUnknown(
        string $apiClassName,
        string $commandClassName
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf('the command class "%s" is unknown.', $commandClassName),
            1673537412
        );
    }

    public static function becauseCommandCouldNotBeDeserialized(
        string $apiClassName,
        string $commandClassName,
        \Throwable $cause
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf(
                'the incoming command could not be deserialized into "%s".',
                TypeUtility::getShortNameForClassName($commandClassName)
            ),
            1673537413,
            $cause
        );
    }

    public static function becauseCommandHandlerDoesNotExist(
        string $apiClassName,
        string $commandClassName,
        string $commandHandlerClassName
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf(
                'the command "%s" specifies an unknown command handler class "%s".',
                TypeUtility::getShortNameForClassName($commandClassName),
                $commandHandlerClassName
            ),
            1673537414
        );
    }

    public static function becauseCommandHandlerCouldNotBeInstantiated(
        string $apiClassName,
        string $commandHandlerClassName,
        \Throwable $cause
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf(
                'command handler "%s" could not be instantiated.',
                TypeUtility::getShortNameForClassName($commandHandlerClassName)
            ),
            1673537415,
            $cause
        );
    }
}
