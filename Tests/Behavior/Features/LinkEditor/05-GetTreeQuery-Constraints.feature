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

  Scenario: Invalid starting path
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-tree":
      | Key                  | Value                |
      | contentRepositoryId  | "default"            |
      | workspaceName        | "live"               |
      | dimensionValues      | {"language": ["en"]} |
      | startingPoint        | "/sites"             |
      | loadingDepth         | 0                    |
      | baseNodeTypeFilter   | ""                   |
      | linkableNodeTypes    | []                   |
      | narrowNodeTypeFilter | ""                   |
      | searchTerm           | ""                   |
      | selectedNodeId       | null                 |
    Then I expect the following query response:
      """json
      {
          "error": {
              "code": 1687207234,
              "message": "Absolute node paths must serialized beginning with the pattern \"/<My.Package:Root>\" ,\"/sites\" does not",
              "type": "Neos\\ContentRepository\\Core\\SharedModel\\Exception\\AbsoluteNodePathIsInvalid"
          }
      }
      """

  Scenario: Not existing starting path
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-tree":
      | Key                  | Value                             |
      | contentRepositoryId  | "default"                         |
      | workspaceName        | "live"                            |
      | dimensionValues      | {"language": ["en"]}              |
      | startingPoint        | "/<Neos.Neos:Sites>/non-existing" |
      | loadingDepth         | 0                                 |
      | baseNodeTypeFilter   | ""                                |
      | linkableNodeTypes    | []                                |
      | narrowNodeTypeFilter | ""                                |
      | searchTerm           | ""                                |
      | selectedNodeId       | null                              |
    Then I expect the following query response:
      """json
      {
          "error": {
              "code": 1715082893,
              "message": "The starting point at path \"/<Neos.Neos:Sites>/non-existing\" does not exist in subgraph: {\n    \"contentRepositoryId\": \"default\",\n    \"workspaceName\": \"live\",\n    \"dimensionSpacePoint\": {\n        \"language\": \"en\"\n    }\n}",
              "type": "Neos\\Neos\\Ui\\LinkEditor\\Application\\GetTree\\StartingPointWasNotFound"
          }
      }
      """

  Scenario: Negative loading depth
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-tree":
      | Key                  | Value                       |
      | contentRepositoryId  | "default"                   |
      | workspaceName        | "live"                      |
      | dimensionValues      | {"language": ["en"]}        |
      | startingPoint        | "/<Neos.Neos:Sites>/site-a" |
      | loadingDepth         | -1                          |
      | baseNodeTypeFilter   | ""                          |
      | linkableNodeTypes    | []                          |
      | narrowNodeTypeFilter | ""                          |
      | searchTerm           | ""                          |
      | selectedNodeId       | null                        |
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
