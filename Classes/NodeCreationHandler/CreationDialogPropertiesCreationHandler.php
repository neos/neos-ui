<?php
namespace Neos\Neos\Ui\NodeCreationHandler;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;
use Neos\Utility\ObjectAccess;
use Neos\Utility\TypeHandling;

/**
 * A Node Creation Handler that takes the incoming data from the Creation Dialog and sets the corresponding node property
 */
class CreationDialogPropertiesCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * @Flow\Inject
     * @var NodePropertyConversionService
     */
    protected $nodePropertyConversionService;

    public function handle(NodeInterface $node, array $data): void
    {
        foreach ($data as $propertyName => $propertyValue) {
            $propertyConfiguration = $node->getNodeType()->getConfiguration('properties')[$propertyName] ?? null;
            if (!isset($propertyConfiguration['ui']['showInCreationDialog']) || $propertyConfiguration['ui']['showInCreationDialog'] !== true) {
                continue;
            }
            $propertyType = TypeHandling::normalizeType($propertyConfiguration['type'] ?? 'string');
            if ($propertyValue === null || ($propertyValue === '' && !TypeHandling::isSimpleType($propertyType))) {
                continue;
            }
            $propertyValue = $this->nodePropertyConversionService->convert($node->getNodeType(), $propertyName, $propertyValue, $node->getContext());
            if (strncmp($propertyName, '_', 1) === 0) {
                ObjectAccess::setProperty($node, substr($propertyName, 1), $propertyValue);
            } else {
                $node->setProperty($propertyName, $propertyValue);
            }
        }
    }
}
