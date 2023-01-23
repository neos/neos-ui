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

namespace Neos\Neos\Ui\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\View\JsonView;
use Neos\Neos\Ui\Application\UiApi;
use Neos\Neos\Ui\Framework\Api\ApiException;

#[Flow\Scope("singleton")]
final class ApiController extends ActionController
{
    /**
     * @var array
     */
    protected $supportedMediaTypes = ['application/json'];

    /**
     * @var string
     */
    protected $defaultViewObjectName = JsonView::class;

    #[Flow\Inject]
    protected UiApi $api;

    /**
     * @param array $query
     * @return void
     */
    public function queryAction(array $query): void
    {
        try {
            $queryResult = $this->api->handleQuery($query);

            $this->view->assign('value', $queryResult);
        } catch (ApiException $apiException) {
            $this->view->assign('value', $apiException);
        }
    }

    /**
     * @param array $command
     * @return void
     */
    public function commandAction(array $command): void
    {
        try {
            $this->api->handleCommand($command);

            $this->response->setStatusCode(204);
        } catch (ApiException $apiException) {
            $this->view->assign('value', $apiException);
            $this->response->setStatusCode(500);
        }
    }

    /**
     * @param int $since
     * @return void
     */
    public function inboxAction(int $since): void
    {
        $inbox = $this->api->pollInboxOfCurrentUser($since);
        $this->view->assign('value', $inbox);
    }
}
