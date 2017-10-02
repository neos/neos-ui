<?php

namespace Neos\Neos\Ui\Cache;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".           *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Cache\Frontend\StringFrontend;
use Neos\Flow\Session\SessionInterface;

/**
 * When logged into the backend, the old and new UI have different rendering behavior - the old UI renders
 * the node metadata in a different way than the new UI. That's why we cannot let the new UI run on cached
 * segments which were generated on the old UI (happens when switching between old and new UI), and vice versa.
 *
 * This class prepends the cache entries with "neos-ui" if we are in the new UI, to prevent clashes.
 *
 * NOTE: Cache flushing still works properly in *both* UIs (when modifying content), because tags are not
 * touched or namespaced at all.
 *
 * Class ContentCacheStringFrontend
 * @package Neos\Neos\Ui\Cache
 * @internal
 * @deprecated - get rid as soon as the old UI is no longer delivered with Neos.
 */
class ContentCacheStringFrontend extends StringFrontend
{

    /**
     * @Flow\Inject
     * @var SessionInterface
     */
    protected $session;

    public function set($entryIdentifier, $string, array $tags = [], $lifetime = null)
    {
        $entryIdentifier = $this->preprocessEntryIdentifier($entryIdentifier);
        parent::set($entryIdentifier, $string, $tags, $lifetime);
    }

    public function get($entryIdentifier)
    {
        $entryIdentifier = $this->preprocessEntryIdentifier($entryIdentifier);
        return parent::get($entryIdentifier);
    }

    public function has($entryIdentifier): bool
    {
        $entryIdentifier = $this->preprocessEntryIdentifier($entryIdentifier);
        return parent::has($entryIdentifier);
    }

    public function remove($entryIdentifier): bool
    {
        $entryIdentifier = $this->preprocessEntryIdentifier($entryIdentifier);
        return parent::remove($entryIdentifier);
    }

    protected function preprocessEntryIdentifier($entryIdentifier)
    {
        // It might be we do not have a session yet; that's why we are extremely conservative in this check here.
        if ($this->session !== null && $this->session->isStarted() && $this->session->getData('__neosEnabled__')) {
            return 'neos-ui-' . $entryIdentifier;
        }

        return $entryIdentifier;
    }
}
