<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\TestNodeTypes\Application\WriteAdditionalSettings\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\ControllerInterface;
use Neos\TestNodeTypes\Application\WriteAdditionalSettings\WriteAdditionalSettingsCommand;
use Neos\TestNodeTypes\Application\WriteAdditionalSettings\WriteAdditionalSettingsCommandHandler;

#[Flow\Scope("singleton")]
final class WriteAdditionalSettingsController implements ControllerInterface
{
    #[Flow\Inject]
    protected WriteAdditionalSettingsCommandHandler $commandHandler;

    public function processRequest(ActionRequest $request, ActionResponse $response)
    {
        $request->setDispatched(true);
        $response->setContentType('application/json');

        try {
            $command = WriteAdditionalSettingsCommand::fromArray($request->getArguments());
            $this->commandHandler->handle($command);

            $response->setStatusCode(200);
            $response->setContent(
                json_encode(
                    ['success' => true],
                    JSON_THROW_ON_ERROR
                )
            );
        } catch (\InvalidArgumentException $e) {
            $response->setStatusCode(400);
            $response->setContent(
                json_encode(
                    ['error' => [
                        'type' => $e::class,
                        'code' => $e->getCode(),
                        'message' => $e->getMessage(),
                    ]],
                    JSON_THROW_ON_ERROR
                )
            );
        } catch (\Exception $e) {
            $response->setStatusCode(500);
            $response->setContent(
                json_encode(
                    ['error' => [
                        'type' => $e::class,
                        'code' => $e->getCode(),
                        'message' => $e->getMessage(),
                    ]],
                    JSON_THROW_ON_ERROR
                )
            );
        }
    }
}
