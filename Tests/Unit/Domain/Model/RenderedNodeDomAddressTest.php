<?php
declare(strict_types=1);

namespace Neos\Neos\Ui\Tests\Unit\Domain\Model;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Tests\UnitTestCase;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;

final class RenderedNodeDomAddressTest extends UnitTestCase
{
    /**
     * @param string $contextPath
     * @param string $fusionPath
     * @return RenderedNodeDomAddress
     */
    private function createRenderedNodeDomAddress(string $contextPath, string $fusionPath): RenderedNodeDomAddress
    {
        $renderedNodeDomAddress = new RenderedNodeDomAddress();
        $renderedNodeDomAddress->setContextPath($contextPath);
        $renderedNodeDomAddress->setFusionPath($fusionPath);

        return $renderedNodeDomAddress;
    }

    /**
     * @return array
     */
    public function fusionPathsForRenderingProvider(): array
    {
        return [
            '(Simple) Content Element via first-level ContentCase' => [
                '/itemRenderer<Neos.Neos:ContentCase>/default<Neos.Fusion:Matcher>/element<Vendor.Site:Content.2767.Reproduction.TwoColumn>',
                '/itemRenderer<Neos.Neos:ContentCase>'
            ],
            '(Simple) Content Element via second-level ContentCase' => [
                '/itemRenderer<Neos.Neos:ContentCase>/default<Neos.Fusion:Matcher>/element<First>/itemRenderer<Neos.Neos:ContentCase>/default<Neos.Fusion:Matcher>/element<Second>',
                '/itemRenderer<Neos.Neos:ContentCase>/default<Neos.Fusion:Matcher>/element<First>/itemRenderer<Neos.Neos:ContentCase>'
            ],
            '(Full) Content Element via first-level ContentCase' => [
                'root<Neos.Fusion:Case>/documentType<Neos.Fusion:Matcher>/element<Vendor.Site:Document.HomePage>/renderer<Vendor.Site:Document.Base>/body<Vendor.Site:Component.Template.Page>/content<Neos.Neos:ContentCollection>/content<Neos.Neos:ContentCollectionRenderer>/itemRenderer<Neos.Neos:ContentCase>/default<Neos.Fusion:Matcher>/element<Vendor.Site:Content.2767.Reproduction.FourColumn>',
                'root<Neos.Fusion:Case>/documentType<Neos.Fusion:Matcher>/element<Vendor.Site:Document.HomePage>/renderer<Vendor.Site:Document.Base>/body<Vendor.Site:Component.Template.Page>/content<Neos.Neos:ContentCollection>/content<Neos.Neos:ContentCollectionRenderer>/itemRenderer<Neos.Neos:ContentCase>'
            ],
            '(Full) Content Element via second-level ContentCase' => [
                'root<Neos.Fusion:Case>/documentType<Neos.Fusion:Matcher>/element<Vendor.Site:Document.HomePage>/renderer<Vendor.Site:Document.Base>/body<Vendor.Site:Component.Template.Page>/content<Neos.Neos:ContentCollection>/content<Neos.Neos:ContentCollectionRenderer>/itemRenderer<Neos.Neos:ContentCase>/default<Neos.Fusion:Matcher>/element<Vendor.Site:Content.2767.Reproduction.TwoColumn>/column0<Neos.Neos:ContentCollection>/content<Neos.Neos:ContentCollectionRenderer>/itemRenderer<Neos.Neos:ContentCase>/default<Neos.Fusion:Matcher>/element<Vendor.Site:Content.2767.Reproduction.TwoColumn>',
                'root<Neos.Fusion:Case>/documentType<Neos.Fusion:Matcher>/element<Vendor.Site:Document.HomePage>/renderer<Vendor.Site:Document.Base>/body<Vendor.Site:Component.Template.Page>/content<Neos.Neos:ContentCollection>/content<Neos.Neos:ContentCollectionRenderer>/itemRenderer<Neos.Neos:ContentCase>/default<Neos.Fusion:Matcher>/element<Vendor.Site:Content.2767.Reproduction.TwoColumn>/column0<Neos.Neos:ContentCollection>/content<Neos.Neos:ContentCollectionRenderer>/itemRenderer<Neos.Neos:ContentCase>'
            ]
        ];
    }

    /**
     * @dataProvider fusionPathsForRenderingProvider
     * @test
     */
    public function providesCorrectFusionPathForContentRendering(string $fusionPath, string $fusionPathForRendering): void
    {
        $renderedNodeDomAddress = $this->createRenderedNodeDomAddress('/some/node@live', $fusionPath);
        $this->assertEquals($fusionPathForRendering, $renderedNodeDomAddress->getFusionPathForContentRendering());
    }
}
