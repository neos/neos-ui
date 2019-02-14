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

use Neos\Flow\Log\SystemLoggerInterface;
use Neos\Flow\Tests\FunctionalTestCase;
use Neos\Flow\Validation\Validator\NotEmptyValidator;
use Neos\Neos\Ui\Service\NodePropertyValidationService;

class NodePropertyValidationServiceTest extends FunctionalTestCase
{

    /**
     * @var NodePropertyValidationService
     */
    protected $nodePropertyValidationService;

    public function setUp()
    {
        parent::setUp();

        $nodePropertyValidatorServiceProxy = $this->buildAccessibleProxy(NodePropertyValidationService::class);
        $this->nodePropertyValidationService = $this->objectManager->get($nodePropertyValidatorServiceProxy);

        $logger = $this->objectManager->get(SystemLoggerInterface::class);
        $this->inject($this->nodePropertyValidationService, 'logger', $logger);
    }

    /**
     * @test
     */
    public function resolveValidator()
    {
        $validator = $this->nodePropertyValidationService->_call('resolveValidator', 'Neos.Neos/Validation/NotEmptyValidator', []);
        $this->assertInstanceOf(NotEmptyValidator::class, $validator);
    }

    /**
     * @test
     */
    public function resolveCustomValidatorReturnsNull()
    {
        $validator = $this->nodePropertyValidationService->_call('resolveValidator', 'My.Own/Validation/NotEmptyValidator', []);
        $this->assertNull($validator);
    }

    /**
     * @test
     */
    public function validate()
    {
        $result = $this->nodePropertyValidationService->validate(
            'test',
            'Neos.Neos/Validation/StringLengthValidator',
            ['minimum' => 1, 'maximum' => 2]);

        $this->assertFalse($result);
    }

    /**
     * @test
     */
    public function ifNoBackendValidatorCanBeFoundValidationReturnsTrue()
    {
        $result = $this->nodePropertyValidationService->validate(
            'test',
            'My.Own/Validation/StringLengthValidator',
            ['minimum' => 1, 'maximum' => 255]);

        $this->assertTrue($result);
    }
}
