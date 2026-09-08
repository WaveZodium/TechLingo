Feature: Protected routes

  Scenario: Logged out user cannot access the category overview
    Given I am logged out
    When I navigate directly to the category overview
    Then I should be redirected to the home page

  Scenario: Regular user cannot access the admin page
    Given I am on the home page
    When I open the login panel
    And I log in with valid user credentials
    Then I should be redirected to the category overview
    When I navigate directly to the admin page
    Then I should be redirected to the home page