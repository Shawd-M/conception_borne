let cn_plat="plat"

let nom_plat = "Cevapi";
let prix_plat = "7.90";
let desc_plat = "Plat typique croate";

const file_ilg = "/Users/joseph_d/Desktop/gpe/cypress/downloads/cevapi.jpeg"

beforeEach('Menu Tests', () => {

        cy.visit('http://localhost:3000/')
        cy.wait(500)
 
        cy.get('[data-cy="log"]')
        .click()

        cy.wait(500)
        cy.visit('http://localhost:3000/menu')

    })
      
describe('Menu Test',  () => {
    // it('Gestion', () => {
    //     cy.contains("Gestion")        
    //     .click()

    //     // cy.get('[data-cy="categorie-name"]')
    //     // cy.get('#input-88')
    //   })

    // it('Ajout catégorie plat', () => {
    //     cy.get('.d-flex > :nth-child(3)')        
    //     .click()

    //     //cy.get('[data-cy="categorie-name"]')
    //     cy.contains('Nom')
    //     .click({force: true})
    //     .type(cn_plat)

    //     cy.contains('Icônes')
    //     //cy.get('menu-icon')
    //     .click({force: true})
        
    //     cy.get('#list-item-225-1 > .v-icon')
    //     .click()

    //     cy.get('.mt-0 > .v-btn > .v-btn__content')
    //     //.click()
    // });

    it('Ajout catégorie ingrédient', () => {

        cy.get('.d-flex > :nth-child(3)')        
        .click()

        cy.contains("Ingredients")        
        .click()

        //cy.get('[data-cy="categorie-name"]')
        cy.contains('Nom')
        // cy.get('#input-104')
        .click({force: true})
        .type(cn_plat)

        cy.get('.v-window-item--active > :nth-child(1) > :nth-child(3) > .align-center > .col-3 > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon')        //cy.get('menu-icon')
        .click({force: true})
        
        cy.get('#list-item-115-2 > .v-icon')        
        .click()

        cy.get('.mt-0 > .v-btn > .v-btn__content')
        .click()

    })
    

    // it('Ajouter un plat', () => {
    //     cy.contains("Ajouter un plat")
    //     .click({force: true})

    //     cy.contains("Nom")
    //     .click({force: true})
    //     .type(nom_plat)

    //     cy.contains("Prix")
    //     .click({force: true})
    //     .type(prix_plat)

    //     cy.contains("Description")
    //     .click({force: true})
    //     .type(desc_plat)

    //     cy.contains("Catégorie")
    //     .click({force: true})
    //     cy.get(".v-select__selections")
    //     cy.contains('test')        
    //     .click()

    //     cy.get('input[type=file]')
    //     .selectFile(file_ilg, {force: true})

    //     cy.get(':nth-child(4) > .v-btn__content')
    //     .click({force: true})

    // })

})


