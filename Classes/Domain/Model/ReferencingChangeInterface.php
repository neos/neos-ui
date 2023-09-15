<?php
namespace Neos\Neos\Ui\Domain\Model;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;

/**
 * A change that needs to reference another node
 */
interface ReferencingChangeInterface extends ChangeInterface
{
    /**
     * Set the reference
     *
     * @param Node $reference
     * @return void
     */
    public function setReference(Node $reference);

    /**
     * Get the reference
     *
     * @return Node
     */
    public function getReference();
}
