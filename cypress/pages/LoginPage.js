class LoginPage {
    pageUrls = {
        "homepage": "/" // cypress.config.js içindeki baseUrl'e göre
    };
    
    // ---------------------------------------------------------
    // Locators - Private-like accessors (Encapsulation)
    // ---------------------------------------------------------
        // E-posta ile giriş linki, hover menüdeki "E-posta ile Giriş" seçeneği
    _getLoginIcon() { return cy.get('#hm-links > div > div.col-auto.bg-primary.border-round > div > span > a'); }
        // Giriş Yap / Kayıt Ol pop-up'ının başlığı (modal title = Hesabım) - doğrulama için kullanılır
    _getModal() { return cy.get('#header-member-panel-322 > div.drawer-header > div.drawer-title > span'); }
        // Giriş formundaki e-posta ve şifre inputları, giriş butonu, kayıt ol butonu, "Beni Hatırla" checkbox'ı ve "Şifremi Unuttum" linki
    _getEmailInput() { return cy.get('#header-email'); } 
    _getPasswordInput() { return cy.get('#header-password'); }
    _getLoginButton() { return cy.get('#login-btn-322').contains('Giriş Yap'); }  // "GİRİŞ YAP" butonu
    _getRegisterButton() { return cy.get('#register-btn-322').contains('Kayıt Ol'); }  // "KAYIT OL" butonu
    _getBeniHatirla() { return cy.get('#header-member-panel-322 > div.drawer-body > form > div.w-100.d-flex.flex-wrap.justify-content-between.header-remember > label').should('contain', 'Beni Hatırla'); }  // "Beni Hatırla" checkbox'ı
    _getSifremiUnuttum() { return cy.get('#header-member-panel-322 > div.drawer-body > form > div.w-100.d-flex.flex-wrap.justify-content-between.header-remember > a').should('contain', 'Şifremi Unuttum'); }  // "Şifremi Unuttum" linki
        // Başarılı giriş sonrası sağ üstte görünen "Hesabım" ikonunu temsil eder, bu ikonun görünürlüğü başarılı girişin göstergesidir.
    _getAccountIcon() { return cy.get('#header-account > i'); }   
        // Giriş hatası durumunda görünen hata mesajı kutusu : "Giriş bilgileriniz hatalı." mesajı > locator alamıyorum, çünkü mesaja tıklamaya çalışınca mesaj kayboluyor, bu yüzden genel bir class ile yakalıyorum. İçerik doğrulaması yaparak doğru mesajı kontrol edeceğiz.
    _getErrorMessage() { return cy.get('#header-login').should('contain', 'Giriş bilgileriniz hatalı.'); } // *****Çözemiyorum.
        // Hesap kilitlenme durumunda görünen mesaj kutusu
    _getlockoutMessage() { return cy.get('.lockout-msg'); }
    _getAnnouncementModal() { return cy.get('#notification-popup'); }
        // Kampanya pop-up'ının kapatma butonu: ID'si dinamik olabilir, genellikle T.modal kütüphanesi kullanılır ve ID'si "t-modal-close" ile başlar. Bu yüzden CSS selector'ünde "id^=" kullanarak bu yapıyı hedefliyoruz:
        // id^="t-modal-close" ifadesi, ID'si bu metinle başlayan butonu bulur (ID değişse de yakalar): Genellikle T.modal kütüphanesi kapatma butonu için bunu kullanır:
    _getAnnouncementCloseBtn() { return cy.get('[id^="t-modal-close"] .ti-close'); }  // #t-modal-close-1 > i
        // Çerez politikası pop-up'ının kabul butonu ve perde (overlay) elementleri
    _getCookieAcceptBtn() { return cy.get('.cc-nb-okagree'); }  // Çerez politikası "Tümünü Kabul Et" butonu
    _getCookieOverlay() { return cy.get('.cc-window.cc-banner'); }  // Çerez politikası perde (overlay) elementi

    // ---------------------------------------------------------
    // Actions - Public Methods
    // ---------------------------------------------------------
    
    // --- Kitapsepeti Özel: Pop-up Kapatıcı ---
    handleInitialPopups() {
        // 1. Çerez Politikası (Genelde en altta veya ortada)
        // 'should' kullanarak elementin gelmesini Cypress'in beklemesini sağlıyoruz.
        // Ama pop-up gelmezse test fail etmesin diye 'body' üzerinden sızıyoruz.
        cy.get('body').then(($body) => {
            // Çerez butonu için (Örn selector: .cc-btn.cc-allow veya #cookie-accept-button)
            if ($body.find('.cc-nb-okagree').length > 0) {
                this._getCookieAcceptBtn().click({ force: true });
                // KRİTİK HAMLE: Perdenin (overlay) yok olmasını bekle!
                // Bu 'should', perde kalkana kadar testi durdurur, kalkınca devam eder.
                this._getCookieOverlay().should('not.exist');
                cy.log('Cookies accepted.');
            }
        });

        // 2. Kampanya/Duyuru Pop-up'ı: Dinamik Bekleme (7sn)
        // Burada 'if' kontrolü yerine Cypress'in kendi 'retry' mekanizmasını 
        // ama testi kırmayan bir 'timeout' ile kullanıyoruz.
        
        // Önemli: Eğer pop-up'ın gelmeme ihtimali varsa, testi durdurmaması için
        // 'body' üzerinden sızmaya devam ediyoruz ama bu kez 'timeout' ile.
        cy.get('body', { timeout: 7000 }).then(($body) => {
            if ($body.find('#notification-popup').length > 0) {
                this._getAnnouncementCloseBtn().click({ force: true });
                cy.log('Kampanya pop-up mühürlendi!');
            } else {
                cy.log('Kampanya pop-up bu kez görünmedi, devam ediyoruz.');
            }
        });
    }

    visit(pageName) {
        const urls = { "homepage": "/" };
        cy.visit(urls[pageName] || "/");
        
        // ÖNEMLİ: Sayfa yüklendikten sonra pop-up'ların render olması için küçük bir bekleme ekleyelim. Bu, pop-up'ların gelmesini beklemek ve testlerin stabil çalışmasını sağlamak için.
        // cy.pause()  kullanarak manuel kontrol de yapabilirsiniz. -> debugging için kullanışlı olabilir.
        cy.wait(2000); // 1 saniye bekleme, pop-up'ların gelmesi için yeterli olabilir. (Gerekirse artırılabilir)
        this.handleInitialPopups();
    }

    openLoginPopup() {
        this._getLoginIcon().trigger('mouseover', { force: true }); // Hover ile açılan menü için mouseover kullanıyoruz, force ile zorlayarak tıklama yapıyoruz.
        // E-posta ile giriş linkine odaklanma:
        cy.contains('E-posta ile Giriş', { timeout: 10000 }).should('be.visible').click({ force: true });
    }

    fillCredentials(email, password) {
        if (email) this._getEmailInput().clear({ force: true }).type(email, { force: true });  // Görünürlük hatasını aşarak clear ve type işlemi yapıyoruz, force ile zorlayarak tıklama yapıyoruz.
        if (password) this._getPasswordInput().clear({ force: true }).type(password, { force: true });
    }

    // Fixture üzerinden valid veriyi çekip dolduran "Senior" metod
    fillValidCredentials() {
        const email = cy.env('VALID_EMAIL');
        const password = cy.env('VALID_PASSWORD');
        this.fillCredentials(email, password);
    }

    submit() {
        this._getLoginButton().click({ force: true });
    }

    // ---------------------------------------------------------
    // Verifications (Assertions)
    // ---------------------------------------------------------

    verifyModal() {
        this._getModal().should('be.visible');
    }

    verifyInputFields() {
        this._getEmailInput().should('be.visible').and('have.attr', 'placeholder', 'E-posta adresinizi giriniz');
        this._getPasswordInput().should('be.visible').and('have.attr', 'placeholder', 'Şifrenizi giriniz');
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
        cy.intercept('POST', '/api/login', {
            statusCode: 429, // Too Many Requests
            body: { message: "Çok fazla istek talebinde bulundunuz. Lütfen 30 dakika sonra tekrar deneyin." }
        }).as('lockoutResponse');
    }

    clickLink(linkName) {
        cy.contains(linkName).should('be.visible').click();
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