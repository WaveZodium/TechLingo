Feature: Category overview

  Scenario: Start a quiz from the category overview
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I start a quiz
    Then I should be redirected to the quiz page