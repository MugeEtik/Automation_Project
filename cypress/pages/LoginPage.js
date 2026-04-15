// cypress/pages/LoginPage.js

export class LoginPage {
    // 1. LOCATORS (Pusulalarımız)
    get loginPopupTrigger() { return cy.get('.user-menu-container > .login-button'); } // Örnektir, F12 ile doğrusunu bulacağız
    get emailField() { return cy.get('#email'); }
    get passwordField() { return cy.get('#password'); }
    get loginSubmitButton() { return cy.get('#login-button'); }

    // 2. ACTIONS (Gemideki manevralarımız)
    visit() {
        cy.visit('https://www.kitapsepeti.com');
    }

    login(email, password) {
        this.loginPopupTrigger.click();
        this.emailField.type(email);
        this.passwordField.type(password);
        this.loginSubmitButton.click();
    }
}