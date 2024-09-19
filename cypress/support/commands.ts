// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import {recurse} from "cypress-recurse";

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Gets the requested object that has the correct value for the
             * data-testid property.
             *
             * @param {string} selector the value of the data-testid prop
             * @param options param passed into cy.get()
             * @returns {Cypress.cy} Chain object
             */
            getBySel(selector: string, options?: { timeout: number }): Chainable<JQuery<HTMLElement>>;

            /**
             * Gets all the requested objects that have the correct value
             * for the data-testid property.
             *
             * @param {string} selector the value of the data-testid prop
             * @param options param passed into cy.get()
             * @returns {Cypress.cy} Chain object
             */
            getBySelLike(selector: string, options?: { timeout: number }): Chainable<JQuery<Node>>;
            /**
             *
             * @param selector the value of the id
             * @param options
             * @example cy.getById('select-dropdown').click()
             */
            getById(selector: string, options?: { timeout: number }): Chainable<JQuery<HTMLElement>>;

            /**
             *
             * @param selector the value of partial id match
             * @param options
             * @example cy.getByIdLike('select-dropdown').click()
             */
            getByIdLike(selector: string, options?: { timeout: number }): Chainable<JQuery<HTMLElement>>;

            /**
             * Selects a value from a react-select dropdown by option text
             * @param id contains the id on the select dropdown
             * @param optionText the text of the option to be selected
             * @param options available options
             * ```
             * {
             *      searchTerm: string, search term to filter by in selection
             *      screenshot: string, screenshots the open selection
             * }
             * ```
             * @example cy.reactSelectByOptionText('select-settings-language', 'Español')
             */
            reactSelectByOptionText(
                id: string,
                optionText: string,
                options?: { screenshot?: string }
            ): Chainable<JQuery<HTMLElement>>;

            /**
             * Searches inside a select drop down and selects value from search results
             * @param id contains the id on the select dropdown
             * @param searchTerm search string
             * @param options available options
             * ```
             * {
             *      optionText the text of the option to be selected
             *      searchRequestUrl: string, url of the intercepted API request
             *      exists: boolean, indicates if we are expecting to get a result or "not found"
             *      screenshot: string, screenshots the open selection with this string as prefix
             * }
             * ```
             * @example Standard search and select cy.reactSearchAndSelectByOptionText('select-dropdown-origin', 'location', {optionText: 'location A'})
             * @example Search a API populated drop down and take screenshot cy.reactSearchAndSelectByOptionText('select-dropdown-origin', 'location', {optionText: 'location A', screenshotOpen: true, searchRequestUrl: 'locations-search*'})
             * @example Search expecting no results cy.reactSearchAndSelectByOptionText('select-dropdown-origin', 'location', {exists: false})
             */
            reactSearchAndSelectByOptionText(
                id: string,
                searchTerm: string,
                options?: {
                    optionText?: string;
                    searchRequestUrl?: string;
                    exists?: boolean;
                    screenshot?: string;
                }
            ): Chainable<JQuery<HTMLElement>>;

            fetchEmail(emailTask: string, arg?: any): Chainable<JQuery<HTMLElement>>;
        }
    }
}

Cypress.Commands.add('getBySel', (selector, options) => {
    return cy.get(`[data-testid=${selector}]`, options);
});

Cypress.Commands.add('getBySelLike', (selector, options) => {
    return cy.get(`[data-testid*=${selector}]`, options);
});

Cypress.Commands.add('getById', (selector, options) => {
    return cy.get(`[id=${selector}]`, options);
});

Cypress.Commands.add('getByIdLike', (selector, options) => {
    return cy.get(`[id*=${selector}]`, options);
});

Cypress.Commands.add('reactSelectByOptionText', (id, optionText, options) => {
    cy.getById(id).last().click();

    if (options?.screenshot) {
        cy.screenshot(options.screenshot);
    }

    cy.getByIdLike('listbox').within(() => {
        cy.contains(optionText).click();
    });
});

Cypress.Commands.add('fetchEmail', (emailTask: string, arg?: any) => {

    if (typeof arg !== "undefined"){
        return recurse(
            () => cy.task(emailTask, arg), // Cypress commands to retry
            Cypress._.isObject, // keep retrying until the task returns an object
            {
                timeout: 60000, // retry up to 1 minute
                delay: 5000, // wait 5 seconds between attempts
            },
        )}
    else{
        return recurse(
            () => cy.task(emailTask),
            Cypress._.isObject,
            {
                timeout: 60000,
                delay: 5000,
            },
        )
    }
})


export {};
