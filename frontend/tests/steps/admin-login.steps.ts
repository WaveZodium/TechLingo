import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();

const adminUsername = process.env.TEST_ADMIN_USERNAME;
const adminPassword = process.env.TEST_ADMIN_PASSWORD;

if (!adminUsername || !adminPassword) {
  throw new Error("Admin test credentials are missing");
}

When("I open the login panel", async ({ page }) => {
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Login", exact: true })
    .click();
});

When("I log in with valid admin credentials", async ({ page }) => {
  const loginPanel = page.getByRole("complementary");

  await loginPanel
    .getByLabel("Username", { exact: true })
    .fill(adminUsername);

  await loginPanel
    .getByLabel("Password", { exact: true })
    .fill(adminPassword);

  await loginPanel
    .getByRole("button", { name: "Login", exact: true })
    .click();
});

Then("I should be redirected to the category overview", async ({ page }) => {
  await expect(page).toHaveURL(/\/categories/);
});
