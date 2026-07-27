<?php

declare(strict_types=1);

use Behat\Gherkin\Node\PyStringNode;
use Neos\Flow\Security\Context;
use Neos\Neos\Ui\Domain\Model\FeedbackCollection;
use PHPUnit\Framework\Assert;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestFactoryInterface;

/**
 * @internal only for behat tests within the Neos.Neos package
 */
trait NeosUiChangeTrait
{
    private ResponseInterface|null $neosUiChangeResponse = null;

    /**
     * @template T of object
     * @param class-string<T> $className
     *
     * @return T
     */
    abstract private function getObject(string $className): object;

    /**
     * @BeforeScenario
     */
    public function setupNeosUiChangeTrait(): void
    {
        $this->neosUiChangeResponse = null;
        $this->getObject(FeedbackCollection::class)->reset();
    }


    /**
     * @When I dispatch the following neos-ui change:
     */
    public function iDispatchTheFollowingNeosUiChange(PyStringNode $change)
    {
        $arguments = ['changes' => [json_decode($change->getRaw(), true, 512, JSON_THROW_ON_ERROR)]];

        $httpRequest = $this->getObject(ServerRequestFactoryInterface::class)->createServerRequest('POST', '/neos/ui-services/change')
            ->withHeader('X-Flow-Csrftoken', $this->getObject(Context::class)->getCsrfProtectionToken())
            ->withParsedBody($arguments);

        $this->neosUiChangeResponse = $this->getObject(\Neos\Flow\Http\Middleware\MiddlewaresChain::class)->handle(
            $httpRequest
        );

        // reset state
        $this->getObject(FeedbackCollection::class)->reset();
    }

    /**
     * @When I expect the neos-ui feedbacks to contain type :type:
     */
    public function iExpectTheFollowingNeosUiFeedbackForType(string $type, PyStringNode $rawFeedbacks)
    {
        $feedbacks = json_decode($this->neosUiChangeResponse->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR)['feedbacks'];

        $expectedFeedbacksWithType = array_map(
            fn (array $row) => array_key_exists('type', $row) ? throw new \RuntimeException('Type is not supposed to be set in snapshot.') : array_merge(['type' => $type], $row),
            json_decode($rawFeedbacks->getRaw(), true, 512, JSON_THROW_ON_ERROR)
        );

        $matchingFeedbacks = array_filter(
            $feedbacks,
            fn (array $row) => ($row['type'] ?? null) === $type
        );

        Assert::assertEquals(count($expectedFeedbacksWithType), count($matchingFeedbacks), sprintf(
            'The expected %d feedback but found %d: %s',
            count($expectedFeedbacksWithType),
            count($matchingFeedbacks),
            json_encode($feedbacks, JSON_PRETTY_PRINT)
        ));

        foreach ($expectedFeedbacksWithType as $i => $expectedFeedback) {
            foreach ($matchingFeedbacks as $actualFeedback) {
                if ($actualFeedback === $expectedFeedback) {
                    continue 2;
                }
            }
            Assert::fail(
                sprintf(
                    'The expected feedback %s is not contained in: %s',
                    $i,
                    json_encode($feedbacks, JSON_PRETTY_PRINT)
                )
            );
        }
    }
}
