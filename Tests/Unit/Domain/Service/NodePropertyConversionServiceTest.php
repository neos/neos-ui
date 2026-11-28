<?php
declare(strict_types=1);

namespace Neos\Neos\Ui\Tests\Unit\Domain\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\Service\Context;
use Neos\Flow\Tests\UnitTestCase;
use Neos\Neos\Service\Mapping\NodePropertyConverterService;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

final class NodePropertyConversionServiceTest extends UnitTestCase
{
    private string $originalTimezone;

    private NodePropertyConversionService $nodePropertyConversionService;

    public function setUp(): void
    {
        $this->originalTimezone = date_default_timezone_get();
        $this->nodePropertyConversionService = new NodePropertyConversionService();
    }

    public function tearDown(): void
    {
        date_default_timezone_set($this->originalTimezone);
    }

    private static function nodeTypeWithDateProperty(?string $format, string $editor = 'Neos.Neos/Inspector/Editors/DateTimeEditor'): NodeType
    {
        $propertyConfiguration = ['type' => 'DateTime', 'ui' => ['inspector' => ['editor' => $editor]]];
        if ($format !== null) {
            $propertyConfiguration['ui']['inspector']['editorOptions']['format'] = $format;
        }
        return new NodeType('Neos.Neos.Ui.Testing:Node', [], ['properties' => ['date' => $propertyConfiguration]]);
    }

    private function convert(NodeType $nodeType, string $rawValue): string
    {
        $value = $this->nodePropertyConversionService->convert($nodeType, 'date', $rawValue, $this->createMock(Context::class));
        return $value->format(DATE_W3C);
    }

    private function getPropertiesForUi(NodeType $nodeType, array $serializedProperties): array
    {
        $node = $this->createMock(NodeInterface::class);
        $node->method('getNodeType')->willReturn($nodeType);
        $nodePropertyConverterService = $this->createMock(NodePropertyConverterService::class);
        $nodePropertyConverterService->method('getPropertiesArray')->willReturn($serializedProperties);
        $this->inject($this->nodePropertyConversionService, 'nodePropertyConverterService', $nodePropertyConverterService);
        return $this->nodePropertyConversionService->getPropertiesForUi($node);
    }

    public static function formatsDataProvider(): iterable
    {
        yield 'default format' => ['d-m-Y', null, true];
        yield 'date format' => ['d.m.Y', null, true];
        yield 'textual date format' => ['l, jS F Y', null, true];
        yield 'date and time format' => ['d-m-Y H:i', null, false];
        yield '12 hour time format' => ['Y-m-d g:i A', null, false];
        yield 'time only format' => ['H:i', null, false];
        yield 'missing format' => [null, null, false];
        yield 'other editor' => ['d.m.Y', 'Some.Package/DateEditor', false];
    }

    #[Test]
    #[DataProvider('formatsDataProvider')]
    public function onlyDateOnlyFormatsOfTheDateTimeEditorAreConvertedToNoon(?string $format, ?string $editor, bool $expectDateOnly): void
    {
        date_default_timezone_set('Europe/Berlin');
        $nodeType = $editor === null ? self::nodeTypeWithDateProperty($format) : self::nodeTypeWithDateProperty($format, $editor);
        $expected = $expectDateOnly ? '2026-11-15T12:00:00+01:00' : '2026-11-15T01:00:00+01:00';
        self::assertSame($expected, $this->convert($nodeType, '2026-11-15T01:00:00+01:00'));
    }

    public static function dateOnlyValuesFromUiDataProvider(): iterable
    {
        // The UI sends the picked date as UTC midnight with the browser offset
        yield 'Berlin browser, Berlin server' => ['2026-11-15T01:00:00+01:00', 'Europe/Berlin', '2026-11-15T12:00:00+01:00'];
        yield 'New York browser, Berlin server' => ['2026-11-14T19:00:00-05:00', 'Europe/Berlin', '2026-11-15T12:00:00+01:00'];
        yield 'UTC browser, New York server' => ['2026-11-15T00:00:00+00:00', 'America/New_York', '2026-11-15T12:00:00-05:00'];
        yield 'Auckland server' => ['2026-07-01T00:00:00+00:00', 'Pacific/Auckland', '2026-07-01T12:00:00+12:00'];
        yield 'Kiritimati server' => ['2026-07-01T00:00:00+00:00', 'Pacific/Kiritimati', '2026-07-01T12:00:00+14:00'];
        yield 'DST start' => ['2026-03-29T00:00:00+00:00', 'Europe/Berlin', '2026-03-29T12:00:00+02:00'];
        yield 'DST end' => ['2026-10-25T00:00:00+00:00', 'Europe/Berlin', '2026-10-25T12:00:00+01:00'];
    }

    #[Test]
    #[DataProvider('dateOnlyValuesFromUiDataProvider')]
    public function dateOnlyValuesAreConvertedToNoonInServerTimezone(string $rawValue, string $serverTimezone, string $expected): void
    {
        date_default_timezone_set($serverTimezone);
        self::assertSame($expected, $this->convert(self::nodeTypeWithDateProperty('d.m.Y'), $rawValue));
    }

    public static function dateOnlyValuesForUiDataProvider(): iterable
    {
        // Values as serialized by the DateStringConverter (UTC)
        yield 'noon in server timezone' => ['2026-11-15T11:00:00+00:00', 'Europe/Berlin', '2026-11-15T00:00:00+00:00'];
        yield 'midnight UTC (written by previous versions)' => ['2026-11-15T00:00:00+00:00', 'Europe/Berlin', '2026-11-15T00:00:00+00:00'];
        yield 'server midnight ("today midnight" default value)' => ['2026-11-14T23:00:00+00:00', 'Europe/Berlin', '2026-11-15T00:00:00+00:00'];
        yield 'midnight UTC on a server west of UTC (as rendered by the frontend)' => ['2026-11-15T00:00:00+00:00', 'America/New_York', '2026-11-14T00:00:00+00:00'];
        yield 'noon on an Auckland server' => ['2026-07-01T00:00:00+00:00', 'Pacific/Auckland', '2026-07-01T00:00:00+00:00'];
    }

    #[Test]
    #[DataProvider('dateOnlyValuesForUiDataProvider')]
    public function dateOnlyValuesArePassedToUiAsUtcMidnightOfServerDate(string $serializedValue, string $serverTimezone, string $expected): void
    {
        date_default_timezone_set($serverTimezone);
        $properties = $this->getPropertiesForUi(self::nodeTypeWithDateProperty('d.m.Y'), ['date' => $serializedValue, 'title' => 'unchanged']);
        self::assertSame(['date' => $expected, 'title' => 'unchanged'], $properties);
    }

    #[Test]
    public function otherValuesArePassedToUiUnchanged(): void
    {
        $properties = ['date' => '2026-11-15T11:00:00+00:00'];
        self::assertSame($properties, $this->getPropertiesForUi(self::nodeTypeWithDateProperty('d.m.Y H:i'), $properties));
        self::assertSame(['date' => ''], $this->getPropertiesForUi(self::nodeTypeWithDateProperty('d.m.Y'), ['date' => '']));
    }

    #[Test]
    public function dateOnlyValuesRoundTripForAllServerOffsets(): void
    {
        $nodeType = self::nodeTypeWithDateProperty('d.m.Y');
        foreach (['Pacific/Pago_Pago', 'America/New_York', 'UTC', 'Europe/Berlin', 'Asia/Kolkata', 'Pacific/Auckland', 'Pacific/Kiritimati'] as $serverTimezone) {
            date_default_timezone_set($serverTimezone);
            foreach (['2026-01-15', '2026-03-29', '2026-07-01', '2026-10-25'] as $date) {
                $persisted = new \DateTimeImmutable($this->convert($nodeType, $date . 'T00:00:00+00:00'));
                $serialized = $persisted->setTimezone(new \DateTimeZone('UTC'))->format(DATE_W3C);
                self::assertSame(['date' => $date . 'T00:00:00+00:00'], $this->getPropertiesForUi($nodeType, ['date' => $serialized]), $serverTimezone . ' ' . $date);
            }
        }
    }
}
