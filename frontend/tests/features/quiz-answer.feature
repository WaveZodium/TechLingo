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

    Scenario: Receive correct answer feedback
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I start a quiz
    Then I should be redirected to the quiz page
    When I answer a question correctly
    Then I should see correct answer feedback
    And my quiz score should be 100

  Scenario: Receive incorrect answer feedback
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I start a quiz
    Then I should be redirected to the quiz page
    When I answer a question incorrectly
    Then I should see incorrect answer feedback
    And my quiz score should be -200

  Scenario: Cannot answer the same question twice
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I start a quiz
    Then I should be redirected to the quiz page
    When I select an answer
    Then all answer buttons should be disabled

  Scenario: Quit an active quiz
    Given I am on the home page
    When I open the login panel
    And I log in with valid admin credentials
    Then I should be redirected to the category overview
    When I start a quiz
    Then I should be redirected to the quiz page
    When I quit the quiz
    Then I should return to the category overview