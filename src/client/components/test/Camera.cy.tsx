import React from 'react';
import Camera from '../Camera';

describe('<Camera />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Camera />);
  });

  it('has file input to allow mobile camera access', () => {
    cy.mount(<Camera />);
    cy.get('input').should('have.attr', 'accept', 'image/*');
  });

  it('should render Take Photo button if no photo has been selected', () => {
    cy.mount(<Camera />);
    cy.get('button').should('have.text', ' Take Photo');
  });

});