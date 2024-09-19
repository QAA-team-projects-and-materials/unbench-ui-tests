describe('Sign Up page',  () => {
    const Data = require('../fixtures/data.json');
    const companyName = Data.createCompany.company.Company
    const signUp = require('../fixtures/locators.json')["signUpPage"];
    const emailVerification = require('../fixtures/locators.json')["emailVerification"];
    after(() => {
        cy.deleteCompany(companyName)
    })
    it('Verifies elements on the first step', () => {
        cy.visit('/signup')
        cy.get(signUp.signUpHeading).should('exist').children(signUp.signUpFormTitle).should('contain.text', 'Sign up')
            .parent().children(signUp.loginPrompt).should('exist').and('have.text', 'Already a member?Log in')
        cy.get(signUp.logInLink).should('exist')

        cy.getBySel(signUp.firstName).should('exist').and('have.attr', 'type', 'text')
            .parent().children().contains('First name').should('exist')

        cy.getBySel(signUp.lastName).should('exist').and('have.attr', 'type', 'text')
            .parent().children().contains('Last name').should('exist')

        cy.getBySel(signUp.email).should('exist').and('have.attr', 'type', 'email')
            .parent().children().contains('Email').should('exist')

        cy.getBySel(signUp.password).should('exist').and('have.attr', 'type', 'password')
            .parent().children().contains('Password').should('exist')

        cy.getBySel(signUp.position).should('exist').and('have.attr', 'type', 'text')
            .parent().children().contains('Position').should('exist')

        cy.getBySel(signUp.birth).should('exist').and('have.attr', 'type', 'date')
            .parent().children().contains('Date of Birth (optional)').should('exist')

        cy.get(signUp.nextStepButton1).should('exist')
            .and('have.text', 'Next step (2/3)').and('be.visible')

        cy.get(signUp.logInLink).should("be.visible").and('have.text', 'Log in')

        cy.get(signUp.logo).should('be.visible')

        cy.footerCheck()
        cy.get(signUp.chatIcon).should('be.visible')
    });

    it("A user is able to sign up to the platform and verify email", () => {
        cy.UserSignUp()
        // Log in to verify that a user is registered
        cy.userLogin(Data.createCompany.admin.Email, Data.createCompany.admin.Password);
        cy.get(emailVerification.emailVerificationModalAfterLogin).should('exist');
        // Verify email
        cy.emailVerification(Data.signUpUser.signUpUserEMailCredentials);
    })
});