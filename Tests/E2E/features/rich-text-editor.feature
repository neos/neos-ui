Feature: Rich text editor

    The inspector RichTextEditor (mapped to the CKEditor inspector component) shows
    a "Toggle the editor" button that opens a secondary inspector with a full
    CKEditor instance. Edits committed via Apply are reflected on the rendered
    page in the content iframe.

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
        And I log in with username "admin" and password "password"

    Scenario: Editing an RTE property in the inspector updates the rendered page
        When I open the inspector CKEditor labelled "Toggle the editor"
        And I set the inspector CKEditor content to "Test RTE content"
        And I apply the inspector changes
        Then the rendered "test-page-rte" content element should contain "Test RTE content"
