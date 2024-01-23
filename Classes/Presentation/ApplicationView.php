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

namespace Neos\Neos\Ui\Presentation;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Core\Bootstrap;
use Neos\Flow\Mvc\View\AbstractView;
use Neos\Flow\ResourceManagement\ResourceManager;
use Neos\Flow\Security\Context as SecurityContext;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\Service\StyleAndJavascriptInclusionService;

/**
 * @internal This view is meant to be used exclusively in conjunction with
 *           the BackendController. It renders the HTML foundation from which
 *           React picks up and renders the Neos UI.
 */
#[Flow\Scope("singleton")]
final class ApplicationView extends AbstractView
{
    #[Flow\Inject]
    protected UserService $userService;

    #[Flow\Inject]
    protected StyleAndJavascriptInclusionService $styleAndJavascriptInclusionService;

    #[Flow\Inject]
    protected ResourceManager $resourceManager;

    #[Flow\Inject]
    protected SecurityContext $securityContext;

    #[Flow\Inject]
    protected Bootstrap $bootstrap;

    /**
     * This contains the supported options, their default values, descriptions and types.
     *
     * @var array<string,array{mixed,string,string}>
     */
    protected $supportedOptions = [
        'title' => [null, 'The application title which will be used as the HTML <title>.', 'string'],
    ];

    public function render(): string
    {
        $result = '<!DOCTYPE html>';
        $result .= '<html lang="' . $this->renderLang() . '">';
        $result .= '<head>';
        $result .= $this->renderHead();
        $result .= '</head>';
        $result .= '<body>';
        $result .= $this->renderBody();
        $result .= '</body>';
        $result .= '</html>';

        return $result;
    }

    private function renderLang(): string
    {
        return $this->userService->getInterfaceLanguage();
    }

    private function renderHead(): string
    {
        $result = '<meta charset="UTF-8">';
        $result .= '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

        $result .= '<title>' . $this->options['title'] . '</title>';

        $result .= $this->styleAndJavascriptInclusionService->getHeadStylesheets();
        $result .= $this->styleAndJavascriptInclusionService->getHeadScripts();

        $result .= sprintf(
            '<link href="%s" sizes="180x180" rel="apple-touch-icon">',
            $this->resourceManager->getPublicPackageResourceUriByPath(
                'resource://Neos.Neos.Ui/Public/Images/apple-touch-icon.png'
            )
        );
        $result .= sprintf(
            '<link href="%s" sizes="16x16" rel="icon" type="image/png">',
            $this->resourceManager->getPublicPackageResourceUriByPath(
                'resource://Neos.Neos.Ui/Public/Images/favicon-16x16.png'
            )
        );
        $result .= sprintf(
            '<link href="%s" sizes="32x32" rel="icon" type="image/png">',
            $this->resourceManager->getPublicPackageResourceUriByPath(
                'resource://Neos.Neos.Ui/Public/Images/favicon-32x32.png'
            )
        );
        $result .= sprintf(
            '<link href="%s" sizes="32x32" rel="mask-icon" color="#00adee">',
            $this->resourceManager->getPublicPackageResourceUriByPath(
                'resource://Neos.Neos.Ui/Public/Images/safari-pinned-tab.svg'
            )
        );

        $result .= sprintf(
            '<script id="initialData" type="application/json">%s</script>',
            json_encode($this->variables['initialData']),
        );

        return $result;
    }

    private function renderBody(): string
    {
        $result = sprintf(
            '<div id="appContainer" data-csrf-token="%s" data-env="%s">',
            $this->securityContext->getCsrfProtectionToken(),
            (string) $this->bootstrap->getContext(),
        );
        $result .= $this->renderSplashScreen();
        $result .= '</div>';

        return $result;
    }

    private function renderSplashScreen(): string
    {
        return <<<HTML
        <style>
        @keyframes color_change {
            0% {
                filter: drop-shadow(0 0 0 #00adee) opacity(25%);
            }
            100% {
                filter: drop-shadow(0 0 5px #00adee) opacity(100%);
            }
        }

        .loadingIcon {
            color: #00adee;
            animation-name: color_change;
            animation-duration: 1.2s;
            animation-iteration-count: infinite;
            animation-direction: alternate;
            animation-timing-function: ease-in-out;
        }
        .splash {
            width: 100vw;
            height: 100vh;
            background-color: #222222;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
        }
        </style>
        <div class="splash">
            <svg aria-hidden="true" data-prefix="fab" data-icon="neos" class="neos-svg-inline--fa neos-fa-neos fa-w-15 fa-3x loadingIcon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 456 512" aria-label="Loading...">
                <path fill="currentColor" d="M387.44 512h-95.11L184.12 357.46v91.1L97.69 512H0V29.82L40.47 0h108.05l123.74 176.13V63.45L358.69 0h97.69v461.5L387.44 512zM10.77 35.27v460.72l72.01-52.88V193.95l215.49 307.69h84.79l52.35-38.17h-78.27L40.96 12.98 10.77 35.27zm82.54 466.61l80.04-58.78V342.06L93.55 227.7v220.94l-72.58 53.25h72.34zM52.63 10.77l310.6 442.57h82.37V10.77h-79.75v317.56L142.91 10.77H52.63zm230.4 180.88l72.01 102.81V15.93l-72.01 52.96v122.76z"/>
            </svg>
        </div>
        HTML;
    }
}
