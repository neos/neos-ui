<?php
declare(strict_types=1);
namespace Neos\Neos\Ui\Domain\Model\Changes;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class Create extends AbstractCreate
{
    public function setParentContextPath(string $parentContextPath): void
    {
        // this method needs to exist; otherwise the TypeConverter breaks.
    }

    /**
     * Get the insertion mode (before|after|into) that is represented by this change
     */
    public function getMode(): string
    {
        return 'into';
    }

    /**
     * Check if the new node's node type is allowed in the requested position
     */
    public function canApply(): bool
    {
        $subject = $this->getSubject();
        $nodeTypeName = $this->getNodeTypeName();

        return $nodeTypeName && $this->isNodeTypeAllowedAsChildNode($subject, $nodeTypeName);
    }

    /**
     * Create a new node beneath the subject
     */
    public function apply(): void
    {
        $parentNode = $this->getSubject();
        if ($this->canApply()) {
            $this->createNode($parentNode, null);
            $this->updateWorkspaceInfo();
        }
    }
}
