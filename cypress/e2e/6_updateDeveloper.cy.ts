describe('Add manager',  () => {
    const Data = require('../fixtures/data.json');
    const adminUser = Data["adminUser"];
    const newDeveloperName = 'newName';

    before(() => {
        cy.addCompany(Data.createCompany.company, Data.createCompany.admin);
        cy.clearLocalStorage()
        cy.userLogin(adminUser.email, adminUser.password);
    })
    it("Manager is able to update a Developer info", () => {
        cy.addDeveloper();
        cy.get('[data-testid="developer-item"]> .td-body > .d-flex.justify-content-end.p-1').first().children('[data-testid="edit-developer"]').click();
        cy.get('#DevelopersName').clear().type(newDeveloperName);
        cy.get('button[type="submit"]').contains('Save Changes').realClick();
        cy.getBySel('developer-item').children().should('contain', newDeveloperName)
    })
})