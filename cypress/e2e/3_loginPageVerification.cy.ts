import {beforeEach} from "mocha";


describe('Log in page',  () => {
    const login = require('../fixtures/locators.json')['loginPage']

    beforeEach(()=>{
        cy.visit('/signin')
    })

    it('Verifies elements on the page', () => {
        // Heading section

        cy.getBySel(login.loginHeading).should('exist')
        cy.getBySel(login.logInFormTitle).should('contain.text', 'Log in')
            .parent().children(login.signUpPrompt).should('exist').and('have.text', 'Not a member?Sign up')
        cy.get(login.signUpLink).should('exist')
        // Login form
        cy.getBySel(login.logInWithGoogle).should('exist').children().should('have.text', 'Login with Google')
        cy.getBySel(login.logInWithLinkedin).should('exist').children().should('have.text', 'Login with LinkedIn')
        cy.get(login.emailField).should('exist').and('have.attr', 'type', 'email')
        cy.getBySel(login.emailBlock).should('exist').and('have.text', 'Email')

        cy.get(login.passwordField).should('exist').and('have.attr', 'type', 'password')
        cy.getBySel(login.passwordBlock).should('exist').and('have.text', 'Password')

        // Form button wrapper
        cy.getBySel(login.forgotPasswordLink).contains('Forgot password?').should('exist')
        cy.getBySel(login.logInButton).should('have.text', 'Login')
            .and('have.length', 1).and('be.visible')

        cy.get(login.logo).should('be.visible')

        cy.footerCheck()
        cy.get(login.chatIcon).should('be.visible')
    });
});