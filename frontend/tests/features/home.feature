Feature: Home page

  Scenario: Open login panel from the home page
    Given I am on the home page
    When I click the Get Started button
    Then the login panel should be visible