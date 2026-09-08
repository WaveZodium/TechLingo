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
  await expect(page.getByText(/Correct!|Not quite\./)).toBeVisible();
});

When("I continue to the next question", async ({ page }) => {
  await page
    .getByRole("button", {
      name: "Next question",
      exact: true,
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

    await expect(page.getByText(/Correct!|Not quite\./)).toBeVisible();

    if (questionNumber < 10) {
      await page
        .getByRole("button", {
          name: "Next question",
          exact: true,
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
  await expect(
    page.getByText("Quiz complete!", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(page.getByText(/Quiz score:/)).toBeVisible();

  await expect(page.getByText(/Total score:/)).toBeVisible();
});
