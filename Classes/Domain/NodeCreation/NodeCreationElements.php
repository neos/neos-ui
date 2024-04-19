<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\Domain\NodeCreation;

use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateIds;

/**
 * Holds the deserialized elements of the submitted node creation dialog form
 *
 * Elements are configured like properties or references in the schema,
 * but its up to the node-creation-handler if they are handled in any way or just left out.
 *
 * Elements that are of simple types or objects, will be available according to its type.
 * For example myImage will be an actual image object instance.
 *
 *     Vendor.Site:Content:
 *       ui:
 *         creationDialog:
 *           elements:
 *             myString:
 *               type: string
 *             myImage:
 *               type: Neos\Media\Domain\Model\ImageInterface
 *
 * Elements that refer to nodes are of type `references` or `reference`.
 * They will be available as {@see NodeAggregateIds} collection.
 *
 *     Vendor.Site:Content:
 *       ui:
 *         creationDialog:
 *           elements:
 *             myReferences:
 *               type: references
 *
 * The naming `references` in the `element` configuration does not refer to the content repository reference edges.
 * Referring to a node will just denote that an editor will be used capable of returning node ids.
 * The node ids might be used for setting references but that is up to a node-creation-handler.
 *
 * To promoted properties / references the same rules apply:
 *
 *     Vendor.Site:Content:
 *       properties:
 *         myString:
 *           type: string
 *           ui:
 *             showInCreationDialog: true
 *       references:
 *         myReferences:
 *           ui:
 *             showInCreationDialog: true
 *
 * @implements \IteratorAggregate<string, mixed>
 * @internal Especially the constructor and the serialized data
 */
final readonly class NodeCreationElements implements \IteratorAggregate
{
    /**
     * @param array<string, mixed> $elementValues
     * @param array<int|string, mixed> $serializedValues
     * @internal you should not need to construct this
     */
    public function __construct(
        private array $elementValues,
        private array $serializedValues,
    ) {
    }

    public function has(string $name): bool
    {
        return isset($this->elementValues[$name]);
    }

    /**
     * Returns the type according to the element schema
     * For elements that refer to a node {@see NodeAggregateIds} will be returned.
     */
    public function get(string $name): mixed
    {
        return $this->elementValues[$name] ?? null;
    }

    /**
     * @internal returns values formatted by the internal format used for the Ui
     * @return \Traversable<int|string, mixed>
     */
    public function serialized(): \Traversable
    {
        yield from $this->serializedValues;
    }

    /**
     * @return \Traversable<string,mixed>
     */
    public function getIterator(): \Traversable
    {
        yield from $this->elementValues;
    }
}
