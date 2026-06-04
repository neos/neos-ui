Feature: Switch between sites via the main menu

    The Neos backend's main drawer lists all configured sites; clicking another site
    navigates to that site's hostname while keeping the user logged in.

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists

    Scenario: Switching from Neos.Test.OneDimension to Neos.Test.TwoDimensions and back
        When I log in to "onedimension.localhost" with username "admin" and password "password"
        And I navigate to the "Home" page
        And I switch to the site at "twodimensions.localhost" via the main menu
        Then the current URL host should be "twodimensions.localhost"
        When I navigate to the "Home" page
        And I switch to the site at "onedimension.localhost" via the main menu
        Then the current URL host should be "onedimension.localhost"

    Scenario: Switching from Neos.Test.TwoDimensions to Neos.Test.OneDimension and back
        When I log in to "twodimensions.localhost" with username "admin" and password "password"
        And I navigate to the "Home" page
        And I switch to the site at "onedimension.localhost" via the main menu
        Then the current URL host should be "onedimension.localhost"
        When I navigate to the "Home" page
        And I switch to the site at "twodimensions.localhost" via the main menu
        Then the current URL host should be "twodimensions.localhost"
