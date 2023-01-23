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

namespace Neos\Neos\Ui\Tests\Framework\Api\Fixtures;

include_once __DIR__ . '/Fixtures/DtoWithNullablePrimitiveProperties.php';

use Neos\Flow\Tests\UnitTestCase;
use Neos\Neos\Ui\Framework\Api\Dto\DeserializationFailedException;

final class DtoWithNullablePrimitivePropertiesTest extends UnitTestCase
{
    /**
     * @test
     * @return void
     */
    public function itSerializesCorrectlyToJson(): void
    {
        $dto = new DtoWithNullablePrimitiveProperties(
            boolean: true,
            integer: 42,
            float: 23.23,
            string: 'Hello World!'
        );

        $dtoAsJsonString = json_encode($dto);
        $dtoAsArrayFromJson = json_decode($dtoAsJsonString, true);

        $this->assertEquals(
            [
                '__type' => DtoWithNullablePrimitiveProperties::class,
                'boolean' => true,
                'integer' => 42,
                'float' => 23.23,
                'string' => 'Hello World!'
            ],
            $dtoAsArrayFromJson
        );
    }

    /**
     * @test
     * @return void
     */
    public function itSerializesCorrectlyToJsonWhenSomePropertiesAreNull(): void
    {
        $dto = new DtoWithNullablePrimitiveProperties(
            boolean: true,
            integer: null,
            float: 23.23,
            string: null
        );

        $dtoAsJsonString = json_encode($dto);
        $dtoAsArrayFromJson = json_decode($dtoAsJsonString, true);

        $this->assertEquals(
            [
                '__type' => DtoWithNullablePrimitiveProperties::class,
                'boolean' => true,
                'integer' => null,
                'float' => 23.23,
                'string' => null
            ],
            $dtoAsArrayFromJson
        );
    }

    /**
     * @test
     * @return void
     */
    public function itSerializesCorrectlyToJsonWhenAllPropertiesAreNull(): void
    {
        $dto = new DtoWithNullablePrimitiveProperties(
            boolean: null,
            integer: null,
            float: null,
            string: null
        );

        $dtoAsJsonString = json_encode($dto);
        $dtoAsArrayFromJson = json_decode($dtoAsJsonString, true);

        $this->assertEquals(
            [
                '__type' => DtoWithNullablePrimitiveProperties::class,
                'boolean' => null,
                'integer' => null,
                'float' => null,
                'string' => null
            ],
            $dtoAsArrayFromJson
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeCreatedFromJson(): void
    {
        $dto = DtoWithNullablePrimitiveProperties::fromArray([
            '__type' => DtoWithNullablePrimitiveProperties::class,
            'boolean' => true,
            'integer' => 42,
            'float' => 23.23,
            'string' => 'Hello World!'
        ]);

        $this->assertEquals(
            new DtoWithNullablePrimitiveProperties(
                boolean: true,
                integer: 42,
                float: 23.23,
                string: 'Hello World!'
            ),
            $dto
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeCreatedFromJsonWhenSomePropertiesAreNull(): void
    {
        $dto = DtoWithNullablePrimitiveProperties::fromArray([
            '__type' => DtoWithNullablePrimitiveProperties::class,
            'boolean' => null,
            'integer' => 42,
            'float' => null,
            'string' => 'Hello World!'
        ]);

        $this->assertEquals(
            new DtoWithNullablePrimitiveProperties(
                boolean: null,
                integer: 42,
                float: null,
                string: 'Hello World!'
            ),
            $dto
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeCreatedFromJsonWhenAllPropertiesAreNull(): void
    {
        $dto = DtoWithNullablePrimitiveProperties::fromArray([
            '__type' => DtoWithNullablePrimitiveProperties::class,
            'boolean' => null,
            'integer' => null,
            'float' => null,
            'string' => null
        ]);

        $this->assertEquals(
            new DtoWithNullablePrimitiveProperties(
                boolean: null,
                integer: null,
                float: null,
                string: null
            ),
            $dto
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCannotBeCreatedFromADataStructureWithoutType(): void
    {
        $this->expectException(DeserializationFailedException::class);

        DtoWithNullablePrimitiveProperties::fromArray([
            'boolean' => true,
            'integer' => 42,
            'float' => 23.23,
            'string' => 'Hello World!'
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function itCannotBeCreatedFromADataStructureWithTheWrongType(): void
    {
        $this->expectException(DeserializationFailedException::class);

        DtoWithNullablePrimitiveProperties::fromArray([
            '__type' => 'SomeOtherType',
            'boolean' => true,
            'integer' => 42,
            'float' => 23.23,
            'string' => 'Hello World!'
        ]);
    }

    public function dataStructuresWithWrongTypes(): array
    {
        return [
            '"boolean" is not boolean' => [[
                '__type' => DtoWithNullablePrimitiveProperties::class,
                'boolean' => 'true',
                'integer' => 42,
                'float' => 23.23,
                'string' => 'Hello World!'
            ]],
            '"integer" is not integer' => [[
                '__type' => DtoWithNullablePrimitiveProperties::class,
                'boolean' => true,
                'integer' => 23.23,
                'float' => 23.23,
                'string' => 'Hello World!'
            ]],
            '"float" is not float' => [[
                '__type' => DtoWithNullablePrimitiveProperties::class,
                'boolean' => true,
                'integer' => 42,
                'float' => false,
                'string' => 'Hello World!'
            ]],
            '"string" is not string' => [[
                '__type' => DtoWithNullablePrimitiveProperties::class,
                'boolean' => true,
                'integer' => 42,
                'float' => 23.23,
                'string' => 4711
            ]],
        ];
    }

    /**
     * @test
     * @dataProvider dataStructuresWithWrongTypes
     * @return void
     */
    public function itCannotBeCreatedFromADataStructureWithWrongPropertyTypes(array $dataStructure): void
    {
        $this->expectException(DeserializationFailedException::class);

        DtoWithNullablePrimitiveProperties::fromArray($dataStructure);
    }

    /**
     * @test
     * @return void
     */
    public function itCannotBeCreatedFromADataStructureWithMissingProperties(): void
    {
        $this->expectException(DeserializationFailedException::class);

        DtoWithNullablePrimitiveProperties::fromArray([
            '__type' => DtoWithNullablePrimitiveProperties::class,
            'boolean' => true,
            'float' => 23.23,
            'string' => 'Hello World!'
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function itCannotBeCreatedFromADataStructureWithEntirelyWrongShape(): void
    {
        $this->expectException(DeserializationFailedException::class);

        DtoWithNullablePrimitiveProperties::fromArray([
            '__type' => DtoWithNullablePrimitiveProperties::class,
            'thisPropertyDoesNotExist' => true,
            'thisPropertyDoesAlsoNotExist' => true,
        ]);
    }
}
