Feature: Inspector property editing and unapplied changes

    The page-title editing flow + unapplied-changes dialog branches (test 1)
    and the ClientEval dependency between SelectBox properties (test 2).

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
        And I log in with username "admin" and password "password"

    Scenario: Edit page title with URI sync, discard, then apply
        When I navigate to the "Discarding" page
        Then the inspector "title" field should show "Discarding"
        And the inspector "uriPathSegment" field should show "discarding"

        When I append "-привет!" to the inspector "title" field
        And I sync the URL path segment from the title
        Then the inspector "uriPathSegment" field should show "discarding-privet"

        When I discard the inspector changes
        Then the inspector "title" field should show "Discarding"

        When I append "-1" to the inspector "title" field
        And I apply the inspector changes
        Then the inspector "title" field should show "Discarding-1"

    Scenario: Unapplied-changes dialog - resume keeps the pending edit
        When I navigate to the "Discarding" page
        And I append "-resumed" to the inspector "title" field
        And I click outside the inspector to trigger the unapplied-changes overlay
        Then the unapplied-changes dialog should be visible
        When I resume editing in the unapplied-changes dialog
        Then the unapplied-changes dialog should not be visible
        And the inspector "title" field should show "Discarding-resumed"

    Scenario: Unapplied-changes dialog - discard reverts the pending edit
        When I navigate to the "Discarding" page
        And I append "-discarded" to the inspector "title" field
        And I click outside the inspector to trigger the unapplied-changes overlay
        Then the unapplied-changes dialog should be visible
        When I discard the inspector changes from the unapplied-changes dialog
        Then the inspector "title" field should show "Discarding"

    Scenario: ClientEval updates dependent SelectBox options in the inspector
        When I open the content creation dialog for "NodeWithDependingProperties_Test"
        And I confirm the node creation dialog
        Then the inspector "dependingProperty" select should offer "label_1"
        And the inspector "dependingProperty" select should not offer "label_2"
        When I choose "even" in the inspector "propertyDependedOn" select
        And I wait for the inspector to recalculate
        Then the inspector "dependingProperty" select should offer "label_2"
        And the inspector "dependingProperty" select should not offer "label_1"
