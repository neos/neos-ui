<?php
declare(strict_types=1);

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

namespace Neos\Neos\Ui\Service;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Log\Utility\LogEnvironment;
use Neos\Flow\Property\TypeConverter\DateTimeConverter;
use Neos\Flow\Validation\Validator\DateTimeValidator;
use Neos\Flow\Validation\Validator\ValidatorInterface;
use Psr\Log\LoggerInterface;

/**
 * @Flow\Scope("singleton")
 */
class NodePropertyValidationService
{

    /**
     * @Flow\Inject
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @Flow\Inject
     * @var DateTimeConverter
     */
    protected $dateTimeConverter;

    /**
     * @param $value
     * @param string $validatorName
     * @param array $validatorConfiguration
     * @return bool
     */
    public function validate($value, string $validatorName, array $validatorConfiguration): bool
    {
        $validator = $this->resolveValidator($validatorName, $validatorConfiguration);

        if ($validator === null) {
            return true;
        }

        // Fixme: The from the UI delivered datetime string (2019-03-21T00:00:00+01:00) is not parsed correctly by the DateTimeParser in the DateTimeValidator,
        // so we cast it in prior and use this as final validation result.
        if ($validator instanceof DateTimeValidator) {
            if ($value === '') {
                return true;
            }

            if ($this->dateTimeConverter->canConvertFrom($value, 'DateTime')) {
                $value = $this->dateTimeConverter->convertFrom($value, 'DateTime');
                return $value instanceof \DateTime;
            }
        }

        $result = $validator->validate($value);
        return !$result->hasErrors();
    }

    /**
     * @param string $validatorName
     * @param array $validatorConfiguration
     * @return ValidatorInterface|null
     */
    protected function resolveValidator(string $validatorName, array $validatorConfiguration)
    {
        $nameParts = explode('/', $validatorName);
        if ($nameParts[0] !== 'Neos.Neos') {
            $this->logger->info(sprintf('The custom frontend property validator %s" is used. This property is not validated in the backend.', $validatorName), LogEnvironment::fromMethodName(__METHOD__));
            return null;
        }

        $fullQualifiedValidatorClassName = '\\Neos\\Flow\\Validation\\Validator\\' . end($nameParts);

        if (!class_exists($fullQualifiedValidatorClassName)) {
            $this->logger->warning(sprintf('Could not find a backend validator fitting to the frontend validator "%s"', $validatorName), LogEnvironment::fromMethodName(__METHOD__));
            return null;
        }

        return new $fullQualifiedValidatorClassName($validatorConfiguration);
    }
}
