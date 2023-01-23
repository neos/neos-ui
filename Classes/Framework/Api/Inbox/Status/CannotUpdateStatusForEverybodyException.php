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

namespace Neos\Neos\Ui\Framework\Api\Inbox\Status;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\ApiException;
use Neos\Neos\Ui\Framework\TypeUtility;

#[Flow\Proxy(false)]
final class CannotUpdateStatusForEverybodyException extends ApiException
{
    private function __construct(
        string $scope,
        string $message,
        int $code,
        ?\Throwable $cause = null
    ) {
        parent::__construct(
            sprintf('[%s]: Cannot update status for everybody, because %s', $scope, $message),
            $code,
            $cause
        );
    }

    public static function becauseStatusClassNameIsUnknown(
        string $apiClassName,
        string $statusClassName
    ): self {
        return new self(
            TypeUtility::getShortNameForClassName($apiClassName),
            sprintf('the status class "%s" is unknown.', $statusClassName),
            1673616131
        );
    }
}
