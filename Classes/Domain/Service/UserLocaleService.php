<?php
namespace Neos\Neos\Ui\Domain\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\Locale;
use Neos\Flow\I18n\Service as I18nService;
use Neos\Neos\Domain\Service\UserService;

class UserLocaleService
{

    /**
     * @Flow\Inject
     * @var I18nService
     */
    protected $i18nService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * Remebered content locale for locale switching
     *
     * @var Locale
     */
    protected $rememberedContentLocale;

    /**
     * For serialization, we need to respect the UI locale, rather than the content locale
     *
     * @param boolean $reset Reset to remebered locale
     */
    public function switchToUILocale($reset = false)
    {
        if ($reset === true) {
            // Reset the locale
            $this->i18nService->getConfiguration()->setCurrentLocale($this->rememberedContentLocale);
        } else {
            $this->rememberedContentLocale = $this->i18nService->getConfiguration()->getCurrentLocale();
            $userLocalePreference = ($this->userService->getCurrentUser() ? $this->userService->getCurrentUser()->getPreferences()->getInterfaceLanguage() : null);
            $defaultLocale = $this->i18nService->getConfiguration()->getDefaultLocale();
            $userLocale = $userLocalePreference ? new Locale($userLocalePreference) : $defaultLocale;
            $this->i18nService->getConfiguration()->setCurrentLocale($userLocale);
        }
    }
}
