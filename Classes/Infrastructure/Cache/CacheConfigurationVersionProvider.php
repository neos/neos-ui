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

namespace Neos\Neos\Ui\Infrastructure\Cache;

use Neos\Cache\Frontend\StringFrontend;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Account;
use Neos\Flow\Security\Context as SecurityContext;
use Neos\Neos\Ui\Domain\InitialData\CacheConfigurationVersionProviderInterface;

/**
 * @internal This is an almost verbatim copy of the
 *           Neos\Neos\ViewHelpers\Backend\ConfigurationCacheVersionViewHelper
 *           class' render method, which is only available as a Fluid ViewHelper
 *           and therefore cannot be (easily) re-used for general purposes.
 * @todo This class is rather awkward and should eventually be replaced by a
 *       similar mechanism living in `Neos.Neos`.
 */
#[Flow\Scope("singleton")]
final class CacheConfigurationVersionProvider implements CacheConfigurationVersionProviderInterface
{
    /** @var StringFrontend */
    protected $configurationCache;

    #[Flow\Inject]
    protected SecurityContext $securityContext;

    private ?string $computedCacheConfigurationVersion = null;

    public function getCacheConfigurationVersion(): string
    {
        return $this->computedCacheConfigurationVersion ??=
            $this->computeCacheConfigurationVersion();
    }

    private function computeCacheConfigurationVersion(): string
    {
        /** @var ?Account $account */
        $account = $this->securityContext->getAccount();

        // Get all roles and sort them by identifier
        $roles = $account ? array_map(static fn ($role) => $role->getIdentifier(), $account->getRoles()) : [];
        sort($roles);

        // Use the roles combination as cache key to allow multiple users sharing the same configuration version
        $configurationIdentifier = md5(implode('_', $roles));
        $cacheKey = 'ConfigurationVersion_' . $configurationIdentifier;
        /** @var string|false $version */
        $version = $this->configurationCache->get($cacheKey);

        if ($version === false) {
            $version = (string)time();
            $this->configurationCache->set($cacheKey, $version);
        }
        return  $configurationIdentifier . '_' . $version;
    }
}
