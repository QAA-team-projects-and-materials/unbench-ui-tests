describe('Add manager',  () => {
    const Data = require('../fixtures/data.json');
    const addDeveloper = require('../fixtures/locators.json')["addDeveloper"];
    const adminUser = Data["adminUser"];
    const developer = Data["developerA"]

    before(() => {
        cy.addCompany(Data.createCompany.company, Data.createCompany.admin);
        cy.clearLocalStorage();
        cy.userLogin(adminUser.email, adminUser.password);
    })

    it("Manager is able to delete a Developer", () => {
        cy.visit('/account/developers');
        cy.getBySel(addDeveloper.developerItem).contains(developer.name).should('exist').getBySel(addDeveloper.deleteDeveloperBtn).children().realClick();
        cy.get(addDeveloper.removeBtn).contains('Remove').should('exist').realClick()
        cy.get(addDeveloper.developerItem).should('not.exist');
    })
})