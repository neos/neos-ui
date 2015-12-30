<?php
namespace PackageFactory\Guevara\Domain\Model\Feedback;

use PackageFactory\Guevara\Domain\Model\FeedbackInterface;

abstract class AbstractMessageFeedback implements FeedbackInterface
{
    /**
     * @var string
     */
    protected $message;

    /**
     * @var string
     */
    protected $severity = 'INFO';

    /**
     * Set the message
     *
     * @param string $message
     * @return void
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }

    /**
     * Get the message
     *
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Get the severity
     *
     * @return string
     */
    public function getSeverity()
    {
        return $this->severity;
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof AbstractMessageFeedback) {
            return false;
        }

        return(
            $this->getSeverity() === $feedback->getSeverity() &&
            $this->getMessage() === $feedback->getMessage()
        );
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return mixed
     */
    public function serializePayload()
    {
        return [
            'message' => $this->getMessage(),
            'severity' => $this->getSeverity()
        ];
    }
}
