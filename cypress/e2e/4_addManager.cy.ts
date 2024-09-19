describe('Add manager',  () => {
    const Data = require('../fixtures/data.json');
    const adminUser = Data["adminUser"];
    const addManager = require('../fixtures/locators.json')["addManager"]
    const manager = Data['manager1'];

    before(() => {
        cy.clearLocalStorage();
        cy.userLogin(adminUser.email, adminUser.password);
        cy.visit('/account/managers');
        // cy.pause();
        cy.log('window focus ()');
        cy.window().focus();
    })

    it('An admin manager is able to add another manager', () => {
        cy.getBySel(addManager.managersBtn).should('exist').realClick();
        cy.getBySel(addManager.managerItem).should('have.length', 1).and('contain.text', adminUser.email);
        cy.getBySel(addManager.addManagerBtn).should('exist').realClick();
        cy.getBySel(addManager.firstname).type(manager.firstName);
        cy.getBySel(addManager.lastname).type(manager.lastName);
        cy.getBySel(addManager.email).type(manager.email);
        cy.getBySel(addManager.position).type(manager.position);
        cy.getBySel(addManager.birth).should('exist').type(manager.birth);
        cy.getBySel(addManager.addNewManagerBtn).should('exist').realClick();
        // A manager has been added then the list of managers should have 2 managers
        cy.getBySel(addManager.managerItem).should('have.length', 2).and('contain.text', adminUser.email);
    });

    it('Added manager is able to verify their email', () => {
        cy.newManagerEmailVerification(manager.manager1EmailCredentials, manager.password)
    });

    it('Admin manager is able to delete another manager', () =>{
        cy.clearLocalStorage();
        cy.userLogin(adminUser.email, adminUser.password);
        cy.visit('/account/managers');
        cy.getBySel(addManager.managerItem).should('have.length', 2).and('contain.text', manager.email);
        cy.getBySel(addManager.deleteManagerItem).realClick();
        cy.get(addManager.removeBtn).contains('Remove').realClick();
        cy.getBySel(addManager.managerItem).should('have.length', 1).and('contain.text', adminUser.email);
    })
})