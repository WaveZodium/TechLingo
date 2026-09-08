Feature: Quiz

  Scenario: Answer a quiz question
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I start a quiz
    Then I should be redirected to the quiz page
    When I select an answer
    Then I should receive feedback on my answer

  Scenario: Continue to the next quiz question
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I start a quiz
    Then I should be redirected to the quiz page
    When I select an answer
    Then I should receive feedback on my answer
    When I continue to the next question
    Then the second quiz question should be displayed

  Scenario: Complete a full quiz
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I start a quiz
    Then I should be redirected to the quiz page
    When I answer all quiz questions
    Then I should see the quiz completion result