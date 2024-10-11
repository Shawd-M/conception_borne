let nameB = "Test_Cypress";
let password = "t+fD34$";


describe('Borne Tests', () => {
    it('Add borne', () => {

        cy.visit('http://localhost:3000/');
 
        cy.get('[data-cy="log"]')
        .click()

        cy.visit('http://localhost:3000/borne'); 

        cy.get('[data-cy="add-borne"]')
        .click()

        cy.get('[data-cy="name-borne"]')
        .first()
        .clear()
        .type(nameB);

        cy.get('[data-cy="password-borne"]')
        .clear()
        .type(password);
  
        cy.get('[data-cy="btn-borne"]')
        .click()
      
      });
  });