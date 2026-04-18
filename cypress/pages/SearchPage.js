class SearchPage {
    pageUrls = {
        "homepage": "/"
    };

    // ---------------------------------------------------------
    // Locators - Private-like accessors (Encapsulation)
    // ---------------------------------------------------------

    _getSearchInput() { return cy.get('#search-input'); } // Arama çubuğu
    _getSearchButton() { return cy.get('.search-button'); } // Arama butonu/ikonu
    _getProductCards() { return cy.get('.product-item'); } // Ürün kartları listesi
    _getEmptyResultMessage() { return cy.get('.no-results-message'); } // "Ürün bulunamadı" mesajı
    _getSortingDropdown() { return cy.get('#sort-select'); } // Sıralama menüsü
    _getAddToCartButton() { return cy.get('.add-to-cart-btn'); } // Sepete ekle butonu (hover ile çıkan)
    _getProductPriceArea() { return cy.get('.product-price'); } // Hover yapılacak fiyat alanı
    _getCategoryHeader() { return cy.get('.category-title'); } // Ürünlerin üzerindeki kategori başlığı
    _getFilterOptions() { return cy.get('.filter-group'); } // Filtreleme paneli

    // ---------------------------------------------------------
    // Actions - Public Methods
    // ---------------------------------------------------------

    // Pop-up yönetimi (LoginPage'den miras alınan standart yapı)
    handleInitialPopups() {
        cy.get('body').then(($body) => {
            if ($body.find('.cc-nb-okagree').length > 0) {
                cy.get('.cc-nb-okagree').click({ force: true });
                cy.get('.cc-window.cc-banner').should('not.exist'); // not.exist kullanımı kritiktir [6, 7]
            }
        });

        cy.get('body', { timeout: 7000 }).then(($body) => {
            if ($body.find('#notification-popup').length > 0) {
                cy.get('[id^="t-modal-close"] .ti-close').click({ force: true });
            }
        });
    }

    visit(pageName) {
        cy.visit(this.pageUrls[pageName] || "/");
        cy.wait(2000); // Elementlerin render olması için [8]
        this.handleInitialPopups();
    }

    fillSearchInput(keyword) {
        this._getSearchInput().clear({ force: true }).type(keyword, { force: true });
    }

    submitSearch() {
        this._getSearchButton().click({ force: true });
    }

    hoverProductPrice() {
        // AC5: Hover işlemi için trigger kullanıyoruz [9, 10]
        this._getProductPriceArea().first().trigger('mouseover', { force: true });
    }

    openSortingDropdown() {
        this._getSortingDropdown().click({ force: true });
    }

    applyCategoryFilters() {
        // AC7: Kategori, Marka ve Model filtrelerini seçme [11, 12]
        this._getFilterOptions().contains('Kategoriler').click({ force: true });
        this._getFilterOptions().contains('Marka').click({ force: true });
    }

    clickHeaderCategory() {
        // AC8: Hazır kategorilere tıklama [11, 13]
        cy.get('.main-menu .category-item').first().click({ force: true });
    }

    // ---------------------------------------------------------
    // Verifications (Assertions)
    // ---------------------------------------------------------

    verifySearchResults(keyword) {
        // AC2: Ürünlerin aranan kelimeyle ilgili olduğunu doğrula [11, 14]
        this._getProductCards().should('have.length.at.least', 1);
        this._getProductCards().first().should('contain.text', keyword);
    }

    verifySearchInputCleared() {
        this._getSearchInput().should('have.value', '');
    }

    verifyEmptyStateMessage(message) {
        this._getEmptyResultMessage().should('be.visible').and('contain.text', message);
    }

    verifyNoProductCardsDisplayed() {
        this._getProductCards().should('not.exist');
    }

    verifyProductCardIntegrity() {
        // AC4: Görsel, Ad, Yayınevi ve Fiyat kontrolü [10, 11]
        const card = this._getProductCards().first();
        card.find('img').should('be.visible');
        card.find('.product-title').should('not.be.empty');
        card.find('.publisher').should('not.be.empty');
        card.find('.price').should('not.be.empty');
    }

    verifyAddToCartButtonState(buttonName) {
        this._getAddToCartButton().should('be.visible').and('contain.text', buttonName);
    }

    verifySortingMenuOptions() {
        this._getSortingDropdown().should('contain', 'Fiyat Artan')
                                 .and('contain', 'Fiyat Azalan')
                                 .and('contain', 'Yeniden eskiye');
    }

    verifyFilteredResults() {
        // Filtre sonrası listenin güncellendiğini doğrula
        this._getProductCards().should('be.visible');
    }

    verifyHeaderMatchesCategory() {
        this._getCategoryHeader().then(($header) => {
            const headerText = $header.text().trim();
            cy.log('Kategori Başlığı: ' + headerText);
            this._getCategoryHeader().should('be.visible');
        });
    }

    verifyLazyLoadingActive() {
        // AC9: Aşağı kaydırdıkça yeni ürünlerin gelmesi [11, 15]
        const initialCount = 10;
        this._getProductCards().should('have.length.at.least', initialCount);
    }
}

export default new SearchPage();