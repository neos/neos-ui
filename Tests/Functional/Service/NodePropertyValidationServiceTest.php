<?php
declare(strict_types=1);

namespace Neos\Neos\Ui\Tests\Functional\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Tests\FunctionalTestCase;
use Neos\Flow\Validation\Validator\NotEmptyValidator;
use Neos\Neos\Ui\Service\NodePropertyValidationService;
use PHPUnit\Framework\Assert;
use Psr\Log\LoggerInterface;

class NodePropertyValidationServiceTest extends FunctionalTestCase
{
    /**
     * @var NodePropertyValidationService
     */
    protected $nodePropertyValidationService;

    public function setUp(): void
    {
        parent::setUp();

        $nodePropertyValidatorServiceProxy = $this->buildAccessibleProxy(NodePropertyValidationService::class);
        $this->nodePropertyValidationService = $this->objectManager->get($nodePropertyValidatorServiceProxy);

        $logger = $this->objectManager->get(LoggerInterface::class);
        $this->inject($this->nodePropertyValidationService, 'logger', $logger);
    }

    /**
     * @test
     */
    public function resolveValidator(): void
    {
        $validator = $this->nodePropertyValidationService->_call('resolveValidator', 'Neos.Neos/Validation/NotEmptyValidator', []);
        Assert::assertInstanceOf(NotEmptyValidator::class, $validator);
    }

    /**
     * @test
     */
    public function resolveCustomValidatorReturnsNull(): void
    {
        $validator = $this->nodePropertyValidationService->_call('resolveValidator', 'My.Own/Validation/NotEmptyValidator', []);
        Assert::assertNull($validator);
    }

    /**
     * @test
     */
    public function validate(): void
    {
        $result = $this->nodePropertyValidationService->validate(
            'test',
            'Neos.Neos/Validation/StringLengthValidator',
            ['minimum' => 1, 'maximum' => 2]);

        Assert::assertFalse($result);
    }

    /**
     * @test
     */
    public function ifNoBackendValidatorCanBeFoundValidationReturnsTrue(): void
    {
        $result = $this->nodePropertyValidationService->validate(
            'test',
            'My.Own/Validation/StringLengthValidator',
            ['minimum' => 1, 'maximum' => 255]);

        Assert::assertTrue($result);
    }
}
