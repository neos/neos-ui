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
use Neos\Flow\Property\Exception as PropertyException;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Neos\Flow\Security\Exception as SecurityException;
use Neos\Utility\ObjectAccess;
use Neos\Utility\TypeHandling;

/**
 * A Node Creation Handler that takes the incoming data from the Creation Dialog and sets the corresponding node property
 */
class CreationDialogPropertiesCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * @param NodeInterface $node The newly created node
     * @param array $data incoming data from the creationDialog
     * @return void
     * @throws PropertyException | SecurityException
     */
    public function handle(NodeInterface $node, array $data): void
    {
        $propertyMappingConfiguration = $this->propertyMapper->buildPropertyMappingConfiguration();
        $propertyMappingConfiguration->forProperty('*')->allowAllProperties();
        $propertyMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_OVERRIDE_TARGET_TYPE_ALLOWED, true);

        foreach ($node->getNodeType()->getConfiguration('properties') as $propertyName => $propertyConfiguration) {
            if (!isset($propertyConfiguration['ui']['showInCreationDialog']) || $propertyConfiguration['ui']['showInCreationDialog'] !== true) {
                continue;
            }
            $propertyType = TypeHandling::normalizeType($propertyConfiguration['type'] ?? 'string');
            if (!isset($data[$propertyName])) {
                continue;
            }
            $propertyValue = $data[$propertyName];
            if ($propertyValue === '' && !TypeHandling::isSimpleType($propertyType)) {
                continue;
            }
            if ($propertyType !== 'references' && $propertyType !== 'reference' && $propertyType !== TypeHandling::getTypeForValue($propertyValue)) {
                $propertyValue = $this->propertyMapper->convert($propertyValue, $propertyType, $propertyMappingConfiguration);
            }
            if (strncmp($propertyName, '_', 1) === 0) {
                ObjectAccess::setProperty($node, substr($propertyName, 1), $propertyValue);
            } else {
                $node->setProperty($propertyName, $propertyValue);
            }
        }
    }
}
