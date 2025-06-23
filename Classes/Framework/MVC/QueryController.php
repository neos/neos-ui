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

namespace Neos\Neos\Ui\Framework\MVC;

use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\Controller\ControllerInterface;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;
use Psr\Http\Message\ResponseInterface;

abstract class QueryController implements ControllerInterface
{
    public function processRequest(ActionRequest $request): ResponseInterface
    {
        try {
            $arguments = $request->getArguments();
            $queryResponse = $this->processQuery($arguments);
        } catch (\InvalidArgumentException $e) {
            $queryResponse = QueryResponse::clientError($e);
        } catch (\Exception $e) {
            $queryResponse = QueryResponse::serverError($e);
        }

        return $queryResponse->toHttpResponse();
    }

    /**
     * @param array<mixed> $arguments
     */
    abstract function processQuery(array $arguments): QueryResponse;
}
