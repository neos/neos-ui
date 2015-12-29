<?php
namespace PackageFactory\Guevara\Domain\Model\Feedback\Messages;

use PackageFactory\Guevara\Domain\Model\Feedback\AbstractMessageFeedback;

class Error extends AbstractMessageFeedback
{
    /**
     * @var string
     */
    protected $severity = 'ERROR';

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'PackageFactory.Guevara:Error';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return 'An error ocurred';
    }
}
