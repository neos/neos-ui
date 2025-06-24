Feature: GetTreeQuery

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
      label: "${'Homepage ' + node.name}"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "globe"
        label: "Home Page Type"

    'Vendor.Site:Document':
      label: "${Neos.Node.labelForNode(node).prefix('My Node: ').properties('title')}"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "my-icon"
        label: "My Document Type"

    'Vendor.Site:OtherDocument':
      label: "My Other Node"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "my-other-icon"
        label: "My Other Document Type"

    'Vendor.Site:Content':
      superTypes:
        'Neos.Neos:Content': true
      ui:
        icon: "my-content"
        label: "My Content"
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
            | nodeAggregateId      | parentNodeAggregateId | nodeTypeName              | initialPropertyValues        | originDimensionSpacePoint | nodeName |
            | homepage             | sites                 | Neos.Neos:Site            | {"title": "home"}            | {"language": "en"}        | site-a   |
            | features             | homepage              | Vendor.Site:Document      | {"title": "features"}        | {"language": "en"}        | features |
            | features-content     | features              | Vendor.Site:Content       | {}                           | {"language": "en"}        |          |
            | feature-a-default    | features              | Vendor.Site:Document      | {"title": "a"}               | {"language": "en"}        | a        |
            | feature-a1-default   | feature-a-default     | Vendor.Site:Document      | {"title": "a1"}              | {"language": "en"}        | leaf     |
            | feature-a2-default   | feature-a-default     | Vendor.Site:Document      | {"title": "a2"}              | {"language": "en"}        |          |
            | feature-b-disabled   | features              | Vendor.Site:Document      | {"title": "b"}               | {"language": "en"}        |          |
            | feature-c-other-type | features              | Vendor.Site:OtherDocument | {"title": "c"}               | {"language": "en"}        |          |
            | feature-c1-default   | feature-c-other-type  | Vendor.Site:Document      | {"title": "c1"}              | {"language": "en"}        |          |
            | feature-d-multi-dsp  | features              | Vendor.Site:Document      | {"title": "d"}               | {"language": "en"}        | d        |
            | search               | homepage              | Vendor.Site:Document      | {"title": "search"}          | {"language": "en"}        | search   |
            | search-content       | search                | Vendor.Site:Content       | {}                           | {"language": "en"}        |          |
            | search-a-default     | search                | Vendor.Site:Document      | {"title": "a"}               | {"language": "en"}        |          |
            | search-a1-default    | search-a-default      | Vendor.Site:Document      | {"title": "a1"}              | {"language": "en"}        |          |
            | search-a2-other-type | search-a-default      | Vendor.Site:OtherDocument | {"title": "a2"}              | {"language": "en"}        |          |
            | search-a3-other-text | search-a-default      | Vendor.Site:OtherDocument | {"title": "a3 special text"} | {"language": "en"}        |          |
            | search-b-with-text   | search                | Vendor.Site:Document      | {"title": "b special text"}  | {"language": "en"}        |          |
            | search-c-other-type  | search                | Vendor.Site:OtherDocument | {"title": "c"}               | {"language": "en"}        |          |

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
            | Key             | Value                 |
            | nodeAggregateId | "feature-d-multi-dsp" |
            | sourceOrigin    | {"language":"en"}     |
            | targetOrigin    | {"language":"de"}     |

        And the command SetNodeProperties is executed with payload:
            | Key                       | Value                      |
            | nodeAggregateId           | "features"                 |
            | originDimensionSpacePoint | {"language": "de"}         |
            | propertyValues            | {"title": "features (de)"} |

        And the command SetNodeProperties is executed with payload:
            | Key                       | Value                 |
            | nodeAggregateId           | "feature-d-multi-dsp" |
            | originDimensionSpacePoint | {"language": "de"}    |
            | propertyValues            | {"title": "d (de)"}   |

        Given the command TagSubtree is executed with payload:
            | Key                          | Value                |
            | nodeAggregateId              | "feature-b-disabled" |
            | nodeVariantSelectionStrategy | "allVariants"        |
            | tag                          | "disabled"           |

        And the command CreateWorkspace is executed with payload:
            | Key                | Value                |
            | workspaceName      | "user-test"          |
            | baseWorkspaceName  | "live"               |
            | newContentStreamId | "user-cs-identifier" |

        And I am in workspace "user-test" and dimension space point {"language": "en"}

    Scenario: Simplest GetTreeQuery before changes are applied

        When I issue the following query to "http://127.0.0.1:8081/neos/ui-services/get-tree":
            | Key                  | Value                                                                                                                       |
            | startingPoint        | '{"contentRepositoryId":"default","workspaceName":"user-test","dimensionSpacePoint":{"language":"en"},"aggregateId":"homepage"}' |
            | loadingDepth         | 1                                                                                                                           |
            | baseNodeTypeFilter   | ""                                                                                                                          |
            | narrowNodeTypeFilter | null                                                                                                                        |
            | searchTerm           | null                                                                                                                        |
            | selectedNodeId       | null                                                                                                                        |

        Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": false,
                  "icon": "globe",
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "isMatchedByFilter": true,
                  "label": "Homepage site-a",
                  "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"homepage\"}",
                  "nodeTypeLabel": "Home Page Type",
                  "isCreated": false,
                  "isModified": false,
                  "isRemoved": false,
                  "children": [
                      {
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": true,
                          "children": [],
                          "icon": "my-icon",
                          "isCreated": false,
                          "isRemoved": false,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "isMatchedByFilter": true,
                          "isModified": false,
                          "label": "My Node: features",
                          "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"features\"}",
                          "nodeTypeLabel": "My Document Type"
                      },
                      {
                          "children": [],
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": true,
                          "icon": "my-icon",
                          "isCreated": false,
                          "isRemoved": false,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "isMatchedByFilter": true,
                          "isModified": false,
                          "label": "My Node: search",
                          "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"search\"}",
                          "nodeTypeLabel": "My Document Type"
                     }
                  ]
              }
          }
      }
      """

    Scenario: Ensure isCreated and isModified is detected for Nodes

        And the command CreateNodeAggregateWithNode is executed with payload:
            | Key                   | Value                                     |
            | nodeAggregateId       | "nodus-plus"                              |
            | nodeTypeName          | "Vendor.Site:Document"                    |
            | parentNodeAggregateId | "homepage"                                |
            | nodeName              | "child-document"                          |
            | initialPropertyValues | {"title": "Extra Node - added"}           |

        And the command SetNodeProperties is executed with payload:
            | Key                       | Value                                 |
            | workspaceName             | "user-test"                           |
            | nodeAggregateId           | "features"                            |
            | originDimensionSpacePoint | {"language": "en"}                    |
            | propertyValues            | {"title": "features (en) - modified"} |

        When I issue the following query to "http://127.0.0.1:8081/neos/ui-services/get-tree":
            | Key                  | Value                                                                                                                       |
            | startingPoint        | '{"contentRepositoryId":"default","workspaceName":"user-test","dimensionSpacePoint":{"language":"en"},"aggregateId":"homepage"}' |
            | loadingDepth         | 1                                                                                                                           |
            | baseNodeTypeFilter   | ""                                                                                                                          |
            | narrowNodeTypeFilter | null                                                                                                                        |
            | searchTerm           | null                                                                                                                        |
            | selectedNodeId       | null                                                                                                                        |

        Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": false,
                  "icon": "globe",
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "isMatchedByFilter": true,
                  "label": "Homepage site-a",
                  "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"homepage\"}",
                  "nodeTypeLabel": "Home Page Type",
                  "isCreated": false,
                  "isModified": false,
                  "isRemoved": false,
                  "children": [
                      {
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": true,
                          "children": [],
                          "icon": "my-icon",
                          "isCreated": false,
                          "isRemoved": false,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "isMatchedByFilter": true,
                          "isModified": true,
                          "label": "My Node: features (en) - modified",
                          "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"features\"}",
                          "nodeTypeLabel": "My Document Type"
                      },
                      {
                          "children": [],
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": true,
                          "icon": "my-icon",
                          "isCreated": false,
                          "isRemoved": false,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "isMatchedByFilter": true,
                          "isModified": false,
                          "label": "My Node: search",
                          "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"search\"}",
                          "nodeTypeLabel": "My Document Type"
                     },
                     {
                          "children": [],
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": false,
                          "icon": "my-icon",
                          "isCreated": true,
                          "isRemoved": false,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "isMatchedByFilter": true,
                          "isModified": true,
                          "label": "My Node: Extra Node - added",
                          "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"nodus-plus\"}",
                          "nodeTypeLabel": "My Document Type"
                     }
                  ]
              }
          }
      }
      """

    Scenario: Deleted nodes are returned but not their children

        Given the command TagSubtree is executed with payload:
            | Key                          | Value                |
            | nodeAggregateId              | "features"           |
            | nodeVariantSelectionStrategy | "allVariants"        |
            | tag                          | "removed"            |

        When I issue the following query to "http://127.0.0.1:8081/neos/ui-services/get-tree":
            | Key                  | Value                                                                                                                       |
            | startingPoint        | '{"contentRepositoryId":"default","workspaceName":"user-test","dimensionSpacePoint":{"language":"en"},"aggregateId":"homepage"}' |
            | loadingDepth         | 2                                                                                                                           |
            | baseNodeTypeFilter   | ""                                                                                                                          |
            | narrowNodeTypeFilter | null                                                                                                                        |
            | searchTerm           | null                                                                                                                        |
            | selectedNodeId       | null                                                                                                                        |

        Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": false,
                  "icon": "globe",
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "isMatchedByFilter": true,
                  "label": "Homepage site-a",
                  "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"homepage\"}",
                  "nodeTypeLabel": "Home Page Type",
                  "isCreated": false,
                  "isModified": false,
                  "isRemoved": false,
                  "children": [
                      {
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": false,
                          "children": [],
                          "icon": "my-icon",
                          "isCreated": false,
                          "isRemoved": true,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "isMatchedByFilter": true,
                          "isModified": true,
                          "label": "My Node: features",
                          "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"features\"}",
                          "nodeTypeLabel": "My Document Type"
                      },
                      {
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": false,
                          "icon": "my-icon",
                          "isCreated": false,
                          "isRemoved": false,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "isMatchedByFilter": true,
                          "isModified": false,
                          "label": "My Node: search",
                          "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"search\"}",
                          "nodeTypeLabel": "My Document Type",
                          "children": [
                            {
                                "children": [],
                                "hasScheduledDisabledState": false,
                                "hasUnloadedChildren": false,
                                "icon": "my-content",
                                "isCreated": false,
                                "isRemoved": false,
                                "isDisabled": false,
                                "isHiddenInMenu": false,
                                "isMatchedByFilter": true,
                                "isModified": false,
                                "label": "Vendor.Site:Content",
                                "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"search-content\"}",
                                "nodeTypeLabel": "My Content"
                            },
                            {
                                "children": [],
                                "hasScheduledDisabledState": false,
                                "hasUnloadedChildren": true,
                                "icon": "my-icon",
                                "isCreated": false,
                                "isRemoved": false,
                                "isDisabled": false,
                                "isHiddenInMenu": false,
                                "isMatchedByFilter": true,
                                "isModified": false,
                                "label": "My Node: a",
                                "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"search-a-default\"}",
                                "nodeTypeLabel": "My Document Type"
                            },
                            {
                                "children": [],
                                "hasScheduledDisabledState": false,
                                "hasUnloadedChildren": false,
                                "icon": "my-icon",
                                "isCreated": false,
                                "isRemoved": false,
                                "isDisabled": false,
                                "isHiddenInMenu": false,
                                "isMatchedByFilter": true,
                                "isModified": false,
                                "label": "My Node: b special text",
                                "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"search-b-with-text\"}",
                                "nodeTypeLabel": "My Document Type"
                            },
                            {
                                "children": [],
                                "hasScheduledDisabledState": false,
                                "hasUnloadedChildren": false,
                                "icon": "my-other-icon",
                                "isCreated": false,
                                "isRemoved": false,
                                "isDisabled": false,
                                "isHiddenInMenu": false,
                                "isMatchedByFilter": true,
                                "isModified": false,
                                "label": "My Other Node",
                                "nodeAddress": "{\"contentRepositoryId\":\"default\",\"workspaceName\":\"user-test\",\"dimensionSpacePoint\":{\"language\":\"en\"},\"aggregateId\":\"search-c-other-type\"}",
                                "nodeTypeLabel": "My Other Document Type"
                            }
                        ]
                     }
                  ]
              }
          }
      }
      """
