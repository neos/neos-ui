<?php
namespace Neos\Neos\Ui\TypoScript\Helper;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Neos.Neos.Ui".          *
 *                                                                        *
 *                                                                        */

use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Repository\SiteRepository;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

class SitesHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var SiteRepository
     */
    protected $siteRepository;


    public function isActive(NodeInterface $siteNode)
    {
        if ($siteModel = $this->siteRepository->findOneByNodeName($siteNode->getName())) {
            return $siteModel->isOnline();
        }

        throw new \RuntimeException('Could not find a site for the given site node', 1473366137);
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
