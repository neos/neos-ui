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

namespace Neos\Neos\Ui\Infrastructure\Configuration;

use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Domain\Model\User;
use Neos\Neos\Ui\Domain\InitialData\InitialStateProviderInterface;
use Neos\Neos\Ui\Domain\Service\ConfigurationRenderingService;
use Neos\Neos\Ui\Service\NodeClipboard;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class InitialStateProvider implements InitialStateProviderInterface
{
    #[Flow\Inject]
    protected ConfigurationRenderingService $configurationRenderingService;

    #[Flow\Inject]
    protected NodeClipboard $clipboard;

    /** @var array<mixed> */
    #[Flow\InjectConfiguration('initialState')]
    protected array $initialStateBeforeProcessing;

    public function getInitialState(
        ControllerContext $controllerContext,
        ContentRepositoryId $contentRepositoryId,
        ?Node $documentNode,
        ?Node $site,
        User $user,
    ): array {
        return $this->configurationRenderingService->computeConfiguration(
            $this->initialStateBeforeProcessing,
            [
                'controllerContext' => $controllerContext,
                'contentRepositoryId' => $contentRepositoryId,
                'documentNode' => $documentNode,
                'site' => $site,
                'user' => $user,
                'clipboardNodes' => $this->clipboard->getSerializedNodeAddresses(),
                'clipboardMode' => $this->clipboard->getMode(),
            ]
        );
    }
}
