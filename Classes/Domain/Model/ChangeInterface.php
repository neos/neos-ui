<?php
declare(strict_types=1);

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
 * An interface to describe a change
 */
interface ChangeInterface
{
    /**
     * Set the subject
     */
    public function setSubject(Node $subject): void;

    /**
     * Get the subject
     */
    public function getSubject(): ?Node;

    /**
     * Checks whether this change can be applied to the subject
     */
    public function canApply(): bool;

    /**
     * Applies this change
     */
    public function apply(): void;
}
