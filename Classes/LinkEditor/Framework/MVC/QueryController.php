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

use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\Controller\ControllerInterface;
use Neos\Flow\Utility\Environment;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;
use Psr\Http\Message\ResponseInterface;
use Neos\Flow\Annotations as Flow;

abstract class QueryController implements ControllerInterface
{
    /**
     * @Flow\Inject
     * @var Environment
     */
    protected $environment;

    public function processRequest(ActionRequest $request): ResponseInterface
    {
        try {
            // @TODO: It should not be necessary to inject the contentRepositoryId
            // like this. For the time being, it's the only way though.
            $arguments = $request->getArguments();
            if (!isset($arguments['contentRepositoryId'])) {
                $siteDetectionResult = SiteDetectionResult::fromRequest($request->getHttpRequest());
                $arguments['contentRepositoryId'] = $siteDetectionResult->contentRepositoryId->value;
            }

            $queryResponse = $this->processQuery($arguments);
        } catch (\InvalidArgumentException $e) {
            $queryResponse = QueryResponse::createServerSideErrorForBadRequest($e);
        } catch (\Exception $e) {
            $queryResponse = QueryResponse::createServerSideError($e, $this->environment->getContext()->isDevelopment());
        }

        return $queryResponse->toHttpResponse();
    }

    /**
     * @param array<mixed> $arguments
     */
    abstract public function processQuery(array $arguments): QueryResponse;
}
