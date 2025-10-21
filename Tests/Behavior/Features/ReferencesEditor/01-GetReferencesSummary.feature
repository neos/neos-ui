Feature: GetReferencesSummary

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
      references:
        myReferences:
          properties:
            test:
              type: string

    'Vendor.Site:NotCustomizedDocument':
      label: "${Neos.Node.labelForNode(node).prefix('My Node: ').properties('title')}"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "my-icon-b"
        label: "My Document Type"
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
      | target-a        | features              | Vendor.Site:Document              | {"title": "a"}        | {"language": "en"}        |          |
      | target-b        | features              | Vendor.Site:NotCustomizedDocument | {"title": "b"}        | {"language": "en"}        |          |

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
      | nodeAggregateId | "target-a"       |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

    And the command CreateNodeVariant is executed with payload:
      | Key             | Value             |
      | nodeAggregateId | "target-b"       |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value                      |
      | nodeAggregateId           | "features"                 |
      | originDimensionSpacePoint | {"language": "de"}         |
      | propertyValues            | {"title": "features (de)"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value               |
      | nodeAggregateId           | "target-a"         |
      | originDimensionSpacePoint | {"language": "de"}  |
      | propertyValues            | {"title": "a (de)"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value               |
      | nodeAggregateId           | "target-b"         |
      | originDimensionSpacePoint | {"language": "de"}  |
      | propertyValues            | {"title": "b (de)"} |

  Scenario: GetReferencesSummary for feature page without references set
    When I issue the following query to "http://127.0.0.1:8081/neos/references-editor/get-references-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "features"           |
      | referenceName       | "myReferences"       |
      | referenceIds        | []                   |
    Then I expect the following query response:
      """json
      {
          "success": {
              "references": []
          }
      }
      """

  Scenario: GetReferencesSummary for feature page with single reference set
    When the command SetNodeReferences is executed with payload:
      | Key                             | Value                                                    |
      | sourceNodeAggregateId           | "features"                                      |
      | sourceOriginDimensionSpacePoint | {"language": "en"}                                       |
      | references                      | [{"referenceName": "myReferences", "references": [{"target": "target-a"}]}]|

    When I issue the following query to "http://127.0.0.1:8081/neos/references-editor/get-references-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "features"           |
      | referenceName       | "myReferences"       |
      | referenceIds        | ["target-a"]         |
    Then I expect the following query response:
      """json
      {
          "success": {
              "references": [
                {
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
                        "icon": "my-icon",
                        "label": "My Node: a"
                    }
                  ],
                  "icon": "my-icon",
                  "label": "My Node: a",
                  "uri": "node://target-a",
                  "hasProperties": false,
                  "properties": null
                }
              ]
          }
      }
      """


  Scenario: GetReferencesSummary for feature page with multiple references set
    When the command SetNodeReferences is executed with payload:
      | Key                             | Value                                                    |
      | sourceNodeAggregateId           | "features"                                      |
      | sourceOriginDimensionSpacePoint | {"language": "en"}                                       |
      | references                      | [{"referenceName": "myReferences", "references": [{"target": "target-a"}, {"target": "target-b", "properties": {"test": "foo"}}]}]|

    When I issue the following query to "http://127.0.0.1:8081/neos/references-editor/get-references-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "features"           |
      | referenceName       | "myReferences"       |
      | referenceIds        | ["target-a", "target-b"]         |
    Then I expect the following query response:
      """json
      {
          "success": {
              "references": [
                {
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
                        "icon": "my-icon",
                        "label": "My Node: a"
                    }
                  ],
                  "icon": "my-icon",
                  "label": "My Node: a",
                  "uri": "node://target-a",
                  "hasProperties": false,
                  "properties": null
                },
                {
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
                        "icon": "my-icon-b",
                        "label": "My Node: b"
                    }
                  ],
                  "icon": "my-icon-b",
                  "label": "My Node: b",
                  "uri": "node://target-b",
                  "hasProperties": false,
                  "properties": {
                    "test": "foo"
                  }
                }
              ]
          }
      }
      """
