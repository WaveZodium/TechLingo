import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

const leaderboardUsers = [
  { username: "Alice", totalScore: 500 },
  { username: "Bob", totalScore: 400 },
  { username: "Charlie", totalScore: 300 },
  { username: "David", totalScore: 200 },
  { username: "Eve", totalScore: 100 },
];

Given("the leaderboard contains five players", async ({ page }) => {
  await page.route("**/user/leaderboard", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(leaderboardUsers),
    });
  });
});

Given("the leaderboard request fails", async ({ page }) => {
  await page.route("**/user/leaderboard", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });
});

When("I open the leaderboard", async ({ page }) => {
  await page
    .getByRole("link", {
      name: "Leaderboard",
      exact: true,
    })
    .click();
});

Then("I should see the leaderboard page", async ({ page }) => {
  await expect(page).toHaveURL(/\/leaderboard$/);

  await expect(
    page.getByRole("heading", {
      name: "Leaderboard",
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByText("See who has earned the most points in TechLingo."),
  ).toBeVisible();
});

Then(
  "the five leaderboard players should be displayed in order",
  async ({ page }) => {
    const rows = page.locator(".leaderboard-row");

    await expect(rows).toHaveCount(5);

    for (let index = 0; index < leaderboardUsers.length; index++) {
      const row = rows.nth(index);
      const user = leaderboardUsers[index];

      await expect(row).toContainText(user.username);
      await expect(row).toContainText(user.totalScore.toString());
      await expect(row).toContainText("points");
    }
  },
);

Then("the top three players should have medals", async ({ page }) => {
  await expect(page.getByAltText("Position 1 medal")).toBeVisible();

  await expect(page.getByAltText("Position 2 medal")).toBeVisible();

  await expect(page.getByAltText("Position 3 medal")).toBeVisible();

  const rows = page.locator(".leaderboard-row");

  await expect(rows.nth(3)).toContainText("4");
  await expect(rows.nth(4)).toContainText("5");
});

Then("I should see a leaderboard error message", async ({ page }) => {
  await expect(page).toHaveURL(/\/leaderboard$/);

  await expect(
    page.getByText("Could not load leaderboard.", {
      exact: true,
    }),
  ).toBeVisible();
});
