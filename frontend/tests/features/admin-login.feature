Feature: Admin login

  Scenario: Admin logs in successfully
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview