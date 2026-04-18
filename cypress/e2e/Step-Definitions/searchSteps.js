import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import searchPage from "../../pages/SearchPage"; // SearchPage nesnesini import ediyoruz

// Background
Given("I am on the Kitapsepeti {string}", (pageName) => {
  // visit metodu LoginPage'deki gibi pop-up'ları (çerez/kampanya) otomatik yönetmelidir
  searchPage.visit(pageName); 
});

// TC06_Search-Success-Flow 
When("I enter {string} into the search bar", (keyword) => {
  searchPage.fillSearchInput(keyword);
});

When("I click the search button", () => {
  searchPage.submitSearch();
});

Then("I should be redirected to the {string} page", (path) => {
  cy.url().should('include', path);
});

Then("I should see products related to {string}", (keyword) => {
  searchPage.verifySearchResults(keyword);
});

Then("the search input field should be cleared", () => {
  searchPage.verifySearchInputCleared();
});

// TC07_Negative-Search-State
Then("I shouldn't see any products on the search results page", () => {
  searchPage.verifyNoProductCardsDisplayed();
});

// TC08_Product-Card-Interaction
When("I perform a search for a valid product", () => {
  searchPage.fillSearchInput("Kitap");
  searchPage.submitSearch();
});

Then("each product card should display {string}, {string}, {string} and {string}", (img, title, pub, price) => {
  searchPage.verifyProductCardIntegrity();
});

When("I hover over the product price area", () => {
  searchPage.hoverProductPrice();
});

Then("the {string} button should become visible and active", (buttonName) => {
  searchPage.verifyAddToCartButtonState(buttonName);
});

// TC09_Catalog-Management
When("I perform a search for {string}", (keyword) => {
  searchPage.fillSearchInput(keyword);
  searchPage.submitSearch();
});

When("I open the {string} menu", (menuName) => {
  searchPage.openSortingDropdown();
});

Then("I should see {string}, {string} and {string} options", (opt1, opt2, opt3) => {
  searchPage.verifySortingMenuOptions();
});

When("I apply filters for {string}, {string} and {string}", (cat, brand, model) => {
  searchPage.applyCategoryFilters();
});

Then("the product list should be updated according to the selected filters", () => {
  searchPage.verifyFilteredResults();
});

// TC10_Nav-and-Lazy-Loading
When("I click on a category from the top navigation on the homepage", () => {
  searchPage.clickHeaderCategory();
});

Then("the category name should match the header above the products", () => {
  searchPage.verifyHeaderMatchesCategory();
});

When("I scroll down to the bottom of the page", () => {
  cy.scrollTo('bottom');
});

Then("more products should be loaded automatically \\(Lazy Loading\\)", () => {
  searchPage.verifyLazyLoadingActive();
});