<?php

use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Neos\Flow\Http\Client\Browser;
use Neos\Flow\Http\Client\InternalRequestEngine;
use Neos\Flow\Security\Context;
use Neos\Utility\ObjectAccess;
use PHPUnit\Framework\Assert;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestFactoryInterface;

// phpcs:ignore PSR1.Classes.ClassDeclaration.MissingNamespace
trait LinkEditorTrait
{
    private ResponseInterface|null $link_editor_last_query_response = null;

    /**
     * @template T of object
     * @param class-string<T> $className
     *
     * @return T
     */
    abstract private function getObject(string $className): object;

    /**
     * @When I issue the following query to :path:
     */
    public function iIssueTheFollowingQuery(string $path, TableNode $payload): void
    {
        $serverRequestFactory = $this->getObject(ServerRequestFactoryInterface::class);
        $serverRequest = $serverRequestFactory->createServerRequest(
            'GET',
            $path
        );
        $serverRequest = $serverRequest->withQueryParams(
            $this->decodePayloadTable(
                $payload
            )
        );

        $browser = $this->getObject(Browser::class);
        $engine = $this->getObject(InternalRequestEngine::class);
        // we must avoid $securityContext->clearContext() being called as this would overrule the active "withoutAuthorizationChecks"
        ObjectAccess::setProperty($engine, 'securityContext', new class {
            public function clearContext(): void
            {
            }
        }, true);
        $browser->setRequestEngine($engine);
        $this->link_editor_last_query_response = $this->getObject(Context::class)->withoutAuthorizationChecks(
            fn () => $browser->sendRequest($serverRequest)
        );
    }

    /**
     * @return array<string,mixed>
     */
    private function decodePayloadTable(TableNode $payloadTable): array
    {
        $eventPayload = [];
        foreach ($payloadTable->getHash() as $line) {
            (isset($line['Key']) and is_string($line['Key'])) or throw new \InvalidArgumentException('Key must be set.');
            $eventPayload[$line['Key']] = json_decode($line['Value'], true, 512, JSON_THROW_ON_ERROR);
        }

        return $eventPayload;
    }

    /**
     * @Then I expect the following query response:
     */
    public function iExpectTheFollowingQueryResponse(PyStringNode $rawJson): void
    {
        $contents = $this->link_editor_last_query_response?->getBody()->getContents();
        Assert::assertNotNull($contents);
        if (!str_starts_with($contents, '{')) {
            echo $contents;
            Assert::fail('Not a json response');
        }

        Assert::assertJsonStringEqualsJsonString(
            $rawJson->getRaw(),
            $contents
        );
    }
}
