<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Messages;

use Neos\Neos\Ui\Domain\Model\Feedback\AbstractMessageFeedback;

class Info extends AbstractMessageFeedback
{
    /**
     * @var string
     */
    protected $severity = 'INFO';

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'PackageFactory.Guevara:Info';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return 'Information available';
    }
}
