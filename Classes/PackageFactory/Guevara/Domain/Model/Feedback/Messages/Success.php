<?php
namespace PackageFactory\Guevara\Domain\Model\Feedback\Messages;

use PackageFactory\Guevara\Domain\Model\Feedback\AbstractMessageFeedback;

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
        return 'PackageFactory.Guevara:Success';
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
