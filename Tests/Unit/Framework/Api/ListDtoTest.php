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
include_once __DIR__ . '/Fixtures/ListDtoForDtoWithDtoProperty.php';

use Neos\Flow\Tests\UnitTestCase;
use Neos\Neos\Ui\Framework\Api\ListDto\ListDto;

final class ListDtoTest extends UnitTestCase
{
    private ListDto $sampleListDto;

    private array $sampleListDtoAsArrayFromJson;

    public function setUp(): void
    {
        $this->sampleListDto = new ListDtoForDtoWithDtoProperty(
            new DtoWithDtoProperty(
                string: 'First Dto',
                dto: new DtoWithPrimitiveProperties(
                    boolean: true,
                    integer: 42,
                    float: 23.23,
                    string: 'Hello World!'
                )
            ),
            new DtoWithDtoProperty(
                string: 'Second Dto',
                dto: new DtoWithPrimitiveProperties(
                    boolean: false,
                    integer: 1138,
                    float: 21.87,
                    string: 'A Jedi uses the Force for knowledge and defense, never for attack.'
                )
            ),
            new DtoWithDtoProperty(
                string: 'Third Dto',
                dto: new DtoWithPrimitiveProperties(
                    boolean: true,
                    integer: 0,
                    float: 0.7,
                    string: 'In Her Majesty\'s Secret Service'
                )
            )
        );

        $this->sampleListDtoAsArrayFromJson = [
            [
                '__type' => DtoWithDtoProperty::class,
                'string' => 'First Dto',
                'dto' => [
                    '__type' => DtoWithPrimitiveProperties::class,
                    'boolean' => true,
                    'integer' => 42,
                    'float' => 23.23,
                    'string' => 'Hello World!'
                ],
            ],
            [
                '__type' => DtoWithDtoProperty::class,
                'string' => 'Second Dto',
                'dto' => [
                    '__type' => DtoWithPrimitiveProperties::class,
                    'boolean' => false,
                    'integer' => 1138,
                    'float' => 21.87,
                    'string' => 'A Jedi uses the Force for knowledge and defense, never for attack.'
                ],
            ],
            [
                '__type' => DtoWithDtoProperty::class,
                'string' => 'Third Dto',
                'dto' => [
                    '__type' => DtoWithPrimitiveProperties::class,
                    'boolean' => true,
                    'integer' => 0,
                    'float' => 0.7,
                    'string' => 'In Her Majesty\'s Secret Service'
                ],
            ],
        ];
    }

    /**
     * @test
     * @return void
     */
    public function itSerializesCorrectlyToJson(): void
    {
        $listDtoAsJsonString = json_encode($this->sampleListDto);
        $listDtoAsArrayFromJson = json_decode($listDtoAsJsonString, true);

        $this->assertEquals(
            $this->sampleListDtoAsArrayFromJson,
            $listDtoAsArrayFromJson
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeCreatedFromJson(): void
    {
        $listDto = ListDtoForDtoWithDtoProperty::fromArray($this->sampleListDtoAsArrayFromJson);

        $this->assertEquals(
            $this->sampleListDto,
            $listDto
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeCreatedFromJsonWhenTheGivenArrayIsEmpty(): void
    {
        $listDto = ListDtoForDtoWithDtoProperty::fromArray([]);

        $this->assertEquals(
            new ListDtoForDtoWithDtoProperty(),
            $listDto
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeMapped(): void
    {
        $listDto = $this->sampleListDto->map(
            fn (DtoWithDtoProperty $item) =>
                $item->withString('Replaced String')
        );

        $this->assertEquals(
            new ListDtoForDtoWithDtoProperty(
                new DtoWithDtoProperty(
                    string: 'Replaced String',
                    dto: new DtoWithPrimitiveProperties(
                        boolean: true,
                        integer: 42,
                        float: 23.23,
                        string: 'Hello World!'
                    )
                ),
                new DtoWithDtoProperty(
                    string: 'Replaced String',
                    dto: new DtoWithPrimitiveProperties(
                        boolean: false,
                        integer: 1138,
                        float: 21.87,
                        string: 'A Jedi uses the Force for knowledge and defense, never for attack.'
                    )
                ),
                new DtoWithDtoProperty(
                    string: 'Replaced String',
                    dto: new DtoWithPrimitiveProperties(
                        boolean: true,
                        integer: 0,
                        float: 0.7,
                        string: 'In Her Majesty\'s Secret Service'
                    )
                )
            ),
            $listDto
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeFiltered(): void
    {
        $listDto = $this->sampleListDto->filter(
            fn (DtoWithDtoProperty $item) =>
                $item->dto->float !== 21.87
        );

        $this->assertEquals(
            new ListDtoForDtoWithDtoProperty(
                new DtoWithDtoProperty(
                    string: 'First Dto',
                    dto: new DtoWithPrimitiveProperties(
                        boolean: true,
                        integer: 42,
                        float: 23.23,
                        string: 'Hello World!'
                    )
                ),
                new DtoWithDtoProperty(
                    string: 'Third Dto',
                    dto: new DtoWithPrimitiveProperties(
                        boolean: true,
                        integer: 0,
                        float: 0.7,
                        string: 'In Her Majesty\'s Secret Service'
                    )
                )
            ),
            $listDto
        );
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeCounted(): void
    {
        $this->assertCount(3, $this->sampleListDto);
    }

    /**
     * @test
     * @return void
     */
    public function itCanBeIteratedOver(): void
    {
        $this->assertEquals(
            [
                new DtoWithDtoProperty(
                    string: 'First Dto',
                    dto: new DtoWithPrimitiveProperties(
                        boolean: true,
                        integer: 42,
                        float: 23.23,
                        string: 'Hello World!'
                    )
                ),
                new DtoWithDtoProperty(
                    string: 'Second Dto',
                    dto: new DtoWithPrimitiveProperties(
                        boolean: false,
                        integer: 1138,
                        float: 21.87,
                        string: 'A Jedi uses the Force for knowledge and defense, never for attack.'
                    )
                ),
                new DtoWithDtoProperty(
                    string: 'Third Dto',
                    dto: new DtoWithPrimitiveProperties(
                        boolean: true,
                        integer: 0,
                        float: 0.7,
                        string: 'In Her Majesty\'s Secret Service'
                    )
                )
            ],
            iterator_to_array($this->sampleListDto)
        );
    }
}
