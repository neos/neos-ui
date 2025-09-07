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

namespace Neos\Neos\Ui\LinkEditor\Framework\MVC;

use GuzzleHttp\Psr7\Response;
use Neos\Flow\Annotations as Flow;
use Psr\Http\Message\ResponseInterface;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class QueryResponse
{
    private const STATUS_CODE_SUCCESS = 200;
    private const STATUS_CODE_CLIENT_ERROR = 400;
    private const STATUS_CODE_SERVER_ERROR = 500;

    private const DISCRIMINATOR_SUCCESS = 'success';
    private const DISCRIMINATOR_ERROR = 'error';

    /**
     * @param array<mixed>|\JsonSerializable $payload
     */
    private function __construct(
        private readonly int $statusCode,
        private readonly string $discriminator,
        private readonly array|\JsonSerializable $payload,
    ) {
    }

    /**
     * @param array<mixed>|\JsonSerializable $payload
     */
    public static function success(array|\JsonSerializable $payload): self
    {
        return new self(
            statusCode: self::STATUS_CODE_SUCCESS,
            discriminator: self::DISCRIMINATOR_SUCCESS,
            payload: $payload,
        );
    }

    public static function clientError(\Exception $exception): self
    {
        return new self(
            statusCode: self::STATUS_CODE_CLIENT_ERROR,
            discriminator: self::DISCRIMINATOR_ERROR,
            payload: [
                'type' => $exception::class,
                'code' => $exception->getCode(),
                'message' => $exception->getMessage(),
            ],
        );
    }

    public static function serverError(\Exception $exception): self
    {
        return new self(
            statusCode: self::STATUS_CODE_SERVER_ERROR,
            discriminator: self::DISCRIMINATOR_ERROR,
            payload: [
                'type' => $exception::class,
                'code' => $exception->getCode(),
                'message' => $exception->getMessage(),
            ],
        );
    }

    public function toHttpResponse(): ResponseInterface
    {
        return new Response(
            status: $this->statusCode,
            headers: [
                'Content-Type' => 'application/json'
            ],
            body: json_encode(
                [$this->discriminator => $this->payload],
                JSON_THROW_ON_ERROR
            )
        );
    }
}
