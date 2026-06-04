Feature: Image editor cropping

    The inspector's image editor has a crop tool that opens in the secondary
    inspector; dragging the crop area updates the small preview thumbnail in
    the property editor (via inline `top` on the cropArea image), and applying
    the change updates the rendered image in the content frame.

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
        And I log in with username "admin" and password "password"

    Scenario: Cropping the page image updates the inspector preview and the rendered content
        Given I capture the initial src of the rendered "test-page-image" content image
        And I capture the initial top offset of the inspector "image" preview thumbnail
        When I open the crop tool in the "image" inspector editor
        And I drag the crop area by 50,50 from offset 5,5
        Then no unapplied-changes dialog should appear when I click on the secondary inspector
        And the inspector "image" preview top offset should differ from the initial offset
        When I apply the inspector changes
        Then the rendered "test-page-image" content image src should differ from the initial src
