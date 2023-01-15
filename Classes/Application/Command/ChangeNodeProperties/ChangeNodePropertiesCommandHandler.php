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

namespace Neos\Neos\Ui\Application\Command\ChangeNodeProperties;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\NodeServiceInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Application\Dto\Property\PropertyDto;
use Neos\Neos\Ui\Application\Notification\PropertiesWereUpdatedNotification;
use Neos\Neos\Ui\Application\UiApi;
use Neos\Neos\Ui\ContentRepository\Service\NodeService;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;
use Neos\Neos\Ui\Service\NodePropertyValidationService;
use Neos\Utility\ObjectAccess;

#[Flow\Scope("singleton")]
final class ChangeNodePropertiesCommandHandler
{
    #[Flow\Inject]
    protected NodeService $nodeService;

    #[Flow\Inject]
    protected NodeServiceInterface $crNodeService;

    #[Flow\Inject]
    protected NodeTypeManager $nodeTypeManager;

    #[Flow\Inject]
    protected NodePropertyConversionService $nodePropertyConversionService;

    #[Flow\Inject]
    protected NodePropertyValidationService $nodePropertyValidationService;

    #[Flow\Inject]
    protected UiApi $ui;

    public function handle(ChangeNodePropertiesCommand $command): void
    {
        $node = $this->nodeService->getNodeFromContextPath($command->nodeContextPath);
        $nodeType = $node->getNodeType();

        // @TODO: Validation

        $reloadRequired = false;
        foreach ($command->properties as $propertyDto) {
            $reloadRequired = $reloadRequired || ($nodeType->getConfiguration(
                'properties.' . $propertyDto->name . '.ui.reloadIfChanged'
            ) ?? false);

            match ($propertyDto->name) {
                '_nodeType' => $this->changeNodeType($node, $propertyDto),
                default => match (true) {
                    str_starts_with($propertyDto->name, '_') => $this->changeDirectProperty($node, $propertyDto),
                    default => $this->changeProperty($node, $propertyDto)
                }
            };
        }

        $this->ui->notifyCurrentUser(
            new PropertiesWereUpdatedNotification(
                nodeContextPath: $node->getContextPath(),
                reloadRequired: $reloadRequired,
                properties: $command->properties
            )
        );
    }

    protected function changeNodeType(NodeInterface $node, PropertyDto $propertyDto): void
    {
        $oldNodeType = $node->getNodeType();
        $newNodeType = $this->nodeTypeManager->getNodeType($propertyDto->value);

        ObjectAccess::setProperty($node, 'nodeType', $newNodeType);
        $this->crNodeService->cleanUpProperties($node);
        $this->crNodeService->cleanUpAutoCreatedChildNodes($node, $oldNodeType);
        $this->crNodeService->createChildNodes($node);
    }

    protected function changeDirectProperty(NodeInterface $node, PropertyDto $propertyDto): void
    {
        $value = $this->nodePropertyConversionService->convert(
            $node->getNodeType(),
            $propertyDto->name,
            $propertyDto->value,
            $node->getContext()
        );

        ObjectAccess::setProperty($node, substr($propertyDto->name, 1), $value);
    }

    protected function changeProperty(NodeInterface $node, PropertyDto $propertyDto): void
    {
        $value = $this->nodePropertyConversionService->convert(
            $node->getNodeType(),
            $propertyDto->name,
            $propertyDto->value,
            $node->getContext()
        );

        $node->setProperty($propertyDto->name, $value);
    }
}
