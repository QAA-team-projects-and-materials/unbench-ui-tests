import {beforeEach} from "mocha";

describe('Forgot Password', () => {
    const Data = require('../fixtures/data.json');
    const signUpUser = Data['signUpUser']
    const newPassword = 22222222;
    const companyName = Data.createCompany.company.Company;

    beforeEach(() =>{
        cy.UserSignUp()
        // Log in to verify that a user is registered
        cy.userLogin(signUpUser.email, signUpUser.password)
        cy.emailVerification(signUpUser.signUpUserEMailCredentials);
        cy.clearLocalStorage();
    })
    after(() => {
        cy.deleteCompany(companyName)
    })

    it('A manager is able to reset their password via "Forgot your email"', () =>{
        cy.resetPasswordForgotPassword(signUpUser.signUpUserEMailCredentials, newPassword);
        // Change the password back
        cy.clearLocalStorage();
        cy.resetPasswordForgotPassword(signUpUser.signUpUserEMailCredentials, signUpUser.password);

    })
})
