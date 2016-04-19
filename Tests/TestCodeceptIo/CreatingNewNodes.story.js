
Feature('Creating new nodes');

Scenario('should open', (I) => {
    I.login();
    I.dontSeeElement('#neos__addNodeModal');
    // Focus the first node
    I.click('//*[@id="neos__leftSidebar__pageTree"]/div/div/div');
    I.click('#neos__leftSidebar__nodeTreeToolBar__addNode');
    I.see('Create new');
    I.seeElement('#neos__addNodeModal');
});

Scenario('should close on close button', (I) => {
    I.login();
    I.click('//*[@id="neos__leftSidebar__pageTree"]/div/div/div');
    I.click('#neos__leftSidebar__nodeTreeToolBar__addNode');
    I.click('#neos__modal__closeModal');
    I.dontSeeElement('#neos__addNodeModal');
});
Scenario('should close on cancel button', (I) => {
    I.login();
    I.click('//*[@id="neos__leftSidebar__pageTree"]/div/div/div');
    I.click('#neos__leftSidebar__nodeTreeToolBar__addNode');
    I.click('#neos__addNodeModal__cancel');
    I.dontSeeElement('#neos__addNodeModal');
});
// TODO: test actual node creation
Scenario('should close on nodetype click', (I) => {
    I.login();
    I.click('//*[@id="neos__leftSidebar__pageTree"]/div/div/div');
    I.click('#neos__leftSidebar__nodeTreeToolBar__addNode');
    I.click('//*[@id="neos__addNodeModal__grid"]/div/button');
    I.dontSeeElement('#neos__addNodeModal');
});
