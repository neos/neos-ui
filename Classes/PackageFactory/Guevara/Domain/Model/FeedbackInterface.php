<?php
namespace PackageFactory\Guevara\Domain\Model;

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
     * Serialize the payload for this feedback
     *
     * @return mixed
     */
    public function serializePayload();
}
