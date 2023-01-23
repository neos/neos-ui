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
include_once __DIR__ . '/Fixtures/DtoWithDtoProperty.php';

use Neos\Flow\Tests\UnitTestCase;

final class DtoWithDtoPropertyTest extends UnitTestCase
{
    /**
     * @test
     * @return void
     */
    public function itSerializesCorrectlyToJson(): void
    {
        $dto = new DtoWithDtoProperty(
            string: 'Top-Level String Property',
            dto: new DtoWithPrimitiveProperties(
                boolean: true,
                integer: 42,
                float: 23.23,
                string: 'Hello World!'
            )
        );

        $dtoAsJsonString = json_encode($dto);
        $dtoAsArrayFromJson = json_decode($dtoAsJsonString, true);

        $this->assertEquals(
            [
                '__type' => DtoWithDtoProperty::class,
                'string' => 'Top-Level String Property',
                'dto' => [
                    '__type' => DtoWithPrimitiveProperties::class,
                    'boolean' => true,
                    'integer' => 42,
                    'float' => 23.23,
                    'string' => 'Hello World!'
                ]
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
        $dto = DtoWithDtoProperty::fromArray([
            '__type' => DtoWithDtoProperty::class,
            'string' => 'Top-Level String Property',
            'dto' => [
                '__type' => DtoWithPrimitiveProperties::class,
                'boolean' => true,
                'integer' => 42,
                'float' => 23.23,
                'string' => 'Hello World!'
            ]
        ]);

        $this->assertEquals(
            new DtoWithDtoProperty(
                string: 'Top-Level String Property',
                dto: new DtoWithPrimitiveProperties(
                    boolean: true,
                    integer: 42,
                    float: 23.23,
                    string: 'Hello World!'
                )
            ),
            $dto
        );
    }
}
