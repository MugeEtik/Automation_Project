class LoginPage {
    pageUrls = {
        "homepage": "/" // cypress.config.js içindeki baseUrl'e göre
    };
    
    // ---------------------------------------------------------
    // Locators - Private-like accessors (Encapsulation)
    // ---------------------------------------------------------
    _getLoginIcon() { return cy.get('.header-user-nav'); } // gerçek locator ile değiştirilmeli
    _getEmailInput() { return cy.get('#email'); }
    _getPasswordInput() { return cy.get('#password'); }
    _getLoginButton() { return cy.get('.btn-login'); }  // "GİRİŞ YAP" butonu
    _getErrorMessage() { return cy.get('.error-msg-box'); }  // "Giriş bilgileriniz hatalı." mesajı
    _getAccountIcon() { return cy.get('.user-account-icon'); }  // "Hesabım" ikonunu temsil eder (başarılı giriş sonrası görünür)
    _getModal() { return cy.get('.modal-content'); }
    _getBeniHatirla() { return cy.get('#rememberMe'); }  // "Beni Hatırla" checkbox'ı
    _getSifremiUnuttum() { return cy.get('.forgot-password-link'); }  // "Şifremi Unuttum" linki
    _getRegisterButton() { return cy.get('.register-link'); }  // "KAYIT OL" butonu
    _getlockoutMessage() { return cy.get('.lockout-msg'); }

    // ---------------------------------------------------------
    // Actions - Public Methods
    // ---------------------------------------------------------
    
    visit(pageName) {
        const urls = { "homepage": "/" };
        cy.visit(urls[pageName] || "/");
    }

    openLoginPopup() {
        this._getLoginIcon().trigger('mouseover');
        // E-posta ile giriş linkine odaklanma:
        cy.contains('E-posta ile Giriş').click(/*{ force: true }*/);
    }

    clickLink(linkName) {
        cy.contains(linkName).should('be.visible').click();
    }

    fillCredentials(email, password) {
        if (email) this._getEmailInput().clear().type(email);
        if (password) this._getPasswordInput().clear().type(password);
    }

    // Fixture üzerinden valid veriyi çekip dolduran "Senior" metod
    fillValidCredentials() {
        const email = Cypress.env('VALID_EMAIL');
        const password = Cypress.env('VALID_PASSWORD');
        this.fillCredentials(email, password);
    };

    submit() {
        this._getLoginButton().click();
    }

    // ---------------------------------------------------------
    // Verifications (Assertions)
    // ---------------------------------------------------------

    verifyModal() {
        this._getModal().should('be.visible');
    }

    verifyInputFields() {
        this._getEmailInput().should('be.visible');
        this._getPasswordInput().should('be.visible');
    }

    verifyCheckboxAndLink(check, link) {
        this._getBeniHatirla().should('be.visible');
        this._getSifremiUnuttum().should('be.visible');
    }

    verifyInteractableElements() {
        this._getLoginButton().should('be.visible').and('not.be.disabled');
        this._getRegisterButton().should('not.be.disabled');
    }

    verifyLoggedIn() {
        this._getAccountIcon().should('be.visible');
    }

    verifyErrorMessage(errorMessage) {
        this._getErrorMessage().should('be.visible').and('contain', errorMessage);
    }

    verifyLockoutState(lockoutMessage) {
        this._getlockoutMessage().should('be.visible').and('contain', lockoutMessage);
    }

    verifyLockedAccount(lockedAccount) {
        // Bu metod, lockout durumunu doğrulamak için backend API'sine istek atabilir veya UI'da belirli bir elementin görünürlüğünü kontrol edebilir.
        // Örneğin, lockout durumunu doğrulamak için API çağrısı yapabiliriz:
        cy.request({
            method: 'POST',
            url: '/api/login', // Real API endpoint
            body: {
                email: lockedAccount.email,
                password: lockedAccount.password
            }
        }).then((response) => {
            // Lockout confirmation.
            expect(response.status).to.eq(401); // example: 401 Unauthorized
        });
    }

    verifyPasswordRecoveryForm() {
        // "Şifremi Unuttum" linkine tıklandığında açılan formun doğrulanması
        cy.url().should('include', '/uye-sifre-hatirlat'); // URL verification
    }

    verifyCTAtext(ctaText) {
        cy.contains(ctaText).should('be.visible');
    }
}

// Instance olarak export ederek step_definitions'da direkt kullanımı sağlıyoruz.
export default new LoginPage();