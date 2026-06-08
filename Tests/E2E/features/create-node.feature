Feature: Create node

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
        And I log in with username "admin" and password "password"

    Scenario: Create node
        When I navigate to the "Home" page
        And the command "CreateRootNodeAggregateWithNode" is executed with payload:
        | Key             | Value                         |
        | nodeAggregateId | "lady-eleonode-rootford"      |
        | nodeTypeName    | "Neos.ContentRepository:Root" |