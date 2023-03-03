<?php
namespace Neos\Neos\Ui\Domain\Model;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

/**
 * Data to address rendered nodes within the DOM
 */
class RenderedNodeDomAddress implements \JsonSerializable
{
    /**
     * The context path of the node
     *
     * @var string
     */
    protected $contextPath;

    /**
     * The fusion path of the rendered node
     *
     * @var string
     */
    protected $fusionPath;

    /**
     * Set the context path
     *
     * @param string $contextPath
     * @return void
     */
    public function setContextPath($contextPath)
    {
        $this->contextPath = $contextPath;
    }

    /**
     * Get the context path
     *
     * @return string
     */
    public function getContextPath()
    {
        return $this->contextPath;
    }

    /**
     * Set the fusion path
     *
     * @param string $fusionPath
     * @return void
     */
    public function setFusionPath($fusionPath)
    {
        $this->fusionPath = $fusionPath;
    }

    /**
     * Get the fusion path
     *
     * @return string
     */
    public function getFusionPath()
    {
        return $this->fusionPath;
    }

    /**
     * Get the fusion path that should be used for rendering the addressed
     * content. For most contents that would be the closest `Neos.Neos:ContentCase`
     * within the path rather than the actual prototype that was used to
     * render the content.
     *
     * @return string
     */
    public function getFusionPathForContentRendering(): string
    {
        $fusionPathForContentRendering = $this->getFusionPath();
        $fusionPathForContentRendering = preg_replace(
            '/(\/itemRenderer<Neos\.Neos:ContentCase>)\/default<Neos\.Fusion:Matcher>\/element(<[^>]+>)$/',
            '$1',
            $fusionPathForContentRendering
        );

        return $fusionPathForContentRendering;
    }

    /**
     * Serialize to json
     *
     * @return array
     */
    public function jsonSerialize(): mixed
    {
        return [
            'contextPath' => $this->getContextPath(),
            'fusionPath' => $this->getFusionPath()
        ];
    }
}
