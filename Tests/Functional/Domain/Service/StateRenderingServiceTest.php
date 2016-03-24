<?php
namespace PackageFactory\Guevara\Tests\Functional\Domain\Service;

use PackageFactory\Guevara\Domain\Service\StateRenderingService;
use TYPO3\Flow\Tests\FunctionalTestCase;


/**
 * Tests checking correct Uri behavior for Neos nodes.
 */
class StateRenderingServiceTest extends FunctionalTestCase
{

    /**
     * @var StateRenderingService
     */
    protected $stateRenderingService;

    public function setUp()
    {
        parent::setUp();
        $this->stateRenderingService = $this->objectManager->get('PackageFactory\Guevara\Domain\Service\StateRenderingService');
    }

    /**
     * @test
     */
    public function simpleValuesArePassedThrough()
    {
        $actual = $this->stateRenderingService->computeState([
            'key' => 'value'
        ], []);

        $expected = [
            'key' => 'value'
        ];

        $this->assertSame($expected, $actual);
    }

    /**
     * @test
     */
    public function eelExpressionsAreDetectedAndReplaced()
    {
        $actual = $this->stateRenderingService->computeState([
            'key' => '${dynamic}'
        ], ['dynamic' => 'foo']);

        $expected = [
            'key' => 'foo'
        ];

        $this->assertSame($expected, $actual);
    }

    /**
     * @test
     */
    public function nullAndNumberKeysWork()
    {
        $actual = $this->stateRenderingService->computeState([
            'key' => null,
            'key2' => 42,
            'key3' => true
        ], []);

        $expected = [
            'key' => null,
            'key2' => 42,
            'key3' => true
        ];

        $this->assertSame($expected, $actual);
    }

    /**
     * @test
     */
    public function recursionWorks()
    {
        $actual = $this->stateRenderingService->computeState([
            'key' => [
                'nested' => '${dynamic}'
            ]
        ], ['dynamic' => 'foo']);

        $expected = [
            'key' => [
                'nested' => 'foo'
            ]
        ];

        $this->assertSame($expected, $actual);
    }
}
