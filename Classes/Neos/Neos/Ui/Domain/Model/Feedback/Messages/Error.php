<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Messages;

use Neos\Neos\Ui\Domain\Model\Feedback\AbstractMessageFeedback;

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
        return 'Neos.Neos.Ui:Error';
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
