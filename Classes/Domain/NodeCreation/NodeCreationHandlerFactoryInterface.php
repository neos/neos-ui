<?php

namespace Neos\Neos\Ui\Domain\NodeCreation;

use Neos\ContentRepository\Core\ContentRepository;

/**
 * @see NodeCreationHandlerInterface
 * @api
 */
interface NodeCreationHandlerFactoryInterface
{
    public function build(ContentRepository $contentRepository): NodeCreationHandlerInterface;
}
