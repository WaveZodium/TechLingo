import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();

When("I select an answer", async ({ page }) => {
  const answerGroup = page.getByRole("group", {
    name: "Choose an answer",
  });

  await answerGroup.getByRole("button").first().click();
});

Then("I should receive feedback on my answer", async ({ page }) => {
  await expect(page.getByText(/Correct!|Not quite\./).last()).toBeVisible();
});

When("I continue to the next question", async ({ page }) => {
  await page
    .getByRole("button", {
      name: /Next question/,
    })
    .click();
});

Then("the second quiz question should be displayed", async ({ page }) => {
  await expect(
    page.getByText("2 / 10", {
      exact: true,
    }),
  ).toBeVisible();
});

When("I answer all quiz questions", async ({ page }) => {
  for (let questionNumber = 1; questionNumber <= 10; questionNumber++) {
    const answerGroup = page.getByRole("group", {
      name: "Choose an answer",
    });

    await answerGroup.getByRole("button").first().click();

    await expect(page.getByText(/Correct!|Not quite\./).last()).toBeVisible();

    if (questionNumber < 10) {
      await page
        .getByRole("button", {
          name: /Next question/,
        })
        .click();

      await expect(
        page.getByText(`${questionNumber + 1} / 10`, {
          exact: true,
        }),
      ).toBeVisible();
    } else {
      await page
        .getByRole("button", {
          name: "Finish quiz",
          exact: true,
        })
        .click();
    }
  }
});

Then("I should see the quiz completion result", async ({ page }) => {
  const resultBubble = page
    .locator(".bubble--robot")
    .filter({
      hasText: "Quiz complete!",
    })
    .last();

  await expect(resultBubble).toBeVisible();
  await expect(resultBubble).toContainText("Quiz score:");
  await expect(resultBubble).toContainText("Total score:");
});

/*
 * Correct answer
 */

When("I answer a question correctly", async ({ page }) => {
  await page.route("**/Quiz/*/answer", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        isCorrect: true,
        points: 100,
        correctAnswer: "Mock correct answer",
        correctAnswerId: null,
        errorMessage: null,
      }),
    });
  });

  const answerGroup = page.getByRole("group", {
    name: "Choose an answer",
  });

  await answerGroup.getByRole("button").first().click();
});

Then("I should see correct answer feedback", async ({ page }) => {
  const feedback = page
    .locator(".bubble--robot")
    .filter({
      hasText: "Correct!",
    })
    .last();

  await expect(feedback).toBeVisible();
  await expect(feedback).toContainText("100");
  await expect(feedback).toContainText("points");
});

Then("my quiz score should be 100", async ({ page }) => {
  await expect(page.locator(".quiz-stat--score strong")).toHaveText("100");
});

/*
 * Incorrect answer
 */

When("I answer a question incorrectly", async ({ page }) => {
  await page.route("**/Quiz/*/answer", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        isCorrect: false,
        points: -200,
        correctAnswer: "Mock correct answer",
        correctAnswerId: null,
        errorMessage: "The selected answer is incorrect.",
      }),
    });
  });

  const answerGroup = page.getByRole("group", {
    name: "Choose an answer",
  });

  await answerGroup.getByRole("button").first().click();
});

Then("I should see incorrect answer feedback", async ({ page }) => {
  const feedback = page
    .locator(".bubble--robot")
    .filter({
      hasText: "Not quite.",
    })
    .last();

  await expect(feedback).toBeVisible();
  await expect(feedback).toContainText("Mock correct answer");
  await expect(feedback).toContainText("-200");
});

Then("my quiz score should be -200", async ({ page }) => {
  await expect(page.locator(".quiz-stat--score strong")).toHaveText("-200");
});

/*
 * Answer only once
 */

Then("all answer buttons should be disabled", async ({ page }) => {
  const answerGroup = page.getByRole("group", {
    name: "Choose an answer",
  });

  const answerButtons = answerGroup.getByRole("button");

  await expect(answerButtons).toHaveCount(4);

  for (let index = 0; index < 4; index++) {
    await expect(answerButtons.nth(index)).toBeDisabled();
  }
});

/*
 * Quit quiz
 */

When("I quit the quiz", async ({ page }) => {
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Are you sure you want to quit?");

    await dialog.accept();
  });

  await page
    .getByRole("button", {
      name: /Quit quiz/,
    })
    .click();
});

Then("I should return to the category overview", async ({ page }) => {
  await expect(page).toHaveURL(/\/categories/);
});
