describe('Add manager',  () => {
    const Data = require('../fixtures/data.json');
    const adminUser = Data["adminUser"];

    before(() => {
        cy.addCompany(Data.createCompany.company, Data.createCompany.admin);
        cy.clearLocalStorage();
        cy.userLogin(adminUser.email, adminUser.password);
    })
    it("Manager is able to add a Developer", () => {
        cy.addDeveloper();
    })

})