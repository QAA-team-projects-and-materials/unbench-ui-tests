describe('Add manager',  () => {
    const Data = require('../fixtures/data.json');
    const companyName = Data.createCompany.company.Company;
    it(`DELETE A COMPANY ${companyName}`, () => {
        cy.deleteCompany(companyName);
        Cypress.session.clearAllSavedSessions();
        cy.clearAllSessionStorage({log: true});
        cy.clearLocalStorage();





    })
})