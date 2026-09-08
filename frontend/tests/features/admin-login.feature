Feature: Admin login

  Scenario: Admin logs in successfully
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview

  Scenario: Login fails with invalid credentials
    Given I am on the home page
    When I open the login panel
    And I log in with invalid credentials
    Then I should see an invalid login message

  Scenario: Admin logs out successfully
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I log out
    Then I should be logged out