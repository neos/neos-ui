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

namespace Neos\Neos\Ui\Tests\Unit\LinkEditor\Presentation\Option;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\Flow\Tests\UnitTestCase;
use PHPUnit\Framework\Assert;
use PHPUnit\Framework\TestCase;
use Neos\Neos\Ui\LinkEditor\Presentation\IconLabel\IconLabel;
use Neos\Neos\Ui\LinkEditor\Presentation\IconLabel\IconLabelFactory;
use Neos\Neos\Ui\LinkEditor\Presentation\Option\Option;
use Neos\Neos\Ui\LinkEditor\Presentation\Option\OptionFactory;
use Neos\Neos\Ui\LinkEditor\Presentation\Option\Options;
use Neos\Neos\Ui\LinkEditor\Presentation\Option\OptionsFactory;

final class OptionsFactoryTest extends TestCase
{
    /** @return \Traversable<mixed> */
    public static function forNodeTreePresetsSamples(): \Traversable
    {
        yield 'empty node tree presets' =>
            [
                [],
                new Options(),
            ];

        yield 'node tree presets with jus a simple default' =>
            [
                [
                    'default' => [
                        'baseNodeType' => 'Neos.Neos:Document',
                        'ui' => [
                            'icon' => 'file',
                            'label' => 'Documents',
                        ],
                    ],
                ],
                new Options(
                    new Option(
                        value: 'Neos.Neos:Document',
                        label: new IconLabel(
                            icon: 'file',
                            label: 'Documents',
                        ),
                    ),
                ),
            ];

        yield 'some more node tree presets' =>
            [
                [
                    'default' => [
                        'baseNodeType' => 'Neos.Neos:Document',
                        'ui' => [
                            'icon' => 'file',
                            'label' => 'Documents',
                        ],
                    ],
                    'custom-1' => [
                        'baseNodeType' => 'Neos.Neos:Document,!Vendor.Site:Forbidden',
                        'ui' => [
                            'icon' => 'alert',
                            'label' => 'Custom Preset #1',
                        ],
                    ],
                    'custom-2' => [
                        'baseNodeType' => 'Vendor.Site:Allowed,!Vendor.Site:Forbidden',
                        'ui' => [
                            'icon' => 'globe',
                            'label' => 'Custom Preset #2',
                        ],
                    ],
                ],
                new Options(
                    new Option(
                        value: 'Neos.Neos:Document',
                        label: new IconLabel(
                            icon: 'file',
                            label: 'Documents',
                        ),
                    ),
                    new Option(
                        value: 'Neos.Neos:Document,!Vendor.Site:Forbidden',
                        label: new IconLabel(
                            icon: 'alert',
                            label: 'Custom Preset #1',
                        ),
                    ),
                    new Option(
                        value: 'Vendor.Site:Allowed,!Vendor.Site:Forbidden',
                        label: new IconLabel(
                            icon: 'globe',
                            label: 'Custom Preset #2',
                        ),
                    ),
                ),
            ];
    }

    /**
     * @dataProvider forNodeTreePresetsSamples
     * @test
     * @param array<mixed> $nodeTreePresets
     */
    public function createsOptionsForNodeTreePresets(
        array $nodeTreePresets,
        Options $expectedOptions,
    ): void {
        $optionsFactory = new OptionsFactory(
            optionFactory: new OptionFactory(
                iconLabelFactory: new IconLabelFactory(),
            ),
        );

        Assert::assertEquals(
            $expectedOptions,
            $optionsFactory->forNodeTreePresets($nodeTreePresets),
        );
    }

    /** @return \Traversable<mixed> */
    public static function forNodeTypesSamples(): \Traversable
    {
        yield 'no node types' =>
            [
                [],
                new Options(),
            ];

        yield 'one node type' =>
            [
                [
                    new NodeType(
                        name: NodeTypeName::fromString('Vendor.Site:Foo'),
                        declaredSuperTypes: [],
                        configuration: [],
                    ),
                ],
                new Options(
                    new Option(
                        value: 'Vendor.Site:Foo',
                        label: new IconLabel(
                            icon: 'questionmark',
                            label: 'N/A',
                        ),
                    ),
                ),
            ];

        yield 'more node types' =>
            [
                [
                    new NodeType(
                        name: NodeTypeName::fromString('Vendor.Site:Foo'),
                        declaredSuperTypes: [],
                        configuration: [],
                    ),
                    new NodeType(
                        name: NodeTypeName::fromString('Vendor.Site:Bar'),
                        declaredSuperTypes: [],
                        configuration: [
                            'ui' => [
                                'icon' => 'file',
                                'label' => 'Custom Node Type #1',
                            ]
                        ],
                    ),
                    new NodeType(
                        name: NodeTypeName::fromString('Vendor.Site:Baz'),
                        declaredSuperTypes: [],
                        configuration: [
                            'ui' => [
                                'icon' => 'globe',
                                'label' => 'Custom Node Type #2',
                            ]
                        ],
                    ),
                ],
                new Options(
                    new Option(
                        value: 'Vendor.Site:Foo',
                        label: new IconLabel(
                            icon: 'questionmark',
                            label: 'N/A',
                        ),
                    ),
                    new Option(
                        value: 'Vendor.Site:Bar',
                        label: new IconLabel(
                            icon: 'file',
                            label: 'Custom Node Type #1',
                        ),
                    ),
                    new Option(
                        value: 'Vendor.Site:Baz',
                        label: new IconLabel(
                            icon: 'globe',
                            label: 'Custom Node Type #2',
                        ),
                    ),
                ),
            ];
    }

    /**
     * @dataProvider forNodeTypesSamples
     * @test
     * @param NodeType[] $nodeTypes
     */
    public function createsOptionsForNodeTypes(
        array $nodeTypes,
        Options $expectedOptions,
    ): void {
        $optionsFactory = new OptionsFactory(
            optionFactory: new OptionFactory(
                iconLabelFactory: new IconLabelFactory(),
            ),
        );

        Assert::assertEquals(
            $expectedOptions,
            $optionsFactory->forNodeTypes(...$nodeTypes),
        );
    }
}
