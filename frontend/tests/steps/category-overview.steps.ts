import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();

When("I start a quiz", async ({ page }) => {
  await page.getByRole("link", { name: "Start quiz" }).first().click();
});

Then("I should be redirected to the quiz page", async ({ page }) => {
  await expect(page).toHaveURL(/\/quiz\/.+/);

  await expect(
    page.getByRole("group", { name: "Choose an answer" }),
  ).toBeVisible();
});