Feature: Leaderboard

  Scenario: Open the leaderboard
    Given I am on the home page
    When I open the login panel
    And I log in with valid user credentials
    Then I should be redirected to the category overview
    When I open the leaderboard
    Then I should see the leaderboard page

  Scenario: Display the top five players
    Given I am on the home page
    When I open the login panel
    And I log in with valid user credentials
    Then I should be redirected to the category overview
    Given the leaderboard contains five players
    When I open the leaderboard
    Then the five leaderboard players should be displayed in order
    And the top three players should have medals

  Scenario: Leaderboard fails to load
    Given I am on the home page
    When I open the login panel
    And I log in with valid user credentials
    Then I should be redirected to the category overview
    Given the leaderboard request fails
    When I open the leaderboard
    Then I should see a leaderboard error message