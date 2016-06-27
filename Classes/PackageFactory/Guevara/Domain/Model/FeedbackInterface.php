<?php
namespace Neos\Neos\Ui\Domain\Model;

interface FeedbackInterface
{
    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType();

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription();

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback);

    /**
     * Serialize the payload for this feedback
     *
     * @return mixed
     */
    public function serializePayload();
}
