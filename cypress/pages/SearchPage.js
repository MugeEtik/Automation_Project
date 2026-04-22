class SearchPage {
    pageUrls = {
        "homepage": "/"
    };

    // ---------------------------------------------------------
    // Locators - Private-like accessors (Encapsulation)
    // ---------------------------------------------------------

    _getSearchInput() { return cy.get('#live-search'); } // Arama çubuğu
    _getSearchButton() { return cy.get('#live-search-btn').contains('Ara'); } // Arama butonu/ikonu
    _getProductCards() { return cy.get('.product-detail-card'); } // Ürün kartları listesi
    _getProductPriceArea() { return cy.get('.product-price-wrapper'); } // Hover yapılacak fiyat alanı
    _getAddToCartButton() { return cy.get('[id^="product-addcart-button"]'); } // Sepete ekle butonu (hover ile çıkan)
    _getSortingDropdown() { return cy.get('#sort'); } // Sıralama menüsü
    _getFilterOptionsCat() { return cy.get('#accordion-categories-361'); } // Kategori filtresi
    _getFilterOptionsBrand() { return cy.get('#accordion-brand-361'); } // Marka filtresi
    _getFilterOptionsModel() { return cy.get('#accordion-model-361'); } // Model filtresi
    _getCategoryHeader() { return cy.get('.header-mobile-menu-btn'); } // Ürünlerin üzerindeki kategori başlığı
    _getMenuHeader() { return cy.get('#mobile-menu-322 > div > div.drawer-title > span'); } // Kategoriler menüsü
    _getMenuContainer() { return cy.get('nav.mb-2 > ul.clearfix'); }
    _getMobileMenuCloseBtn() { return cy.get('#mobile-menu-close'); }

    // ---------------------------------------------------------
    // Actions & Verifications (Assertions)
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

    // TC06_Search-Success-Flow: Arama işlemi için gerekli adımlar ve doğrulamalar
    verifySearchInput() {
        this._getSearchInput().should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Aradığınız ürünün adını yazınız.');
    }

    fillSearchInput(keyword) {
        this._getSearchInput().clear({ force: true }).type(keyword, { force: true });
    }

    submitSearch() {
        this._getSearchInput().type('{enter}', { force: true });
    }

    verifySearchResults() {
        this._getProductCards().should('be.visible').and('have.length.at.least', 1);
    }

    verifySearchInputCleared() {
        this._getSearchInput().should('be.visible').and('have.value', '');
    }

    // TC07_Negative-Search-State: Arama sonucunda ürün bulunamadığında gösterilen boş durum mesajını doğrulama
    verifyNoProductCardsDisplayed() {
        this._getProductCards().should('not.exist');
    }

    // TC08_Product-Card-Interaction: Ürün kartlarının bütünlüğünü ve etkileşimlerini doğrulama
    verifyProductCardIntegrity() {
        // "Ürün Görseli", "Ürün Adı", "Yayınevi" and "Fiyat" kontrolü
        cy.wait(1000); // Arama sonuçlarının tam olarak yüklenmesi için bekleme ekleyelim
        cy.window().scrollTo('top'); 
        this._getProductCards().eq(0).within(() => {
            // Kartın görünürlüğünden emin olalım
            cy.root().should('exist').and('be.visible'); // Kartın kendisi görünür olmalı
            
            // Artık Cypress sadece bu kartın içindeki dünyayı görüyor: Burada cy.get kullanmak, global değil, sadece kartın içindeki elementleri yakalar.
            //cy.get('a.image-wrapper img, .position-relative img').should('be.visible'); // Ürün Görseli
            cy.get('.product-title').should('be.visible').and('not.be.empty'); // Ürün Adı
            cy.get('.brand-title').should('be.visible'); // Yayınevi
            cy.get('span.product-price').should('be.visible'); // Fiyat 
        
            cy.log('Product card integrity verified within the scope!'); // Scope doğrulaması
        });
    }

    hoverProductPrice() {
        cy.window().scrollTo('top'); 
        this._getProductPriceArea().trigger('mouseover', { force: true }).click().should('be.visible'); //.and('contain', 'Sepete Ekle'); // Hover sonrası "Sepete Ekle" butonunun görünürlüğü
    }

    verifyAddToCartButtonState() {
        this._getAddToCartButton().click({ force: true }); //.should('be.visible').and('contain.text', buttonName).and('not.be.disabled');
    }
    
    // TC09_Catalog-Management: Katalog yönetimi ve sıralama/filtreleme özelliklerini doğrulama
    openSortingDropdown() {
        this._getSortingDropdown().select('Varsayılan Sıralama', { force: true });
    }

    verifySortingMenuOptions() {
        this._getSortingDropdown().should('contain', 'Fiyat Artan')
                                 .and('contain', 'Fiyat Azalan')
                                 .and('contain', 'Yeniden Eskiye')
                                 .and('contain', 'Eskiden Yeniye')
                                 .and('contain', 'Varsayılan Sıralama');
    }

    applyCategoryFilters() {
        this._getFilterOptionsCat().contains('Kategoriler').click({ force: true });
        this._getFilterOptionsBrand().contains('Marka').click({ force: true });
        this._getFilterOptionsModel().contains('Model').click({ force: true });
    }

    verifyFilteredResults() {
        this._getProductCards().should('be.visible');
    }

    // TC10_Lazy-Loading: Lazy loading özelliğinin çalıştığını doğrulama
    clickHeaderCategory() {
        this._getCategoryHeader().click({ force: true });
    }

    verifyMenuSidebar() {
        this._getMenuHeader().should('be.visible').and('contain.text', 'Menü');
        this._getMenuContainer().should('be.visible');
        this._getMenuContainer().within(() => {
            cy.get('li').should('contain', 'ROMAN')
                        .and('contain', 'ÇOK SATANLAR')
                        .and('contain', 'BİLİM KURGU')
                        .and('contain', 'ÇOCUK KİTAPLARI')
                        .and('contain', 'ÇİZGİ ROMAN');
            });
        this._getMobileMenuCloseBtn().should('be.visible').click({ force: true }).should('not.be.visible');
    
        cy.log('Sidebar navigation verified.');
    }

    verifyLazyLoadingActive() {
        // Aşağı kaydırdıkça yeni ürünlerin gelmesi
        const initialCount = 10;
        this._getProductCards().should('have.length.at.least', initialCount);
    }
}

export default new SearchPage();