@US02 @TS02 @Search @Listing
Feature: US02 / TS02 - Search&Listing
  As a user
  I want to easily find products on the site and filter/sort the results
  So that I can quickly reach the product I want to buy

  Background:
    Given I am on the Kitapsepeti "homepage" as a logged-in user

  @TC06 @AC1 @AC2 @Positive @Smoke @Regression
  Scenario: TC06_Search-Success-Flow: Search Execution and UI Reset
  # Execute a search query with a minimum of 1 character. 
  # Validate successful redirection to the /arama page and confirm that the search input field is cleared [2].
    When I enter "Roman" into the search bar
    And I click the search button
    Then I should be redirected to the "/arama" page
    And I should see products related to "Roman"
    And the search input field should be cleared

  @TC07 @AC3 @Negative @Regression
  Scenario: TC07_Negative-Search-State: Zero-Result Handling
  # Execute a search with non-existent keywords (e.g., "asdfqwert"). 
  # Assert that the UI correctly displays the "Empty State" with no product cards available.
    When I enter "asdfqwert" into the search bar
    And I click the search button
    Then I shouldn't see any products on the search results page

  @TC08 @AC4 @AC5 @UI @Regression
  Scenario: TC08_Product-Card-Interaction: Visual Integrity and Hover States
  # Verify the integrity of product cards (Image, Title, Publisher, Price). 
  # Assert that the "Add to Cart" button becomes visible only upon hovering over the price area.
    When I perform a search for a valid product
    Then each product card should display "Ürün Görseli", "Ürün Adı", "Yayınevi" and "Fiyat"
    When I hover over the product price area
    Then the "Sepete Ekle" button should become visible and active

  @TC09 @AC6 @AC7 @Functional @Regression
  Scenario: TC09_Catalog-Management: Sorting and Filtering Logic
  # Validate sorting menu options and functional filtering accuracy.
    When I perform a search for "Kitap"
    And I open the "Sıralama" menu
    Then I should see "Fiyat Artan", "Fiyat Azalan" and "Yeniden eskiye" options
    When I apply filters for "Kategoriler", "Marka" and "Model" [1]
    Then the product list should be updated according to the selected filters

  @TC10 @AC8 @AC9 @Usability @Regression
  Scenario: TC10_Nav-and-Lazy-Loading: Category Navigation
  # Verify header category navigation and infinite scroll logic.
    When I click on a category from the top navigation on the homepage
    Then the category name should match the header above the products
    When I scroll down to the bottom of the page
    Then more products should be loaded automatically (Lazy Loading) 