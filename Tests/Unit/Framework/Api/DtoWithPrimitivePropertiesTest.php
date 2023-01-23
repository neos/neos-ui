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

include_once __DIR__ . '/Fixtures/DtoWithPrimitiveProperties.php';

use Neos\Flow\Tests\UnitTestCase;
use Neos\Neos\Ui\Framework\Api\Dto\DeserializationFailedException;

final class DtoWithPrimitivePropertiesTest extends UnitTestCase
{
    /**
     * @test
     * @return void
     */
    public function itSerializesCorrectlyToJson(): void
    {
        $dto = new DtoWithPrimitiveProperties(
            boolean: true,
            integer: 42,
            float: 23.23,
            string: 'Hello World!'
        );

        $dtoAsJsonString = json_encode($dto);
        $dtoAsArrayFromJson = json_decode($dtoAsJsonString, true);

        $this->assertEquals(
            [
                '__type' => DtoWithPrimitiveProperties::class,
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
    public function itCanBeCreatedFromJson(): void
    {
        $dto = DtoWithPrimitiveProperties::fromArray([
            '__type' => DtoWithPrimitiveProperties::class,
            'boolean' => true,
            'integer' => 42,
            'float' => 23.23,
            'string' => 'Hello World!'
        ]);

        $this->assertEquals(
            new DtoWithPrimitiveProperties(
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
    public function itCannotBeCreatedFromADataStructureWithoutType(): void
    {
        $this->expectException(DeserializationFailedException::class);

        DtoWithPrimitiveProperties::fromArray([
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

        DtoWithPrimitiveProperties::fromArray([
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
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => 'true',
                'integer' => 42,
                'float' => 23.23,
                'string' => 'Hello World!'
            ]],
            '"boolean" is null' => [[
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => null,
                'integer' => 42,
                'float' => 23.23,
                'string' => 'Hello World!'
            ]],
            '"integer" is not integer' => [[
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => true,
                'integer' => 23.23,
                'float' => 23.23,
                'string' => 'Hello World!'
            ]],
            '"integer" is null' => [[
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => true,
                'integer' => null,
                'float' => 23.23,
                'string' => 'Hello World!'
            ]],
            '"float" is not float' => [[
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => true,
                'integer' => 42,
                'float' => false,
                'string' => 'Hello World!'
            ]],
            '"float" is null' => [[
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => true,
                'integer' => 42,
                'float' => null,
                'string' => 'Hello World!'
            ]],
            '"string" is not string' => [[
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => true,
                'integer' => 42,
                'float' => 23.23,
                'string' => 4711
            ]],
            '"string" is null' => [[
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => true,
                'integer' => 42,
                'float' => 23.23,
                'string' => null
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

        DtoWithPrimitiveProperties::fromArray($dataStructure);
    }

    /**
     * @test
     * @return void
     */
    public function itCannotBeCreatedFromADataStructureWithMissingProperties(): void
    {
        $this->expectException(DeserializationFailedException::class);

        DtoWithPrimitiveProperties::fromArray([
            '__type' => DtoWithPrimitiveProperties::class,
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

        DtoWithPrimitiveProperties::fromArray([
            '__type' => DtoWithPrimitiveProperties::class,
            'thisPropertyDoesNotExist' => true,
            'thisPropertyDoesAlsoNotExist' => true,
        ]);
    }
}
