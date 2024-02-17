<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler;

use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateIds;

/**
 * Access to deserialize elements of the node creation dialog
 *
 * property-like elements are of simple types or objects:
 *
 *     creationDialog:
 *       elements:
 *         myString:
 *           type: string
 *
 * while reference-like elements are of type `references` or `reference`:
 *
 *     creationDialog:
 *       elements:
 *         myReferences:
 *           type: references
 *
 * @api As part of the {@see NodeCreationHandlerInterface}
 */
final readonly class NodeCreationElements
{
    /**
     * @param array<string, mixed> $propertyLikeValues
     * @param array<string, NodeAggregateIds> $referenceLikeValues
     * @param array<int|string, mixed> $serializedValues
     * @internal you should not need to construct this
     */
    public function __construct(
        private array $propertyLikeValues,
        private array $referenceLikeValues,
        private array $serializedValues,
    ) {
    }

    public function hasPropertyLike(string $name): bool
    {
        return isset($this->propertyLikeValues[$name]);
    }

    public function getPropertyLike(string $name): mixed
    {
        return $this->propertyLikeValues[$name] ?? null;
    }

    public function hasReferenceLike(string $name): bool
    {
        return isset($this->referenceLikeValues[$name]);
    }

    public function getReferenceLike(string $name): NodeAggregateIds
    {
        return $this->referenceLikeValues[$name] ;
    }

    /**
     * @return iterable<string, mixed>
     */
    public function getPropertyLikeValues(): iterable
    {
        return $this->propertyLikeValues;
    }

    /**
     * @return iterable<string, NodeAggregateIds>
     */
    public function getReferenceLikeValues(): iterable
    {
        return $this->referenceLikeValues;
    }

    /**
     * @internal returns values formatted by the internal format used for the Ui
     * @return iterable<int|string, mixed>
     */
    public function serialized(): iterable
    {
        return $this->serializedValues;
    }
}
