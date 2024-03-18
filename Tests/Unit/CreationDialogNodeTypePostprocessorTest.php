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
     * promoted elements (showInCreationDialog: true)
     *
     * @test
     */
    public function processCopiesInspectorConfigurationToCreationDialogElements(): void
    {
        $configuration = [
            'references' => [],
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
     * promoted elements (showInCreationDialog: true)
     *
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

        self::assertEquals($expectedElements, $configuration['ui']['creationDialog']['elements']);
    }

    /**
     * promoted elements (showInCreationDialog: true)
     *
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

        self::assertEquals($expectedElements, $configuration['ui']['creationDialog']['elements']);
    }

    /**
     * default editor
     *
     * @test
     */
    public function processConvertsCreationDialogConfiguration(): void
    {
        $configuration = [
            'references' => [],
            'properties' => [],
            'ui' => [
                'creationDialog' => [
                    'elements' => [
                        'elementWithoutType' => [
                            'ui' => [
                                'label' => 'Some Label'
                            ]
                        ],
                        'elementWithUnknownType' => [
                            'type' => 'TypeWithoutDataTypeConfig',
                            'ui' => [
                                'label' => 'Some Label',
                                'editor' => 'EditorFromPropertyConfig',
                            ]
                        ],
                        'elementWithEditorFromDataTypeConfig' => [
                            'type' => 'TypeWithDataTypeConfig',
                            'ui' => [
                                'value' => 'fromPropertyConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithEditorFromDataTypeConfigWithoutUiConfig' => [
                            'type' => 'TypeWithDataTypeConfig'
                        ],
                        'elementWithOverriddenEditorConfig' => [
                            'type' => 'TypeWithDataTypeConfig',
                            'ui' => [
                                'editor' => 'EditorFromPropertyConfig',
                                'value' => 'fromPropertyConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithOverriddenEditorConfigAndEditorDefaultConfig' => [
                            'type' => 'TypeWithDataTypeConfig',
                            'ui' => [
                                'editor' => 'EditorWithDefaultConfig',
                                'value' => 'fromPropertyConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithEditorDefaultConfig' => [
                            'type' => 'TypeWithDefaultEditorConfig',
                            'ui' => [
                                'value' => 'fromPropertyConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithOverriddenEditorConfigAndEditorDefaultConfig2' => [
                            'type' => 'TypeWithDefaultEditorConfig',
                            'ui' => [
                                'editor' => 'EditorWithoutDefaultConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithOverriddenEditorConfigAndEditorDefaultConfig3' => [
                            'type' => 'TypeWithDefaultEditorConfig2',
                            'ui' => [
                                'editor' => 'EditorWithDefaultConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                    ],
                ],
            ],
        ];

        $this->inject($this->postprocessor, 'editorDefaultConfiguration', [
            'EditorWithDefaultConfig' => [
                'value' => 'fromEditorDefaultConfig',
                'editorDefaultValue' => 'fromEditorDefaultConfig',
            ],
        ]);

        $this->inject($this->postprocessor, 'dataTypesDefaultConfiguration', [
            'TypeWithDataTypeConfig' => [
                'editor' => 'EditorFromDataTypeConfig',
                'value' => 'fromDataTypeConfig',
                'dataTypeValue' => 'fromDataTypeConfig',
            ],
            'TypeWithDefaultEditorConfig' => [
                'editor' => 'EditorWithDefaultConfig',
                'value' => 'fromDataTypeConfig',
                'dataTypeValue' => 'fromDataTypeConfig',
            ],
            'TypeWithDefaultEditorConfig2' => [
                'editor' => 'EditorWithDefaultConfig',
                'dataTypeValue' => 'fromDataTypeConfig',
            ],
        ]);

        $expectedResult = [
            'references' => [],
            'properties' => [],
            'ui' => [
                'creationDialog' => [
                    'elements' => [
                        'elementWithoutType' => [
                            'ui' => [
                                'label' => 'Some Label'
                            ]
                        ],
                        'elementWithUnknownType' => [
                            'type' => 'TypeWithoutDataTypeConfig',
                            'ui' => [
                                'label' => 'Some Label',
                                'editor' => 'EditorFromPropertyConfig',
                            ]
                        ],
                        'elementWithEditorFromDataTypeConfig' => [
                            'type' => 'TypeWithDataTypeConfig',
                            'ui' => [
                                'editor' => 'EditorFromDataTypeConfig',
                                'value' => 'fromPropertyConfig',
                                'dataTypeValue' => 'fromDataTypeConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithEditorFromDataTypeConfigWithoutUiConfig' => [
                            'type' => 'TypeWithDataTypeConfig',
                            'ui' => [
                                'editor' => 'EditorFromDataTypeConfig',
                                'value' => 'fromDataTypeConfig',
                                'dataTypeValue' => 'fromDataTypeConfig',
                            ]
                        ],
                        'elementWithOverriddenEditorConfig' => [
                            'type' => 'TypeWithDataTypeConfig',
                            'ui' => [
                                'editor' => 'EditorFromPropertyConfig',
                                'value' => 'fromPropertyConfig',
                                'dataTypeValue' => 'fromDataTypeConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithOverriddenEditorConfigAndEditorDefaultConfig' => [
                            'type' => 'TypeWithDataTypeConfig',
                            'ui' => [
                                'value' => 'fromPropertyConfig',
                                'editorDefaultValue' => 'fromEditorDefaultConfig',
                                'editor' => 'EditorWithDefaultConfig',
                                'dataTypeValue' => 'fromDataTypeConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithEditorDefaultConfig' => [
                            'type' => 'TypeWithDefaultEditorConfig',
                            'ui' => [
                                'value' => 'fromPropertyConfig',
                                'editorDefaultValue' => 'fromEditorDefaultConfig',
                                'editor' => 'EditorWithDefaultConfig',
                                'dataTypeValue' => 'fromDataTypeConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithOverriddenEditorConfigAndEditorDefaultConfig2' => [
                            'type' => 'TypeWithDefaultEditorConfig',
                            'ui' => [
                                'editor' => 'EditorWithoutDefaultConfig',
                                'value' => 'fromDataTypeConfig',
                                'dataTypeValue' => 'fromDataTypeConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                        'elementWithOverriddenEditorConfigAndEditorDefaultConfig3' => [
                            'type' => 'TypeWithDefaultEditorConfig2',
                            'ui' => [
                                'value' => 'fromEditorDefaultConfig',
                                'editorDefaultValue' => 'fromEditorDefaultConfig',
                                'editor' => 'EditorWithDefaultConfig',
                                'dataTypeValue' => 'fromDataTypeConfig',
                                'elementValue' => 'fromPropertyConfig',
                            ]
                        ],
                    ],
                ],
            ],
        ];

        $this->postprocessor->process($this->mockNodeType, $configuration, []);

        self::assertSame($expectedResult, $configuration);
    }

    /**
     * @test
     */
    public function processDoesNotThrowExceptionIfNoCreationDialogEditorCanBeResolved(): void
    {
        $configuration = [
            'references' => [],
            'properties' => [],
            'ui' => [
                'creationDialog' => [
                    'elements' => [
                        'someElement' => [
                            'type' => 'string',
                            'ui' => ['label' => 'Foo']
                        ],
                    ],
                ],
            ],
        ];
        $expected = $configuration;

        $this->postprocessor->process($this->mockNodeType, $configuration, []);

        self::assertSame($expected, $configuration);
    }
}
