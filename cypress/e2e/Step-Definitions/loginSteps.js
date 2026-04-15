// cypress/e2e/step_definitions/loginSteps.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import loginPage from "../../pages/LoginPage";

// Background
Given("I am on the Kitapsepeti {string}", (pageName) => {
    loginPage.visit(pageName);
});

// TC01_Login-Valid-Credentials
When("I click on the login icon in the header", () => {
    loginPage.openLoginPopup();
});

Then("the login modal should be displayed", () => {
    loginPage.verifyModal();
});

Then("I should see the email and password input fields", () => {
    loginPage.verifyInputFields();
});

Then("{string} checkbox and {string} link should be visible", (check, link) => {
    loginPage.verifyCheckboxAndLink(check, link);
});

Then("{string} and {string} buttons should be interactable", (btn1, btn2) => {
    loginPage.verifyInteractableElements();
});

// TC02_Login-Positive-Flow
When("I enter valid email and password", () => {
    loginPage.fillValidCredentials(); 
});

When("I click the {string} button", (buttonText) => {
    loginPage.submit();
});

Then("I should see the {string} icon in the header to confirm successful login", (iconName) => {
    loginPage.verifyLoggedIn();
});

// TC03_Login-Negative-Invalid-Data
When("I enter {string} and {string}", (email, password) => {
    loginPage.fillCredentials(email, password);
});

Then("I should see the error message {string}", (errorMessage) => {
    loginPage.verifyErrorMessage(errorMessage);
});

// TC04_Account-Lockout-Policy
When ("I perform 10 consecutive failed login attempts", () => {
   for (let i = 0; i < 10; i++) {
    loginPage.fillCredentials(`fail${i}@test.com`, "wrongpass");
    loginPage.submit();
  }
});

Then("I should see the message {string}", (lockoutMessage) => {
    loginPage.verifyLockoutState(lockoutMessage);
});

Then("the account should be locked for 30 minutes", () => {
    loginPage.verifyLockedAccount();
});

// TC05_Login-Forgot-Password
When("I click on the {string} link", (linkName) => {
    loginPage.clickLink(linkName);
});

Then("I should see the password recovery form", () => {
    loginPage.verifyPasswordRecoveryForm();
});

Then("the {string} CTA should be visible", (ctaText) => {
    loginPage.verifyCTAtext(ctaText);
});