Feature: GetNodeSummary

  Background:
    Given using the following content dimensions:
      | Identifier | Values      | Generalizations |
      | language   | de, en, gsw | gsw->de, en     |
    And using the following node types:
    """yaml
    'Neos.Neos:Sites':
      superTypes:
        'Neos.ContentRepository:Root': true

    'Neos.Neos:Document':
      abstract: true
      properties:
        title:
          type: string

    'Neos.Neos:Site':
      label: "${'Homepage ' + node.name}"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "globe"
        label: "My Homepage Type"

    'Vendor.Site:Document':
      label: "${Neos.Node.labelForNode(node).prefix('My Node: ').properties('title')}"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "my-icon"
        label: "My Document Type"

    'Vendor.Site:NotCustomizedDocument':
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
      | nodeAggregateId | parentNodeAggregateId | nodeTypeName                      | initialPropertyValues | originDimensionSpacePoint | nodeName |
      | homepage        | sites                 | Neos.Neos:Site                    | {"title": "home"}     | {"language": "en"}        | site-a   |
      | features        | homepage              | Vendor.Site:Document              | {"title": "features"} | {"language": "en"}        |          |
      | feature-a       | features              | Vendor.Site:Document              | {"title": "a"}        | {"language": "en"}        |          |
      | feature-b       | features              | Vendor.Site:NotCustomizedDocument | {"title": "b"}        | {"language": "en"}        |          |

    And the command CreateNodeVariant is executed with payload:
      | Key             | Value             |
      | nodeAggregateId | "homepage"        |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

    And the command CreateNodeVariant is executed with payload:
      | Key             | Value             |
      | nodeAggregateId | "features"        |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

    And the command CreateNodeVariant is executed with payload:
      | Key             | Value             |
      | nodeAggregateId | "feature-a"       |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value                      |
      | nodeAggregateId           | "features"                 |
      | originDimensionSpacePoint | {"language": "de"}         |
      | propertyValues            | {"title": "features (de)"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value               |
      | nodeAggregateId           | "feature-a"         |
      | originDimensionSpacePoint | {"language": "de"}  |
      | propertyValues            | {"title": "a (de)"} |

  Scenario: GetNodeSummary for homepage
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "homepage"           |
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [
                  {
                      "icon": "globe",
                      "label": "Homepage site-a"
                  }
              ],
              "icon": "globe",
              "label": "Homepage site-a",
              "uri": "node://homepage"
          }
      }
      """

  Scenario: GetNodeSummary for not configured node type
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "feature-b"          |
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [
                  {
                      "icon": "globe",
                      "label": "Homepage site-a"
                  },
                  {
                      "icon": "my-icon",
                      "label": "My Node: features"
                  },
                  {
                      "icon": "questionmark",
                      "label": "Vendor.Site:NotCustomizedDocument"
                  }
              ],
              "icon": "questionmark",
              "label": "Vendor.Site:NotCustomizedDocument",
              "uri": "node://feature-b"
          }
      }
      """

  Scenario: GetNodeSummary for customized node with parent
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "features"           |
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [
                  {
                      "icon": "globe",
                      "label": "Homepage site-a"
                  },
                  {
                      "icon": "my-icon",
                      "label": "My Node: features"
                  }
              ],
              "icon": "my-icon",
              "label": "My Node: features",
              "uri": "node://features"
          }
      }
      """

  Scenario: GetNodeSummary for root node
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "sites"           |
    # todo improve Neos' default config for Neos.Neos:Sites node type
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [],
              "icon": "questionmark",
              "label": "Neos.Neos:Sites",
              "uri": "node://sites"
          }
      }
      """

  Scenario: GetNodeSummary for customized node with multiple parents in another language
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["de"]} |
      | nodeId              | "feature-a"          |
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [
                  {
                      "icon": "globe",
                      "label": "Homepage site-a"
                  },
                  {
                      "icon": "my-icon",
                      "label": "My Node: features (de)"
                  },
                  {
                      "icon": "my-icon",
                      "label": "My Node: a (de)"
                  }
              ],
              "icon": "my-icon",
              "label": "My Node: a (de)",
              "uri": "node://feature-a"
          }
      }
      """
