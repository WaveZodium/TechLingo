// Generated from: tests\features\home.feature
import { test } from "playwright-bdd";

test.describe('Home page', () => {

  test('Open login panel from the home page', async ({ Given, When, Then, page }) => { 
    await Given('I am on the home page', null, { page }); 
    await When('I click the Get Started button', null, { page }); 
    await Then('the login panel should be visible', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\home.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the home page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I click the Get Started button","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then the login panel should be visible","stepMatchArguments":[]}]},
]; // bdd-data-end