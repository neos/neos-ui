<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Messages;

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
