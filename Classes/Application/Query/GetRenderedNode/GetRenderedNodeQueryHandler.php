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

namespace Neos\Neos\Ui\Application\Query\GetRenderedNode;

use GuzzleHttp\Psr7\ServerRequest;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\Arguments;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Fusion\Core\Cache\ContentCache;
use Neos\Neos\View\FusionView;
use Neos\Neos\Fusion\Helper\CachingHelper;
use Neos\Neos\Ui\ContentRepository\Service\NodeService;

#[Flow\Scope("singleton")]
final class GetRenderedNodeQueryHandler
{
    #[Flow\Inject]
    protected NodeService $nodeService;

    #[Flow\Inject]
    protected CachingHelper $cachingHelper;

    #[Flow\Inject]
    protected ContentCache $contentCache;

    public function handle(GetRenderedNodeQuery $query): GetRenderedNodeQueryResult
    {
        $node = $this->nodeService->getNodeFromContextPath($query->nodeContextPath);
        $cacheTags = $this->cachingHelper->nodeTag($node);
        foreach ($cacheTags as $tag) {
            $this->contentCache->flushByTag($tag);
        }

        $fusionView = new FusionView();
        $fusionView->setControllerContext($this->buildControllerContext());

        $fusionView->assign('value', $node);
        $fusionView->setFusionPath($query->fusionPath);

        return new GetRenderedNodeQueryResult(
            html: $fusionView->render()
        );
    }

    private function buildControllerContext(): ControllerContext
    {
        $httpRequest = ServerRequest::fromGlobals();
        $request = ActionRequest::fromHttpRequest($httpRequest);
        $request->setControllerPackageKey('Neos.Flow');
        $uriBuilder = new UriBuilder();
        $uriBuilder->setRequest($request);

        return new ControllerContext(
            $request,
            new ActionResponse(),
            new Arguments([]),
            $uriBuilder
        );
    }
}
