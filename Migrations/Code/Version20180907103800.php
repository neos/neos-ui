<?php
namespace Neos\Flow\Core\Migrations;

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
 * Migrate RTE formatting configuration to new format
 */
class Version20180907103800 extends AbstractMigration
{
    /**
     * @return string
     */
    public function getIdentifier()
    {
        return 'Neos.Neos-20180907103800';
    }

    /**
     * @return void
     */
    public function up()
    {
        $this->processConfiguration(
            'NodeTypes',
            function (&$configuration) {
                foreach ($configuration as &$nodeType) {
                    if (isset($nodeType['properties'])) {
                        foreach ($nodeType['properties'] as &$propertyConfiguration) {
                            if (isset($propertyConfiguration['ui']['aloha'])) {
                                $editorOptions = $this->transformAlohaFormat($propertyConfiguration['ui']['aloha']);
                                $propertyConfiguration['ui']['inline']['editorOptions'] = isset($propertyConfiguration['ui']['inline']['editorOptions']) ? array_merge_recursive($propertyConfiguration['ui']['inline']['editorOptions'], $editorOptions) : $editorOptions;
                                unset($propertyConfiguration['ui']['aloha']);
                            }
                        }
                    }
                }
            },
            true
        );
    }

    /**
     * Takes legacy aloha formatting and return editorOptions
     *
     * @param array $aloha
     * @return array $editorOptions
     */
    protected function transformAlohaFormat($aloha)
    {
        $editorOptions = [
            'formatting' => []
        ];
        if (isset($aloha['format']) && is_array($aloha['format'])) {
            $editorOptions['formatting'] = array_merge($editorOptions['formatting'], $aloha['format']);
        }
        if (isset($aloha['table']) && is_array($aloha['table'])) {
            $editorOptions['formatting'] = array_merge($editorOptions['formatting'], $aloha['table']);
        }
        if (isset($aloha['link']) && is_array($aloha['link'])) {
            $editorOptions['formatting'] = array_merge($editorOptions['formatting'], $aloha['link']);
        }
        if (isset($aloha['list']) && is_array($aloha['list'])) {
            $editorOptions['formatting'] = array_merge($editorOptions['formatting'], $aloha['list']);
        }
        if (isset($aloha['alignment']) && is_array($aloha['alignment'])) {
            $editorOptions['formatting'] = array_merge($editorOptions['formatting'], $aloha['alignment']);
        }
        if (isset($aloha['autoparagraph'])) {
            $editorOptions['autoparagraph'] = $aloha['autoparagraph'];
        }
        if (isset($aloha['placeholder'])) {
            $editorOptions['placeholder'] = $aloha['placeholder'];
        }
        if (isset($editorOptions['formatting']['b'])) {
            $editorOptions['formatting']['strong'] = $editorOptions['formatting']['b'];
            unset($editorOptions['formatting']['b']);
        }
        if (isset($editorOptions['formatting']['i'])) {
            $editorOptions['formatting']['em'] = $editorOptions['formatting']['i'];
            unset($editorOptions['formatting']['i']);
        }
        if ($editorOptions['formatting'] === []) {
            unset($editorOptions['formatting']);
        }
        return $editorOptions;
    }
}
