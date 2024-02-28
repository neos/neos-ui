<?php
namespace Neos\Neos\Ui\Tests\Unit;

use Neos\ContentRepository\Core\NodeType\DefaultNodeLabelGeneratorFactory;
use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\Flow\Tests\UnitTestCase;
use Neos\Neos\Ui\Infrastructure\ContentRepository\CreationDialog\CreationDialogNodeTypePostprocessor;

class CreationDialogNodeTypePostprocessorTest extends UnitTestCase
{
    /**
     * @var CreationDialogNodeTypePostprocessor
     */
    private $postprocessor;

    /**
     * @var NodeType
     */
    private $mockNodeType;

    public function setUp(): void
    {
        $this->postprocessor = new CreationDialogNodeTypePostprocessor();
        $this->mockNodeType = new NodeType(NodeTypeName::fromString('Foo:Bar'), [], [], new DefaultNodeLabelGeneratorFactory());
    }

    /**
     * @test
     */
    public function processCopiesInspectorConfigurationToCreationDialogElements(): void
    {
        $configuration = [
            'properties' => [
                'somePropertyName' => [
                    'ui' => [
                        'showInCreationDialog' => true,
                        'inspector' => [
                            'position' => 123,
                            'editor' => 'Some\Editor',
                            'editorOptions' => ['some' => 'option'],
                            'hidden' => 'ClientEval:false'
                        ],
                    ],
                    'validation' => [
                        'Neos.Neos/Validation/NotEmptyValidator' => [],
                        'Neos.Neos/Validation/StringLengthValidator' => [
                            'minimum' => 1,
                            'maximum' => 255,
                        ]
                    ],
                ],
            ],
        ];

        $this->postprocessor->process($this->mockNodeType, $configuration, []);

        $expectedElements = [
            'somePropertyName' => [
                'type' => 'string',
                'ui' => [
                    'label' => 'somePropertyName',
                    'hidden' => 'ClientEval:false',
                    'editor' => 'Some\Editor',
                    'editorOptions' => ['some' => 'option'],
                ],
                'validation' => [
                    'Neos.Neos/Validation/NotEmptyValidator' => [],
                    'Neos.Neos/Validation/StringLengthValidator' => [
                        'minimum' => 1,
                        'maximum' => 255,
                    ]
                ],
                'position' => 123,
            ],
        ];

        self::assertSame($expectedElements, $configuration['ui']['creationDialog']['elements']);
    }

    /**
     * @test
     */
    public function processDoesNotCreateEmptyCreationDialogs(): void
    {
        $configuration = [
            'properties' => [
                'somePropertyName' => [
                    'ui' => [
                        'inspector' => [
                            'editor' => 'Some\Editor',
                            'editorOptions' => ['some' => 'option'],
                        ],
                    ],
                ],
            ],
        ];
        $originalConfiguration = $configuration;

        $this->postprocessor->process($this->mockNodeType, $configuration, []);

        self::assertSame($originalConfiguration, $configuration);
    }

    /**
     * @test
     */
    public function processRespectsDataTypeDefaultConfiguration(): void
    {
        $configuration = [
            'properties' => [
                'somePropertyName' => [
                    'type' => 'SomeType',
                    'ui' => [
                        'label' => 'Some Label',
                        'showInCreationDialog' => true,
                        'inspector' => [
                            'editorOptions' => ['some' => 'option'],
                        ],
                    ],
                ],
            ],
        ];
        $this->inject($this->postprocessor, 'dataTypesDefaultConfiguration', [
            'SomeType' => [
                'editor' => 'Some\Default\Editor',
                'editorOptions' => [
                    'some' => 'defaultOption',
                    'someDefault' => 'option',
                ]
            ]
        ]);

        $this->postprocessor->process($this->mockNodeType, $configuration, []);

        $expectedElements = [
            'somePropertyName' => [
                'type' => 'SomeType',
                'ui' => [
                    'label' => 'Some Label',
                    'editor' => 'Some\Default\Editor',
                    'editorOptions' => ['some' => 'option', 'someDefault' => 'option'],
                ],
            ],
        ];

        self::assertSame($expectedElements, $configuration['ui']['creationDialog']['elements']);
    }

    /**
     * @test
     */
    public function processRespectsEditorDefaultConfiguration(): void
    {
        $configuration = [
            'properties' => [
                'somePropertyName' => [
                    'type' => 'SomeType',
                    'ui' => [
                        'showInCreationDialog' => true,
                        'inspector' => [
                            'editorOptions' => ['some' => 'option'],
                        ],
                    ],
                ],
            ],
        ];
        $this->inject($this->postprocessor, 'editorDefaultConfiguration', [
            'Some\Editor' => [
                'editorOptions' => [
                    'some' => 'editorDefault',
                    'someDefault' => 'fromEditor',
                    'someEditorDefault' => 'fromEditor',
                ]
            ]
        ]);
        $this->inject($this->postprocessor, 'dataTypesDefaultConfiguration', [
            'SomeType' => [
                'editor' => 'Some\Editor',
                'editorOptions' => [
                    'some' => 'defaultOption',
                    'someDefault' => 'fromDataType',
                ]
            ]
        ]);


        $this->postprocessor->process($this->mockNodeType, $configuration, []);

        $expectedElements = [
            'somePropertyName' => [
                'type' => 'SomeType',
                'ui' => [
                    'label' => 'somePropertyName',
                    'editor' => 'Some\Editor',
                    'editorOptions' => ['some' => 'option', 'someDefault' => 'fromDataType', 'someEditorDefault' => 'fromEditor'],
                ],
            ],
        ];

        self::assertSame($expectedElements, $configuration['ui']['creationDialog']['elements']);
    }
}
