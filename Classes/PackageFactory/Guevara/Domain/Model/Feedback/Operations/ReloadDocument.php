<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

class ReloadDocument implements FeedbackInterface
{
    /**
     * @var NodeInterface
     */
    protected $document;

    /**
     * Set the document
     *
     * @param NodeInterface $document
     * @return void
     */
    public function setDocument(NodeInterface $document)
    {
        $this->document = $document;
    }

    /**
     * Get the document
     *
     * @return NodeInterface
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'PackageFactory.Guevara:ReloadDocument';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('Reload of document "%s" required.', $this->getDocument()->getProperty('title'));
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof ReloadDocument) {
            return false;
        }

        return $this->getDocument()->getContextPath() === $feedback->getDocument()->getContextPath();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return mixed
     */
    public function serializePayload()
    {
        return [
            'documentContextPath' => $this->getDocument()->getContextPath()
        ];
    }
}
