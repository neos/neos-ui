<?php
namespace PackageFactory\Guevara\TypoScript\Helper;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\Neos\Service\NodeTypeSchemaBuilder;

class NodeTypesHelper implements ProtectedContextAwareInterface
{

    /**
     * @Flow\Inject
     * @var NodeTypeSchemaBuilder
     */
    protected $nodeTypeSchemaBuilder;

    protected $nodeTypeSchema;

    protected function getNodeTypeSchema()
    {
        if (!$this->nodeTypeSchema) {
            $this->nodeTypeSchema = $this->nodeTypeSchemaBuilder->generateNodeTypeSchema();
        }
        return $this->nodeTypeSchema;
    }

    public function nodeTypesByName()
    {
        return $this->getNodeTypeSchema()['nodeTypes'];
    }

    public function nodeTypeConstraints()
    {
        return $this->getNodeTypeSchema()['constraints'];
    }

    public function nodeTypeInheritanceMap()
    {
        return $this->getNodeTypeSchema()['inheritanceMap'];
    }


    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
