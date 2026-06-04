Feature: Discard workspace changes

    Discarding throws away the user's pending changes in the personal workspace.
    These scenarios cover discarding both creations and deletions of document
    and content nodes.

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
        And I log in with username "admin" and password "password"

    Scenario: Discard nested page creation and return to the root document
        When I navigate to the "Home" page
        And I add a "Page_Test" child page named "DiscardTest"
        And I add a "Page_Test" child page named "DiscardTest"
        And I discard all changes
        Then no tree node "DiscardTest" should be visible
        And the focused tree node should be "Home"

    Scenario: Discard a created document node
        When I add a "Page_Test" page named "DiscardTest"
        Then the "DiscardTest" tree node should be visible
        And there should be unpublished changes
        When I discard all changes
        Then no tree node "DiscardTest" should be visible
        And there should be no unpublished changes
        And the rendered iframe should not show a Page Not Found page

    Scenario: Discard a document node deletion
        When I navigate to the "Node to delete" page
        Then the rendered content collection should contain "I'll be deleted"
        When I delete the selected page tree node
        Then no tree node "Node to delete" should be visible
        And the rendered iframe should not show a Page Not Found page
        When I discard all changes
        Then the "Node to delete" tree node should be visible

    Scenario: Discard a created content node
        When I add a "Headline_Test" node via the content tree
        Then the "Enter headline here" content tree node should be visible
        And the rendered content collection should contain "Enter headline here"
        And there should be unpublished changes
        When I discard all changes
        Then no tree node "Enter headline here" should be visible
        And the rendered content collection should not contain "Enter headline here"
        And there should be no unpublished changes

    Scenario: Discard a content node deletion
        When I open the content tree and select "Content node to delete"
        And I delete the selected content tree node
        Then no tree node "Content node to delete" should be visible
        And the rendered iframe should not contain a content property with text "Content node to delete"
        When I discard all changes
        Then the "Content node to delete" tree node should be visible
        And the rendered iframe should contain a content property with text "Content node to delete"
