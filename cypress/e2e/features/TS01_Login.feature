@US01 @TS01 @Authentication @Login 
Feature: US01 / TS01 - Login
  As a registered user
  I want to login to Kitapsepeti.com with my email and password
  So that I can access my profile and order history safely

  Background:
    Given I am on the Kitapsepeti "homepage"
    #homepage: kitapsepeti.com

  @TC01 @AC1 @AC2 @Smoke @Regression @UI 
  Scenario: TC01_Login-UI-Presence: Verify Login Popup UI and Functional Elements
  # State Verification: Validate that the login modal is successfully triggered via the avatar icon. 
  # Ensure all core authentication elements (Email/Password inputs, "Remember Me" checkbox, "Forgot Password" link, and Login/Register CTAs) are visible and interactable in the DOM.
    When I click on the login icon in the header
    # The login icon contains two separate links: "E-posta ile Giriş" and "Kayıt Ol". You need to click the "E-posta ile Giriş" link.
    Then the login modal should be displayed
    And I should see the email and password input fields
    And "Beni Hatırla" checkbox and "Şifremi Unuttum" link should be visible
    And "Giriş Yap" and "Kayıt Ol" buttons should be interactable

  @TC02 @AC3 @AC4 @Positive @Smoke @Regression @Critical 
  Scenario: TC02_Login-Positive-Flow: Successful Login with Valid Credentials
  # E2E Authentication & Redirection: Perform a successful login using valid credentials. 
  # Verify the system redirects the user to the kitapsepeti.com homepage and confirms the presence of "Hesabım" button functional elements in the header, indicating a successful login state.
    When I click on the login icon in the header
    And I enter valid email and password
    And I click the "Giriş Yap" button
    Then I should see the "Hesabım" icon in the header to confirm successful login
    # the url didnt change, it stayed on the homepage, but the "Hesabım" icon is visible in the header, which indicates that the user is logged in successfully.

  @TC03 @AC5 @AC6 @AC7 @Negative @Regression @Security
  Scenario Outline: TC03_Login-Negative-Invalid-Data: Input Validation with Invalid Data
  # Input Validation Resilience: Validate the application's error handling by injecting invalid email formats, incorrect passwords, and null values. 
  # Ensure the "Giriş bilgileriniz hatalı" warning message is consistently displayed for all clustered negative scenarios.
    When I click on the login icon in the header
    And I enter "<email>" and "<password>"
    And I click the "Giriş Yap" button
    Then I should see the error message "Giriş bilgileriniz hatalı"

    Examples:
      | email             | password     | errorMessage              |
      | wrong@test.com    | 123456       | Giriş bilgileriniz hatalı |
      | valid@test.com    | wrongpass    | Giriş bilgileriniz hatalı |
      | invalid_format    | 123456       | Giriş bilgileriniz hatalı |
      |                   |              | Giriş bilgileriniz hatalı |

  @TC04 @AC8 @Negative @Regression @Security @API @Ignore
  Scenario: TC04_Account-Lockout-Policy: Account Lockout after Multiple Failed Attempts
  # Security & Rate Limiting: Assert that the system triggers a 30-minute lockout and displays the message "Çok fazla istek talebinde bulundunuz" after 10 consecutive failed login attempts. 
  # (NOTE: Backend test required / Mocking)
    When I perform 10 consecutive failed login attempts
    Then I should see the message "Çok fazla istek talebinde bulundunuz"
    And the account should be locked for 30 minutes

  @TC05 @AC9 @Regression @Usability @UI
  Scenario: TC05_Login-Forgot-Password: Verify Forgot Password Redirection
  # Forgot Password UI and Workflow Redirection: Verify that clicking "Forgot Password" redirects to the reset page. 
  # Assert the visibility of the "Remind Password" (Şifremi Hatırlat) CTA and the corresponding Email input field.
    When I click on the login icon in the header
    And I click on the "Şifremi Unuttum" link
    Then I should see the password recovery form
    And the "Şifremi Hatırlat" CTA should be visible