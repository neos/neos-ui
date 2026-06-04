Feature: Discarding a tree-move change leaves the tree in a consistent state

    The underlying issue (neos/neos-ui#3184) was that after moving multiple
    document-tree nodes via drag-and-drop and then discarding the move, the
    tree could enter an inconsistent state — moved nodes vanishing, error
    flash messages, or stale guest-frame content. These scenarios are the
    regression suite around that fix.

    The test fixture's tree (excerpt):
      Home
      ├─ Discarding
      └─ Tree multiselect
         ├─ MultiA
         ├─ MultiB
         └─ MultiC

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
        And I log in with username "admin" and password "password"

    Scenario: Discard a multi-node move (into a sibling) does not flash an error
        When I select the "MultiA" tree node
        And I also select the "MultiB" tree node via ctrl-click
        And I drag the "MultiA" tree node onto the "MultiC" tree node
        And I discard all changes
        Then no error flash message should be visible

    Scenario: Discard a multi-node move keeps the moved nodes in the tree after a reload
        When I select the "MultiA" tree node
        And I also select the "MultiB" tree node via ctrl-click
        And I drag the "MultiA" tree node onto the "Discarding" tree node
        And I navigate to the "Tree multiselect" page
        And I reload the page
        And I discard all changes
        Then the "MultiA" tree node should be visible
        And the "MultiB" tree node should be visible

    Scenario: Discarding a move while focused on a moved node does not error in the guest frame
        When I select the "MultiA" tree node
        And I also select the "MultiB" tree node via ctrl-click
        And I drag the "MultiA" tree node onto the "MultiC" tree node
        And I navigate to the "Home" page
        And I reload the page
        And I navigate to the "MultiA" page
        And I discard all changes
        Then no error screen should be visible in the content iframe
        And the focused tree node should be "MultiA"
