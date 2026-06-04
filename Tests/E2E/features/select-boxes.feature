Feature: SelectBox open-direction and visibility

    The open-direction is decided by `getCalculatedStyleFromProps` in
    packages/react-ui-components/src/DropDown/contents.tsx — it sets `top` when
    the dropdown opens below, `bottom` when it opens above, and `display: none`
    when the SelectBox is scrolled out of view. We assert the inline styles
    directly so the tests are independent of viewport pixel math.

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
        And I log in with username "admin" and password "password"

    Scenario: SelectBox opens below and breaks out of the creation dialog when there is space below
        When I click the "add new page" toolbar button
        And I select the "SelectBox opens below and breaks out" node type
        And I click the "selectBox" SelectBox in the node creation dialog
        Then the SelectBox options should open below

    Scenario: SelectBox opens above in the creation dialog when there is no space below, and hides when scrolled out of sight
        When I click the "add new page" toolbar button
        And I select the "SelectBox opens above" node type
        And I click the "selectBox" SelectBox in the node creation dialog
        Then the SelectBox options should open above
        When I hover over the "title" property label in the node creation dialog
        Then the SelectBox options should be hidden

    Scenario: SelectBox in the inspector opens above when there is no space below, and below after scrolling
        # Inspector layout:
        #   rows of properties to fill the inspector and force the selectBox beyond the fold
        #   selectBox to test the open direction of the dropdown
        #   more rows to fill space to allow the selectBox to open below
        When I navigate to the "SelectBox opens above in Inspector" page
        And I click the "selectBox" SelectBox in the inspector
        When I scroll the inspector so the Element with propertyId "selectBox" is at the bottom of the viewport
        Then the SelectBox options should open above
        And I scroll the inspector all the way to the bottom
        Then the SelectBox options should open below
        When I scroll the inspector all the way to the top
        Then the SelectBox options should be hidden
