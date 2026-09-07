import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

// Step definitions for the home page
const { Given, When, Then } = createBdd();

// Given steps for the home page
Given("I am on the home page", async ({ page }) => {
  await page.goto("/");
});

// When steps for the home page
When("I click the Get Started button", async ({ page }) => {
  await page.getByRole("button", { name: "Get Started" }).click();
});
// Then steps for the home page
Then("the login panel should be visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Login" }),
  ).toBeVisible();
});