<?php

namespace Neos\Neos\Ui\Domain\NodeCreation;

use Neos\ContentRepository\Core\ContentRepository;

/**
 * @see NodeCreationHandlerInterface how to configure a handler
 * @internal
 */
interface NodeCreationHandlerFactoryInterface
{
    public function build(ContentRepository $contentRepository): NodeCreationHandlerInterface;
}
