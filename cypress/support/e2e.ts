import './commands';
import 'cypress-real-events';

const Data = require('../fixtures/data.json');
const developer = Data["developerA"]
const Urls = require("../fixtures/urls.json");
const Locators = require("../fixtures/locators.json");
const addDeveloper = Locators["addDeveloper"];
const signUp = Locators["signUpPage"]
declare global {

    namespace Cypress {
        interface Chainable {
            deleteCompany(companyName: string);
            addCompany(companyName: string, user): string;
            completeFirstStepOfRegistration(): Chainable;
            completeSecondStepOfRegistration(): Chainable;
            completeThirdStepOfRegistration(): Chainable;
            UserSignUp(): Chainable;
            userLogin(userEmail: string, userPassword: string): Chainable;
            emailVerification(user): Chainable;
            addDeveloper(): Chainable;
            footerCheck(): Chainable;
            setEmailAccount(email: string, password: string): Chainable;
            resetPasswordForgotPassword(user, newPassword): Chainable;
            newManagerEmailVerification(user, managerPassword): Chainable;
        }
    }
}


Cypress.Commands.add('deleteCompany', (companyName) => {
    const query = `
    query getCompanyByName($companyName: String){
        Company(Name: $companyName){
            Id
            CompanyName
  }
}
  `
    cy.request({
        method: 'POST',
        headers: {authorization: 'admin'},
        url: 'https://test.kitrum.dev/graphql',
        body: {
            query: query,
            variables: {companyName: companyName}
        }
    }).then((response) => {

        console.log(response)
        cy.request({
            method: 'POST',
            headers: {authorization: 'admin'},
            url: 'https://test.kitrum.dev/graphql',
            body: {
                operationName: 'removeCompany',
                query: `mutation removeCompany($Id: String) {
                        removeCompany(Id: $Id) {
                            Id
                        }
                    }`,
                variables: {Id: response.body.data.Company.Id}
            }
        })
    })
})

Cypress.Commands.add('addCompany', (companyData, user) => {
    const query = `
    mutation addCompany($companyData: CompanyInput, $user:NewUserInput){
  addCompany(Company: $companyData, User: $user){
    LinkRedirect
  }
}
  `
    cy.request({
        method: 'POST',
        headers: {authorization: 'admin'},
        url: 'https://test.kitrum.dev/graphql',
        body: {
            query: query,
            variables: {companyName: companyData, user: user}
        }
    }).then((response) => {

        console.log(response.body)

    })
})

Cypress.Commands.add('addDeveloper', () => {
    cy.visit('/account/developers');
    cy.wait(1000);
    cy.log('window focus ()');
    cy.window().focus();
    cy.getBySel(addDeveloper.addDeveloperBtn).contains('Add Developer').should('exist').realClick();
    cy.getBySel(addDeveloper.developersName).should('exist').type(developer.name);
    cy.getBySel(addDeveloper.position).should('exist').type(developer.position);
    cy.getBySel(addDeveloper.locationDropDown).children().contains('Developers location').parent().children(addDeveloper.locationContainer).realClick();
    cy.get(addDeveloper.locationsOption).contains(developer.location).realClick();
    cy.getBySel(addDeveloper.developerRate).should('exist').type(developer.rate);

    developer.keyTechnologies.forEach((technology) => {
        cy.getBySel(addDeveloper.keyTechnologies).children().contains('Key technologies').parent().children(addDeveloper.technologiesContainer).realClick();
        cy.get(addDeveloper.technologyOption).contains(technology).realClick();
    })

    cy.get(addDeveloper.uploadFile).selectFile('cypress/e2e/TestCVKitrumdoc.docx', { action: 'drag-drop' });
    cy.wait(5000);
    cy.getBySel(addDeveloper.addBtn).contains('Add').should('exist').realClick()
    cy.getBySel(addDeveloper.developerItem).contains(developer.name).should('exist');
})

Cypress.Commands.add('userLogin', (userEmail: string, userPassword: string) => {
    const login = require('../fixtures/locators.json')['loginPage']
    cy.visit('/signin')
    cy.get(login.emailField).type(userEmail)
    cy.get(login.passwordField).type(userPassword)
    cy.getBySel(login.logInButton).realClick()
    cy.url().should('eq', Urls.requestsPage)
})

Cypress.Commands.add('resetPasswordForgotPassword', (user, newPassword) => {
    const forgotPassword = require('../fixtures/locators.json')["forgotPassword"];
    const textInfo = 'Enter your email address and we will send you a link to reset your password.'
    cy.visit('/signin');
    cy.get('.subtitle.nav').contains('Forgot password?').realClick()
    cy.url().should('contain', '/forgotPass')

    // Verify elements for Forgot Password page
    cy.get('.h-4.login').should('contain.text', 'Password')
    cy.get('.form-link-text-wrapper.header>.subtitle').should('contain.text', 'Not a member?')
    cy.get(forgotPassword.signupSubtitle).contains('Sign up').should('exist')
    cy.get(forgotPassword.newPasswordTextInfo).should('contain.text', textInfo)
    cy.get(forgotPassword.backButton).should('contain.text', 'Back')
        .and('be.visible')
    cy.get(forgotPassword.userEmailField).should('exist').and('have.attr', 'type', 'email').type(user.email);
    cy.get(forgotPassword.resetPasswordButton).contains('reset password').should('exist').realClick();
    cy.get('.form-error').should('not.exist');
    cy.fetchEmail('getLatestEmailBySubject', {user: user, subject: 'Reset your password for Unbench.us'}).its('html')
        .then((html) => {
            cy.document({ log: false }).invoke({ log: true }, 'write', html)
        })
    // Verify Email
    cy.contains(user.email).should('exist')
    cy.get('a[href]').contains('Link').then((elem) => {
        const createPasswordUrl = elem.prop('href');
        expect(createPasswordUrl).to.match(/\/createNewPassword\?email=/)
        cy.visit(createPasswordUrl)
    })
    // Verify Create New Password Page and perform actions
    cy.url().should( (elem) => {
        expect(elem).to.match(/\/createNewPassword\?email=/)})
    cy.get(forgotPassword.emailInput).contains('Enter your email address').should('exist')
        .parent().children('input').should('have.attr', 'type', 'email')
        .and('have.value', user.email)
    cy.get(forgotPassword.passwordInput).contains('Enter your new password').should('exist')
        .parent().children('input').should('have.attr', 'type', 'password')
        .should('exist').type(`${newPassword}`)
    cy.get(forgotPassword.confirmPasswordInput).contains('Confirm your password').should('exist')
        .parent().children('input').should('have.attr', 'type', 'password')
        .should('exist').type(`${newPassword}`)
    cy.get(forgotPassword.submitPaswordButton).contains('Sign In').should('exist').realClick()

    // Redirect to Sign In and see if new password works
    cy.url().should('contain', '/requests')
})

Cypress.Commands.add('emailVerification', (user) => {
    const emailVerification = require('../fixtures/locators.json')["emailVerification"];
    cy.fetchEmail('getLatestEmailBySubject', {user: user, subject:'Unbench email verification'}).its('html')
    .then((html) => {
        cy.document({log: true}).invoke({log: true}, 'write', html)
    })
    cy.get('a').contains('link').then((elem) => {
        const loginUrl = elem.prop('href');
        expect(loginUrl).to.match(/\/external\/verification/)
        cy.visit(loginUrl)
        cy.window().focus();
})
    cy.document().then((doc) => {
        cy.stub(doc, "visibilityState").value("hidden") //or "visible" if you want focus
    })
    cy.document().trigger('visibilitychange')
    cy.url().should('contain', '/requests')

    cy.wait(1000)
    cy.get(emailVerification.emailVerifiedMessage).children().contains('Your email is verified!').should('exist')
});

Cypress.Commands.add('newManagerEmailVerification', (managerEmailCreds, managerPassword) => {
    cy.fetchEmail('getLatestEmailBySubject', {user: managerEmailCreds, subject:'Welcome to the Unbench platform'}).its('html')
        .then((html) => {
            cy.document({log: true}).invoke({log: true}, 'write', html)
        })
    cy.get('a').contains('link').then((elem) => {
        const newPassword = elem.prop('href');
        expect(newPassword).to.match(/\/createNewPassword/)
        cy.visit(newPassword)
        cy.window().focus();
    })
    cy.document().then((doc) => {
        cy.stub(doc, "visibilityState").value("hidden") //or "visible" if you want focus
    })
    cy.document().trigger('visibilitychange')
    cy.url().should('contain', '/createNewPassword')
    cy.getBySel('create-pass-input').should('exist').type(managerPassword)
    cy.getBySel('create-pass-confirm-pass-input').should('exist').type(managerPassword)
    cy.get('button[type=submit]').contains('Sign In').should('exist').realClick()
    cy.url().should('contain', '/requests')
});

Cypress.Commands.add('UserSignUp', () => {
    cy.visit('/signup');
    cy.completeFirstStepOfRegistration()
        .completeSecondStepOfRegistration()
        .completeThirdStepOfRegistration();
})

Cypress.Commands.add('completeFirstStepOfRegistration', () => {

    // Filling the form
    cy.getBySel(signUp.firstName).type(Data.createCompany.admin.Firstname)
    cy.getBySel(signUp.lastName).type(Data.createCompany.admin.Lastname)
    cy.getBySel(signUp.email).type(Data.createCompany.admin.Email)
    cy.getBySel(signUp.password).type(Data.createCompany.admin.Password)
    cy.getBySel(signUp.position).type(Data.createCompany.admin.Position)
    cy.getBySel(signUp.birth).realClick().type(Data.createCompany.admin.Birth)
    cy.get(signUp.nextStepButton1).realClick()
    cy.wait(100)
    cy.get(signUp.signUpFormTitle).contains('Sign up').scrollIntoView().should("be.visible")
    cy.get('.form-block.w-form').get(".form-error").should('not.exist')
})

Cypress.Commands.add('completeSecondStepOfRegistration', () => {
    // Filling the form
    cy.getBySel(signUp.companyName).type(Data.createCompany.company.Company)
    cy.getBySel(signUp.website).type(Data.createCompany.company.Website)
    cy.getBySel(signUp.billingEmail).type(Data.createCompany.company.BillingEmail)
    cy.get(signUp.countryOfRegistration).click()
    cy.get(signUp.optionSelect).contains(Data.createCompany.company.Headquarters).click()
    cy.get(signUp.countryOfRegistration).should('contain.text', Data.createCompany.company.Headquarters)
    cy.getBySel(signUp.description).should('exist').type(Data.createCompany.company.Description)
    // Key Technologies wrapper
    cy.getBySel(signUp.keyTechnologiesBlock).children().contains('Key Technologies').parent().children(signUp.showMoreBtn).click()
    Data.createCompany.company.Technologies.forEach((technology) =>{
        cy.getBySel(signUp.keyTechnologies).children(`[data-testid=${signUp.keyTechnologyItem}]`).contains(technology).click()
    })
    // Industries wrapper
    cy.getBySel(signUp.industriesBlock).children().contains('Industries').parent().children(signUp.showMoreBtn).click()
    Data.createCompany.company.Industries.forEach((industry) =>{
        cy.getBySel(signUp.industries).children(`[data-testid=${signUp.industryItem}]`).contains(industry).click()
    })
    // click Next step
    cy.get(signUp.nextStepButton2).contains(/^Next step/).click('center')
    cy.wait(100)
    cy.get(signUp.signUpFormTitle).contains('Sign up').scrollIntoView().should('be.visible')
    cy.get('.form-block.w-form').find('.form-error').should('not.exist')
})

Cypress.Commands.add('completeThirdStepOfRegistration', () => {
    // STEP 3

    cy.get(signUp.createAccountBtn).contains(/^Create account/).click('center')
    cy.url().should('eq', Urls.loginPage)
})
Cypress.Commands.add('footerCheck', () =>{
    // Use only as a part of a test where the footer is present
    const footer = require('../fixtures/locators.json')['footer']
    cy.get(footer.footerBlock).scrollIntoView().should('be.visible')
    cy.get(footer.footerLogo).should('be.visible')
    cy.get(footer.firstColumnLinks).then(($col) => {
        cy.wrap($col).children(footer.linkedInLink).should('have.text', 'Linkedin').and('be.visible').and('have.attr', 'href', Urls.linkedIn)
        cy.wrap($col).children(footer.facebookLink).should('have.text', 'Facebook').and('be.visible').and('have.attr', 'href', Urls.facebook)
        cy.wrap($col).children(footer.instagramLink).should('have.text', 'Instagram').and('be.visible').and('have.attr', 'href', Urls.instagram)
        cy.wrap($col).children(footer.telegramLink).should('have.text', 'Telegram').and('be.visible').and('have.attr', 'href', Urls.telegram)
    })
    cy.get(footer.secondColumnLinks).then(($col) => {
        cy.wrap($col).children(footer.contactLink).should('have.text', 'Contact').and('be.visible')
        cy.wrap($col).children(footer.termsAndConditions).should('have.text', 'Terms & Conditions').and('be.visible')
        cy.wrap($col).children(footer.privacyPolicy).should('have.text', 'Privacy Policy').and('be.visible')
        cy.wrap($col).children(footer.helpdesk).should('have.text', 'Help Desk').and('be.visible')
    })

})

