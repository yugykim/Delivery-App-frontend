/** @format */

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import '@testing-library/cypress/add-commands';

declare global {
	namespace Cypress {
		interface Chainable {
			assertLoggedIn(): void;
			assertLoggedOut(): void;
			login(email: string, password: string): void;
		}
	}
}

beforeEach(() => {
	cy.window().then((win) => win.sessionStorage.clear());
	cy.clearCookies();
	cy.clearLocalStorage();
});

Cypress.Commands.add('assertLoggedIn', () => {
	cy.window().its('localStorage.uber-toekn').should('be.a', 'string');
});

Cypress.Commands.add('assertLoggedOut', () => {
	cy.window().its('localStorage.uber-toekn').should('be.n', 'string');
});

Cypress.Commands.add('login', (email, password) => {
	cy.visit('/');
	cy.findByPlaceholderText(/email/i).type(email);
	cy.findByPlaceholderText(/password/i).type(password);
	cy.findByRole('button')
		.should('not.have.class', 'pointer-events-none')
		.click();
	cy.assertLoggedIn();
});
