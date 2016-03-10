<?php
namespace PackageFactory\Guevara\TypoScript\Helper;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\TYPO3CR\Domain\Model\Node;

class NodeInfoHelper implements ProtectedContextAwareInterface
{
    public function isAutoCreated(Node $node)
    {
        return $node->isAutoCreated();
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
