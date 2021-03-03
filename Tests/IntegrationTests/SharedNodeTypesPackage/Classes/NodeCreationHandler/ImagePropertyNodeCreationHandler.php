<?php
namespace Neos\TestNodeTypes\NodeCreationHandler;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Media\Domain\Model\ImageInterface;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

class ImagePropertyNodeCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * Set the node title for the newly created Document node
     *
     * @param NodeInterface $node The newly created node
     * @param array $data incoming data from the creationDialog
     * @return void
     */
    public function handle(NodeInterface $node, array $data)
    {
        $propertyMappingConfiguration = $this->propertyMapper->buildPropertyMappingConfiguration();
        $propertyMappingConfiguration->forProperty('*')->allowAllProperties();
        $propertyMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_OVERRIDE_TARGET_TYPE_ALLOWED, true);

        if (isset($data['image'])) {
            $image = $this->propertyMapper->convert($data['image'], ImageInterface::class, $propertyMappingConfiguration);
            $node->setProperty('image', $image);
        }
    }
}
