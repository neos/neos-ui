<?php
namespace Neos\Neos\Ui\Tests\Unit;

use Neos\ContentRepository\Core\NodeType\DefaultNodeLabelGeneratorFactory;
use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\Flow\Tests\UnitTestCase;
use Neos\Neos\NodeTypePostprocessor\DefaultPropertyEditorPostprocessor;
use Neos\Neos\Ui\Infrastructure\ContentRepository\CreationDialog\CreationDialogNodeTypePostprocessor;
use Symfony\Component\Yaml\Yaml;

class CreationDialogNodeTypePostprocessorTest extends UnitTestCase
{
    public function examples(): iterable
    {
        yield 'multiple references' => [
            'nodeTypeDefinition' => <<<'YAML'
            references:
              someReferences:
                ui:
                  showInCreationDialog: true
            YAML,
            'expectedCreationDialog' => <<<'YAML'
            elements:
              someReferences:
                type: references
                ui:
                  editor: ReferencesEditor
            YAML
        ];

        yield 'singular reference' => [
            'nodeTypeDefinition' => <<<'YAML'
            references:
              someReference:
                constraints:
                  maxItems: 1
                ui:
                  showInCreationDialog: true
            YAML,
            'expectedCreationDialog' => <<<'YAML'
            elements:
              someReference:
                type: reference
                ui:
                  editor: SingularReferenceEditor
            YAML
        ];
    }

    /**
     * @test
     * @dataProvider examples
     */
    public function processExamples(string $nodeTypeDefinition, string $expectedCreationDialog)
    {
        $configuration = array_merge([
            'references' => [],
            'properties' => []
        ], Yaml::parse($nodeTypeDefinition));

        $dataTypesDefaultConfiguration = [
            'reference' => [
                'editor' => 'SingularReferenceEditor',
            ],
            'references' => [
                'editor' => 'ReferencesEditor',
            ],
        ];

        $result = $this->processConfigurationFully($configuration, $dataTypesDefaultConfiguration, []);

        self::assertEquals(Yaml::parse($expectedCreationDialog), $result['ui']['creationDialog'] ?? null);
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

        $result = $this->processConfigurationLegacyOnlyOnce($configuration, [], []);

        self::assertSame($expectedElements, $result['ui']['creationDialog']['elements']);
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

        $result = $this->processConfigurationLegacyOnlyOnce($configuration, [], []);

        self::assertSame($configuration, $result);

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
        $dataTypesDefaultConfiguration = [
            'SomeType' => [
                'editor' => 'Some\Default\Editor',
                'editorOptions' => [
                    'some' => 'defaultOption',
                    'someDefault' => 'option',
                ]
            ]
        ];

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

        $result = $this->processConfigurationLegacyOnlyOnce($configuration, $dataTypesDefaultConfiguration, []);

        self::assertEquals($expectedElements, $result['ui']['creationDialog']['elements']);
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
        $editorDefaultConfiguration = [
            'Some\Editor' => [
                'editorOptions' => [
                    'some' => 'editorDefault',
                    'someDefault' => 'fromEditor',
                    'someEditorDefault' => 'fromEditor',
                ]
            ]
        ];
        $dataTypesDefaultConfiguration = [
            'SomeType' => [
                'editor' => 'Some\Editor',
                'editorOptions' => [
                    'some' => 'defaultOption',
                    'someDefault' => 'fromDataType',
                ]
            ]
        ];

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

        $result = $this->processConfigurationLegacyOnlyOnce($configuration, $dataTypesDefaultConfiguration, $editorDefaultConfiguration);

        self::assertEquals($expectedElements, $result['ui']['creationDialog']['elements']);
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

        $editorDefaultConfiguration = [
            'EditorWithDefaultConfig' => [
                'value' => 'fromEditorDefaultConfig',
                'editorDefaultValue' => 'fromEditorDefaultConfig',
            ],
        ];

        $dataTypesDefaultConfiguration = [
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
        ];

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

        self::assertSame($expectedResult, $this->processConfigurationLegacyOnlyOnce($configuration, $dataTypesDefaultConfiguration, $editorDefaultConfiguration));
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

        self::assertSame($configuration, $this->processConfigurationFully($configuration, [], []));
    }

    private function processConfigurationFully(array $configuration, array $dataTypesDefaultConfiguration, array $editorDefaultConfiguration): array
    {
        $mockNodeType = new NodeType(NodeTypeName::fromString('Some.NodeType:Name'), [], [], new DefaultNodeLabelGeneratorFactory());

        $firstProcessor = new DefaultPropertyEditorPostprocessor();
        $this->inject($firstProcessor, 'dataTypesDefaultConfiguration', $dataTypesDefaultConfiguration);
        $this->inject($firstProcessor, 'editorDefaultConfiguration', $editorDefaultConfiguration);

        $firstProcessor->process($mockNodeType, $configuration, []);


        $secondProcessor = new CreationDialogNodeTypePostprocessor();
        $this->inject($secondProcessor, 'dataTypesDefaultConfiguration', $dataTypesDefaultConfiguration);
        $this->inject($secondProcessor, 'editorDefaultConfiguration', $editorDefaultConfiguration);

        $secondProcessor->process($mockNodeType, $configuration, []);

        return $configuration;
    }

    private function processConfigurationLegacyOnlyOnce(array $configuration, array $dataTypesDefaultConfiguration, array $editorDefaultConfiguration): array
    {
        $mockNodeType = new NodeType(NodeTypeName::fromString('Some.NodeType:Name'), [], [], new DefaultNodeLabelGeneratorFactory());

        $postprocessor = new CreationDialogNodeTypePostprocessor();
        $this->inject($postprocessor, 'dataTypesDefaultConfiguration', $dataTypesDefaultConfiguration);
        $this->inject($postprocessor, 'editorDefaultConfiguration', $editorDefaultConfiguration);

        $postprocessor->process($mockNodeType, $configuration, []);
        return $configuration;
    }
}
