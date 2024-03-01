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

namespace Neos\Neos\Ui\Infrastructure\ContentRepository\CreationDialog;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypePostprocessorInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Utility\Arrays;
use Neos\Utility\PositionalArraySorter;

/**
 * NodeType post processor for the "ui.creationDialog" configuration:
 *
 * Promotes elements into creation dialog
 * --------------------------------------
 * We look for properties flagged with "showInCreationDialog"
 * and sets the "creationDialog" configuration accordingly
 *
 * Example NodeTypes.yaml configuration:
 *
 *     'Some.Node:Type':
 *       # ...
 *       properties:
 *         'someProperty':
 *           type: string
 *           ui:
 *             label: 'Link'
 *             showInCreationDialog: true
 *             inspector:
 *               editor: 'Neos.Neos/Inspector/Editors/LinkEditor'
 *
 * Will be converted to:
 *
 *     'Some.Node:Type':
 *       # ...
 *       ui:
 *         creationDialog:
 *           elements:
 *             'someProperty':
 *               type: string
 *               ui:
 *                 label: 'Link'
 *                 editor: 'Neos.Neos/Inspector/Editors/LinkEditor'
 *       properties:
 *         'someProperty':
 *           # ...
 *
 *
 * Sets default editor configurations for elements
 * -----------------------------------------------
 * We add default editor configurations for elements based on type and editor.
 * Similar to the process for regular properties in {@see \Neos\Neos\NodeTypePostprocessor\DefaultPropertyEditorPostprocessor}
 *
 */
class CreationDialogNodeTypePostprocessor implements NodeTypePostprocessorInterface
{
    /**
     * @var array<string,mixed>
     * @Flow\InjectConfiguration(package="Neos.Neos", path="userInterface.inspector.dataTypes")
     */
    protected $dataTypesDefaultConfiguration;

    /**
     * @var array<string,mixed>
     * @Flow\InjectConfiguration(package="Neos.Neos", path="userInterface.inspector.editors")
     */
    protected $editorDefaultConfiguration;

    /**
     * @param NodeType $nodeType (uninitialized) The node type to process
     * @param array<string,mixed> $configuration input configuration
     * @param array<string,mixed> $options The processor options
     * @return void
     */
    public function process(NodeType $nodeType, array &$configuration, array $options): void
    {
        $creationDialogElements = $configuration['ui']['creationDialog']['elements'] ?? [];

        if (!empty($configuration['properties'] ?? null)) {
            $creationDialogElements = $this->promotePropertiesIntoCreationDialog($configuration['properties'], $creationDialogElements);
        }

        $this->mergeDefaultCreationDialogElementEditors($creationDialogElements);

        if ($creationDialogElements !== []) {
            $configuration['ui']['creationDialog']['elements'] = (new PositionalArraySorter($creationDialogElements))->toArray();
        }
    }

    /**
     * @param array<string, mixed> $creationDialogElements
     */
    private function mergeDefaultCreationDialogElementEditors(array &$creationDialogElements): void
    {
        foreach ($creationDialogElements as &$elementConfiguration) {
            if (!isset($elementConfiguration['type'])) {
                continue;
            }

            $type = $elementConfiguration['type'];
            $defaultConfigurationFromDataType = $this->dataTypesDefaultConfiguration[$type] ?? [];

            // FIRST STEP: Figure out which editor should be used
            // - Default: editor as configured from the data type
            // - Override: editor as configured from the property configuration.
            if (isset($elementConfiguration['ui']['editor'])) {
                $editor = $elementConfiguration['ui']['editor'];
            } elseif (isset($defaultConfigurationFromDataType['editor'])) {
                $editor = $defaultConfigurationFromDataType['editor'];
            } else {
                // No exception since the configuration could be a partial configuration overriding a property
                // with showInCreationDialog flag set
                continue;
            }

            // SECOND STEP: Build up the full UI configuration by merging:
            // - take configuration from editor defaults
            // - take configuration from dataType
            // - take configuration from creationDialog elements (NodeTypes)
            $mergedUiConfiguration = $this->editorDefaultConfiguration[$editor] ?? [];
            $mergedUiConfiguration = Arrays::arrayMergeRecursiveOverrule(
                $mergedUiConfiguration,
                $defaultConfigurationFromDataType
            );
            $mergedUiConfiguration = Arrays::arrayMergeRecursiveOverrule(
                $mergedUiConfiguration,
                $elementConfiguration['ui'] ?? []
            );
            $elementConfiguration['ui'] = $mergedUiConfiguration;
            $elementConfiguration['ui']['editor'] = $editor;
        }
    }

    /**
     * @param array<string, mixed> $properties
     * @param array<string, mixed> $explicitCreationDialogElements
     * @return array<string, mixed>
     */
    private function promotePropertiesIntoCreationDialog(array $properties, array $explicitCreationDialogElements): array
    {
        foreach ($properties as $propertyName => $propertyConfiguration) {
            if (
                !isset($propertyConfiguration['ui']['showInCreationDialog'])
                || $propertyConfiguration['ui']['showInCreationDialog'] !== true
            ) {
                continue;
            }
            $creationDialogElement = $this->promotePropertyIntoCreationDialog($propertyName, $propertyConfiguration);
            if (isset($explicitCreationDialogElements[$propertyName])) {
                $creationDialogElement = Arrays::arrayMergeRecursiveOverrule(
                    $creationDialogElement,
                    $explicitCreationDialogElements[$propertyName]
                );
            }
            $explicitCreationDialogElements[$propertyName] = $creationDialogElement;
        }
        return $explicitCreationDialogElements;
    }

    /**
     * Converts a NodeType property configuration to the corresponding creationDialog "element" configuration
     *
     * @param string $propertyName
     * @param array<string,mixed> $propertyConfiguration
     * @return array<string,mixed>
     */
    private function promotePropertyIntoCreationDialog(string $propertyName, array $propertyConfiguration): array
    {
        $dataType = $propertyConfiguration['type'] ?? 'string';
        $dataTypeDefaultConfiguration = $this->dataTypesDefaultConfiguration[$dataType] ?? [];
        $convertedConfiguration = [
            'type' => $dataType,
            'ui' => [
                'label' => $propertyConfiguration['ui']['label'] ?? $propertyName,
            ],
        ];
        if (isset($propertyConfiguration['defaultValue'])) {
            $convertedConfiguration['defaultValue'] = $propertyConfiguration['defaultValue'];
        }
        if (isset($propertyConfiguration['ui']['help'])) {
            $convertedConfiguration['ui']['help'] = $propertyConfiguration['ui']['help'];
        }
        if (isset($propertyConfiguration['validation'])) {
            $convertedConfiguration['validation'] = $propertyConfiguration['validation'];
        }
        if (isset($propertyConfiguration['ui']['inspector']['position'])) {
            $convertedConfiguration['position'] = $propertyConfiguration['ui']['inspector']['position'];
        }
        if (isset($propertyConfiguration['ui']['inspector']['hidden'])) {
            $convertedConfiguration['ui']['hidden'] = $propertyConfiguration['ui']['inspector']['hidden'];
        }

        // todo maybe duplicated due to mergeDefaultCreationDialogElementEditors
        $editor = $propertyConfiguration['ui']['inspector']['editor']
            ?? $dataTypeDefaultConfiguration['editor']
            ?? 'Neos.Neos/Inspector/Editors/TextFieldEditor';
        $editorOptions = $propertyConfiguration['ui']['inspector']['editorOptions'] ?? [];
        if (isset($dataTypeDefaultConfiguration['editorOptions'])) {
            $editorOptions = Arrays::arrayMergeRecursiveOverrule(
                $dataTypeDefaultConfiguration['editorOptions'],
                $editorOptions
            );
        }
        if (isset($this->editorDefaultConfiguration[$editor]['editorOptions'])) {
            $editorOptions = Arrays::arrayMergeRecursiveOverrule(
                $this->editorDefaultConfiguration[$editor]['editorOptions'],
                $editorOptions
            );
        }

        $convertedConfiguration['ui']['editor'] = $editor;
        $convertedConfiguration['ui']['editorOptions'] = $editorOptions;
        return $convertedConfiguration;
    }
}
