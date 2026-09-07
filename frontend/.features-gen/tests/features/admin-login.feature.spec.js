// Generated from: tests\features\admin-login.feature
import { test } from "playwright-bdd";

test.describe('Admin login', () => {

  test('Admin logs in successfully', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the home page', null, { page }); 
    await When('I open the login panel', null, { page }); 
    await And('I log in with valid admin credentials', null, { page }); 
    await Then('I should be redirected to the category overview', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\admin-login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the home page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I open the login panel","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And I log in with valid admin credentials","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected to the category overview","stepMatchArguments":[]}]},
]; // bdd-data-end