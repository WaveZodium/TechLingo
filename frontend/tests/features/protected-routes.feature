Feature: Protected routes

  Scenario: Logged out user cannot access the category overview
    Given I am logged out
    When I navigate directly to the category overview
    Then I should be redirected to the home page