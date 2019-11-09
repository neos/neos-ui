<?php
namespace Neos\Neos\Ui\Fusion\ExceptionHandler;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use function GuzzleHttp\Psr7\str;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Exception;
use Neos\Flow\Mvc\View\ViewInterface;
use Neos\Flow\Utility\Environment;
use Neos\FluidAdaptor\View\StandaloneView;
use Neos\Fusion\Core\ExceptionHandlers\AbstractRenderingExceptionHandler;
use Neos\Fusion\Core\ExceptionHandlers\HtmlMessageHandler;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;

/**
 * A page exception handler for the new UI.
 *
 * FIXME: When the old UI is removed this handler needs to be untangled from the PageHandler as the parent functionality is no longer needed.
 * FIXME: We should adapt rendering to requested "format" at some point
 */
class PageExceptionHandler extends AbstractRenderingExceptionHandler
{
    /**
     * @Flow\Inject
     * @var ResponseFactoryInterface
     */
    protected $responseFactory;

    /**
     * @Flow\Inject
     * @var StreamFactoryInterface
     */
    protected $contentFactory;

    /**
     * @Flow\Inject
     * @var Environment
     */
    protected $environment;

    /**
     * Handle an exception by displaying an error message inside the Neos backend, if logged in and not displaying the live workspace.
     *
     * @param string $fusionPath path causing the exception
     * @param \Exception $exception exception to handle
     * @param integer $referenceCode
     * @return string
     * @throws \Neos\Flow\Mvc\Exception\StopActionException
     * @throws \Neos\Flow\Security\Exception
     * @throws \Neos\FluidAdaptor\Exception
     */
    protected function handle($fusionPath, \Exception $exception, $referenceCode): string
    {
        $handler = new HtmlMessageHandler($this->environment->getContext()->isDevelopment());
        $handler->setRuntime($this->runtime);
        $output = $handler->handleRenderingException($fusionPath, $exception);
        $fluidView = $this->prepareFluidView();
        $fluidView->assignMultiple([
            'message' => $output
        ]);

        return $this->wrapHttpResponse($exception, $fluidView->render());
    }

    /**
     * Renders an actual HTTP response including the correct status and cache control header.
     *
     * @param \Exception the exception
     * @param string $bodyContent
     * @return string
     */
    protected function wrapHttpResponse(\Exception $exception, string $bodyContent): string
    {
        $response = $this->responseFactory->createResponse($exception instanceof Exception ? $exception->getStatusCode() : 500)
            ->withBody($this->contentFactory->createStream($bodyContent))
            ->withHeader('Cache-Control', 'no-store');

        return str($response);
    }

    /**
     * Prepare a Fluid view for rendering an error page with the Neos backend
     *
     * @return ViewInterface
     * @throws \Neos\FluidAdaptor\Exception
     */
    protected function prepareFluidView(): ViewInterface
    {
        $fluidView = new StandaloneView();
        $fluidView->setControllerContext($this->runtime->getControllerContext());
        $fluidView->setFormat('html');
        $fluidView->setTemplatePathAndFilename('resource://Neos.Neos.Ui/Private/Templates/Error/ErrorMessage.html');

        $guestNotificationScript = new StandaloneView();
        $guestNotificationScript->setTemplatePathAndFilename('resource://Neos.Neos.Ui/Private/Templates/Backend/GuestNotificationScript.html');
        $fluidView->assign('guestNotificationScript', $guestNotificationScript->render());

        return $fluidView;
    }
}
