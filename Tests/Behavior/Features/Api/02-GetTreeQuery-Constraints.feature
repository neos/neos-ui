Feature: GetTreeQuery Constraints

    Background:
        Given using the following content dimensions:
            | Identifier | Values      | Generalizations |
            | language   | de, en, gsw | gsw->de, en     |
        And using the following node types:
    """yaml
    'Neos.Neos:Sites':
      superTypes:
        'Neos.ContentRepository:Root': true

    'Neos.Neos:Content':
      abstract: true

    'Neos.Neos:Document':
      abstract: true
      properties:
        title:
          type: string

    'Neos.Neos:Site':
      superTypes:
        'Neos.Neos:Document': true
    """
        And using identifier "default", I define a content repository
        And I am in content repository "default"
        And the command CreateRootWorkspace is executed with payload:
            | Key                | Value           |
            | workspaceName      | "live"          |
            | newContentStreamId | "cs-identifier" |
        And I am in workspace "live" and dimension space point {"language": "en"}
        And the command CreateRootNodeAggregateWithNode is executed with payload:
            | Key             | Value             |
            | nodeAggregateId | "sites"           |
            | nodeTypeName    | "Neos.Neos:Sites" |

        And the following CreateNodeAggregateWithNode commands are executed:
            | nodeAggregateId | parentNodeAggregateId | nodeTypeName   | initialPropertyValues | originDimensionSpacePoint | nodeName |
            | homepage        | sites                 | Neos.Neos:Site | {"title": "home"}     | {"language": "en"}        | site-a   |

    Scenario: Not existing starting path
        When I issue the following query to "http://127.0.0.1:8081/neos/ui-services/get-tree":
            | Key                  | Value                                                                                                                           |
            | startingPoint        | '{"contentRepositoryId":"default","workspaceName":"live","dimensionSpacePoint":{"language":"en"},"aggregateId":"non-existing"}' |
            | loadingDepth         | 0                                                                                                                               |
            | baseNodeTypeFilter   | ""                                                                                                                              |
            | narrowNodeTypeFilter | null                                                                                                                            |
            | searchTerm           | null                                                                                                                            |
            | selectedNodeId       | null                                                                                                                            |
        Then I expect the following query response:
      """json
      {
          "error": {
              "code": 1745436877,
              "message": "The starting point node id \"non-existing\" does not exist in subgraph: {\n    \"contentRepositoryId\": \"default\",\n    \"workspaceName\": \"live\",\n    \"dimensionSpacePoint\": {\n        \"language\": \"en\"\n    }\n}",
              "type": "Neos\\Neos\\Ui\\Application\\GetTree\\StartingPointWasNotFound"
          }
      }
      """

    Scenario: StartingPoint and selectedNodeId mismatch in context
        When I issue the following query to "http://127.0.0.1:8081/neos/ui-services/get-tree":
            | Key                  | Value                                                                                                                       |
            | startingPoint        | '{"contentRepositoryId":"default","workspaceName":"live","dimensionSpacePoint":{"language":"en"},"aggregateId":"homepage"}' |
            | loadingDepth         | 0                                                                                                                           |
            | baseNodeTypeFilter   | ""                                                                                                                          |
            | narrowNodeTypeFilter | null                                                                                                                        |
            | searchTerm           | null                                                                                                                        |
            | selectedNodeId       | '{"contentRepositoryId":"default","workspaceName":"live","dimensionSpacePoint":{"language":"de"},"aggregateId":"homepage"}' |
        Then I expect the following query response:
      """json
      {
          "error": {
              "code": 1750692165,
              "message": "Selected node address and starting node address must be in the same dimension space",
              "type": "InvalidArgumentException"
          }
      }
      """

    Scenario: Negative loading depth
        When I issue the following query to "http://127.0.0.1:8081/neos/ui-services/get-tree":
            | Key                  | Value                                                                                                                       |
            | startingPoint        | '{"contentRepositoryId":"default","workspaceName":"live","dimensionSpacePoint":{"language":"en"},"aggregateId":"homepage"}' |
            | loadingDepth         | -1                                                                                                                          |
            | baseNodeTypeFilter   | ""                                                                                                                          |
            | narrowNodeTypeFilter | null                                                                                                                        |
            | searchTerm           | null                                                                                                                        |
            | selectedNodeId       | null                                                                                                                        |
        Then I expect the following query response:
      """json
      {
          "error": {
              "code": 1745164594,
              "message": "Loading depth must not be negative, got -1",
              "type": "InvalidArgumentException"
          }
      }
      """
