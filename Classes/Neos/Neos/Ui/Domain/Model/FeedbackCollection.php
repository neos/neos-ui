<?php
namespace Neos\Neos\Ui\Domain\Model;

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class FeedbackCollection implements \JsonSerializable
{
    /**
     * @var array<FeedbackInterface>
     */
    protected $feedbacks = [];

    /**
     * Add feedback
     *
     * @param FeedbackInterface $feedback
     * @return void
     */
    public function add(FeedbackInterface $feedback)
    {
        foreach ($this->feedbacks as $value) {
            if ($value->isSimilarTo($feedback)) {
                return;
            }
        }

        $this->feedbacks[] = $feedback;
    }

    /**
     * Serialize collection to `json_encode`able array
     *
     * @return array
     */
    public function jsonSerialize()
    {
        $feedbacks = [];

        foreach ($this->feedbacks as $feedback) {
            $feedbacks[] = [
                'type' => $feedback->getType(),
                'description' => $feedback->getDescription(),
                'payload' => $feedback->serializePayload()
            ];
        }

        return [
            'timestamp' => new \DateTime(),
            'feedbacks' => $feedbacks
        ];
    }
}
