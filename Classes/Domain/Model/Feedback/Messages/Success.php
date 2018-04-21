<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Messages;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Neos\Ui\Domain\Model\Feedback\AbstractMessageFeedback;

class Success extends AbstractMessageFeedback
{
    /**
     * @var string
     */
    protected $severity = 'SUCCESS';

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'Neos.Neos.Ui:Success';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return 'Operation succeeded';
    }
}
