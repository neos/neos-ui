<?php
namespace Neos\Test\CrInteraction\Controller;

/*
 * This file is part of the Neos.Test.CrInteraction package.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Test\CrInteraction\Service\CommandHandler;
use Psr\Log\LoggerInterface;

class GenericCommandController extends ActionController
{
    /**
     * @Flow\Inject
     * @var LoggerInterface
     */
    protected $systemLogger;

    /**
     * @Flow\Inject
     * @var CommandHandler
     */
    protected CommandHandler $commandHandler;

    #[Flow\Route('neos/generic-command')]
    public function executeAction(string $commandClassName)
    {
        $arguments = json_decode($this->request->getArgument("arguments"), true);

        $this->commandHandler->handleCommand($commandClassName, $arguments);
    }
}
