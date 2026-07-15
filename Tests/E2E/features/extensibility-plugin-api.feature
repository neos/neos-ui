Feature: Extensibility plugin API

    The Neos UI exposes a manifest-based plugin API that lets third-party packages
    inject behaviour and read configuration. The bundled test plugin
    (Neos.TestNodeTypes/Resources/Public/JavaScript/Plugin.js) writes its observations
    to `window.neosUiTestPlugin`, which we assert against here.

    Background:
        Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
        And I log in with username "admin" and password "password"

    Scenario: Test plugin loads and exposes UI internals correctly
        Then the test plugin manifest should have been invoked 1 time
        And the test plugin global registry access should report "global registry type object { get: function, set: function }"
        And the test plugin legacy global registry access should report "global registry type object { get: function, set: function }"
        And the test plugin's own registry should yield "some value from my registry"
        And the test plugin's own legacy registry should yield "some value from my legacy registry"
        And the test plugin configuration access should report "loadingDepth type number"
        And the test plugin legacy configuration access should report "loadingDepth type number"
        And the test plugin frontend configuration "testConfig" should expose "la li lu"
        And the test plugin legacy frontend configuration "testConfig" should expose "la li lu"
