<?php
declare(strict_types=1);

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
 * Migrate additional RTE formatting configuration to new format
 */
class Version20190319094900 extends AbstractMigration
{
    /**
     * @return string
     */
    public function getIdentifier()
    {
        return 'Neos.Neos.Ui-20190319094900';
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
                    if (!isset($nodeType['properties'])) {
                        continue;
                    }

                    foreach ($nodeType['properties'] as &$propertyConfiguration) {
                        if (isset($propertyConfiguration['ui']['inline'])) {
                            $this->transformLegacyFormatting($propertyConfiguration['ui']['inline']['editorOptions']);
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
     * @param array $editorOptions
     */
    protected function transformLegacyFormatting(array &$editorOptions)
    {

        if (isset($editorOptions['formatting']['u'])) {
            $editorOptions['formatting']['underline'] = $editorOptions['formatting']['u'];
            unset($editorOptions['formatting']['u']);
        }
        if (isset($editorOptions['formatting']['del'])) {
            $editorOptions['formatting']['strikethrough'] = $editorOptions['formatting']['del'];
            unset($editorOptions['formatting']['del']);
        }
    }
}
