import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

const userUsername = process.env.TEST_USER_USERNAME;
const userPassword = process.env.TEST_USER_PASSWORD;

if (!userUsername || !userPassword) {
  throw new Error("User test credentials are missing");
}

Given("I am logged out", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.removeItem("token");
  });

  await page.reload();
});

When("I navigate directly to the category overview", async ({ page }) => {
  await page.goto("/categories");
});

Then("I should be redirected to the home page", async ({ page }) => {
  await expect(page).toHaveURL("/");

  await expect(
    page.getByRole("button", {
      name: "Get started",
      exact: true,
    }),
  ).toBeVisible();
});

When("I log in with valid user credentials", async ({ page }) => {
  const loginPanel = page.getByRole("complementary");

  await loginPanel.getByLabel("Username", { exact: true }).fill(userUsername);

  await loginPanel.getByLabel("Password", { exact: true }).fill(userPassword);

  await loginPanel
    .getByRole("button", {
      name: "Login",
      exact: true,
    })
    .click();
});

When("I navigate directly to the admin page", async ({ page }) => {
  await page.goto("/admin");
});
