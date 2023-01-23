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

namespace Neos\Neos\Ui\Framework\Api;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
abstract class ApiException extends \Exception implements \JsonSerializable
{
    public function jsonSerialize(): mixed
    {
        $result = [
            '__type' => static::class,
            'code' => $this->getCode(),
            'message' => $this->getMessage()
        ];

        if ($previous = $this->getPrevious()) {
            $result['cause'] = self::serializeCause($previous);
        }

        return $result;
    }

    private function serializeCause(\Throwable $cause): array|\JsonSerializable
    {
        if ($cause instanceof ApiException) {
            return $cause;
        }

        $result = [];
        $result['__type'] = $cause::class;
        if (($code = $cause->getCode()) !== null) {
            $result['code'] = $code;
        }
        $result['message'] = $cause->getMessage();
        $result['trace'] = \iterator_to_array(self::serializeTrace($cause->getTrace()));

        return $result;
    }

    private function serializeTrace(array $trace): \Traversable
    {
        foreach ($trace as $step) {
            $step = is_array($step) ? $step : [];

            yield [
                'file' => $step['file'] ?? null,
                'line' => $step['line'] ?? null,
                'function' => $step['function'] ?? null,
                'class' => $step['class'] ?? null,
            ];
        }
    }
}
