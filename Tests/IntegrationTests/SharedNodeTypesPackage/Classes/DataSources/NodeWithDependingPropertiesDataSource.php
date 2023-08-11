<?php
namespace Neos\TestNodeTypes\DataSources;

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Neos\Service\DataSource\AbstractDataSource;

class NodeWithDependingPropertiesDataSource extends AbstractDataSource
{
    /**
     * @var string
     */
    protected static $identifier = 'node-with-depending-properties-data-source';

    /**
     * @param Node|null $node The node that is currently edited (optional)
     * @param array $arguments Additional arguments (key / value)
     * @return array
     */
    public function getData(Node $node = null, array $arguments = []): array
    {
        $options = range(1, 10);

        $evenOrOdd = $arguments['evenOrOdd'];

        $filteredOptions = array_filter($options, function ($option) use ($evenOrOdd) {
            if ($evenOrOdd === 'even') {
                return $option % 2 === 0;
            } else {
                return $option % 2 === 1;
            }
        });

        return array_map(
            function ($option) {
                return [
                    'label' => 'label_'. $option,
                    'value' => $option,
                ];
            },
            $filteredOptions
        );
    }
}
