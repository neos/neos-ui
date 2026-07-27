<?php

$finder = (new PhpCsFixer\Finder())
    ->in([
        './Classes',
        './Tests',
    ])
;

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'no_unused_imports' => true,
        'ordered_imports' => [
            'sort_algorithm' => 'alpha',
        ]
    ])
    ->setFinder($finder);
