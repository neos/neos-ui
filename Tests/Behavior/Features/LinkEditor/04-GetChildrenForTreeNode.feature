Feature: GetChildrenForTreeNode

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

    'Vendor.Site:SpecialLinkable':
      abstract: true

    'Vendor.Site:IncludedLinkableDocument':
      superTypes:
        'Vendor.Site:Document': true
        'Vendor.Site:SpecialLinkable': true
      ui:
        label: "My Included Document Type"

    'Vendor.Site:ExcludedLinkableDocument':
      superTypes:
        'Vendor.Site:IncludedLinkableDocument': true
        'Vendor.Site:SpecialLinkable': false
      ui:
        label: "My Excluded Document Type"
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
      | nodeAggregateId      | parentNodeAggregateId | nodeTypeName                         | initialPropertyValues | originDimensionSpacePoint | nodeName |
      | homepage             | sites                 | Neos.Neos:Site                       | {"title": "home"}     | {"language": "en"}        | site-a   |
      | features             | homepage              | Vendor.Site:Document                 | {"title": "features"} | {"language": "en"}        |          |
      | content-a            | features              | Vendor.Site:Content                  | {}                    | {"language": "en"}        |          |
      | feature-a-multi-dsp  | features              | Vendor.Site:Document                 | {"title": "a"}        | {"language": "en"}        |          |
      | feature-b-disabled   | features              | Vendor.Site:Document                 | {"title": "b"}        | {"language": "en"}        |          |
      | feature-c-other-type | features              | Vendor.Site:OtherDocument            | {"title": "c"}        | {"language": "en"}        |          |
      | linkable             | homepage              | Vendor.Site:Document                 | {"title": "linkable"} | {"language": "en"}        |          |
      | linkable-a-default   | linkable              | Vendor.Site:Document                 | {"title": "a"}        | {"language": "en"}        |          |
      | linkable-b-included  | linkable              | Vendor.Site:IncludedLinkableDocument | {"title": "b"}        | {"language": "en"}        |          |
      | linkable-c-excluded  | linkable              | Vendor.Site:ExcludedLinkableDocument | {"title": "c"}        | {"language": "en"}        |          |

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
      | nodeAggregateId | "feature-a-multi-dsp" |
      | sourceOrigin    | {"language":"en"}     |
      | targetOrigin    | {"language":"de"}     |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value                      |
      | nodeAggregateId           | "features"                 |
      | originDimensionSpacePoint | {"language": "de"}         |
      | propertyValues            | {"title": "features (de)"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value                 |
      | nodeAggregateId           | "feature-a-multi-dsp" |
      | originDimensionSpacePoint | {"language": "de"}    |
      | propertyValues            | {"title": "a (de)"}   |

    Given the command TagSubtree is executed with payload:
      | Key                          | Value                |
      | nodeAggregateId              | "feature-b-disabled" |
      | nodeVariantSelectionStrategy | "allVariants"        |
      | tag                          | "disabled"           |

  Scenario: GetChildrenForTreeNode for homepage with nested children
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-children-for-tree-node":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | treeNodeId          | "homepage"           |
      | nodeTypeFilter      | ""                   |
      | linkableNodeTypes   | []                   |
    Then I expect the following query response:
      """json
      {
          "success": {
              "children": [
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": true,
                       "icon": "my-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": true,
                       "isMatchedByFilter": true,
                       "label": "My Node: features",
                       "nodeAggregateIdentifier": "features",
                       "nodeTypeLabel": "My Document Type"
                   },
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": true,
                       "icon": "my-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": true,
                       "isMatchedByFilter": true,
                       "label": "My Node: linkable",
                       "nodeAggregateIdentifier": "linkable",
                       "nodeTypeLabel": "My Document Type"
                   }
               ]
          }
      }
      """

  Scenario: GetChildrenForTreeNode for leaf node
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-children-for-tree-node":
      | Key                 | Value                 |
      | contentRepositoryId | "default"             |
      | workspaceName       | "live"                |
      | dimensionValues     | {"language": ["en"]}  |
      | treeNodeId          | "feature-a-multi-dsp" |
      | nodeTypeFilter      | ""                    |
      | linkableNodeTypes   | []                    |
    Then I expect the following query response:
      """json
      {
          "success": {
              "children": []
          }
      }
      """

  Scenario: GetChildrenForTreeNode for document with multiple children
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-children-for-tree-node":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | treeNodeId          | "features"           |
      | nodeTypeFilter      | "Neos.Neos:Document" |
      | linkableNodeTypes   | []                   |
    Then I expect the following query response:
      """json
      {
          "success": {
              "children": [
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": false,
                       "icon": "my-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": true,
                       "isMatchedByFilter": true,
                       "label": "My Node: a",
                       "nodeAggregateIdentifier": "feature-a-multi-dsp",
                       "nodeTypeLabel": "My Document Type"
                   },
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": false,
                       "icon": "my-icon",
                       "isDisabled": true,
                       "isHiddenInMenu": false,
                       "isLinkable": true,
                       "isMatchedByFilter": true,
                       "label": "My Node: b",
                       "nodeAggregateIdentifier": "feature-b-disabled",
                       "nodeTypeLabel": "My Document Type"
                   },
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": false,
                       "icon": "my-other-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": true,
                       "isMatchedByFilter": true,
                       "label": "My Other Node",
                       "nodeAggregateIdentifier": "feature-c-other-type",
                       "nodeTypeLabel": "My Other Document Type"
                   }
               ]
          }
      }
      """

  Scenario: GetChildrenForTreeNode for document with filtered children
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-children-for-tree-node":
      | Key                 | Value                       |
      | contentRepositoryId | "default"                   |
      | workspaceName       | "live"                      |
      | dimensionValues     | {"language": ["en"]}        |
      | treeNodeId          | "features"                  |
      | nodeTypeFilter      | "Vendor.Site:OtherDocument" |
      | linkableNodeTypes   | []                          |
    Then I expect the following query response:
      """json
      {
          "success": {
              "children": [
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": false,
                       "icon": "my-other-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": true,
                       "isMatchedByFilter": true,
                       "label": "My Other Node",
                       "nodeAggregateIdentifier": "feature-c-other-type",
                       "nodeTypeLabel": "My Other Document Type"
                   }
               ]
          }
      }
      """

  Scenario: GetChildrenForTreeNode for document with one child in other dimension
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-children-for-tree-node":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["de"]} |
      | treeNodeId          | "features"           |
      | nodeTypeFilter      | ""                   |
      | linkableNodeTypes   | []                   |
    Then I expect the following query response:
      """json
      {
          "success": {
              "children": [
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": false,
                       "icon": "my-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": true,
                       "isMatchedByFilter": true,
                       "label": "My Node: a (de)",
                       "nodeAggregateIdentifier": "feature-a-multi-dsp",
                       "nodeTypeLabel": "My Document Type"
                   }
               ]
          }
      }
      """

  Scenario: GetChildrenForTreeNode for document with filtered children
    When I issue the following query to "http://127.0.0.1:8081/neos/link-editor/get-children-for-tree-node":
      | Key                 | Value                           |
      | contentRepositoryId | "default"                       |
      | workspaceName       | "live"                          |
      | dimensionValues     | {"language": ["en"]}            |
      | treeNodeId          | "linkable"                      |
      | nodeTypeFilter      | "Neos.Neos:Document"            |
      | linkableNodeTypes   | ["Vendor.Site:SpecialLinkable"] |
    Then I expect the following query response:
      """json
      {
          "success": {
              "children": [
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": false,
                       "icon": "my-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": false,
                       "isMatchedByFilter": true,
                       "label": "My Node: a",
                       "nodeAggregateIdentifier": "linkable-a-default",
                       "nodeTypeLabel": "My Document Type"
                   },
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": false,
                       "icon": "my-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": true,
                       "isMatchedByFilter": true,
                       "label": "My Node: b",
                       "nodeAggregateIdentifier": "linkable-b-included",
                       "nodeTypeLabel": "My Included Document Type"
                   },
                   {
                       "children": [],
                       "hasScheduledDisabledState": false,
                       "hasUnloadedChildren": false,
                       "icon": "my-icon",
                       "isDisabled": false,
                       "isHiddenInMenu": false,
                       "isLinkable": false,
                       "isMatchedByFilter": true,
                       "label": "My Node: c",
                       "nodeAggregateIdentifier": "linkable-c-excluded",
                       "nodeTypeLabel": "My Excluded Document Type"
                   }
               ]
          }
      }
      """
