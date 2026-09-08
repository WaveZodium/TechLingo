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

  await loginPanel.getByLabel("Username", { exact: true }).fill(adminUsername);

  await loginPanel.getByLabel("Password", { exact: true }).fill(adminPassword);

  await loginPanel.getByRole("button", { name: "Login", exact: true }).click();
});

Then("I should be redirected to the category overview", async ({ page }) => {
  await expect(page).toHaveURL(/\/categories/);
});

When("I log in with invalid credentials", async ({ page }) => {
  const loginPanel = page.getByRole("complementary");

  await loginPanel
    .getByLabel("Username", { exact: true })
    .fill(`invalid-user-${Date.now()}`);

  await loginPanel
    .getByLabel("Password", { exact: true })
    .fill("wrong-password");

  await loginPanel.getByRole("button", { name: "Login", exact: true }).click();
});

Then("I should see an invalid login message", async ({ page }) => {
  const loginPanel = page.getByRole("complementary");

  await expect(
    loginPanel.getByText("Felaktigt användarnamn eller lösenord.", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(page).not.toHaveURL(/\/categories/);
});

When("I log out", async ({ page }) => {
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Logout", exact: true })
    .click();
});

Then("I should be logged out", async ({ page }) => {
  const navbar = page.getByRole("banner");

  await expect(page).toHaveURL("/");

  await expect(
    navbar.getByRole("button", { name: "Login", exact: true }),
  ).toBeVisible();

  await expect(
    navbar.getByRole("link", { name: "Categories", exact: true }),
  ).toHaveCount(0);
});
