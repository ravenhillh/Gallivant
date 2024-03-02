import React from 'react';
import CreateReview from '../CreateReview';

describe('<CreateReview />', () => {
  it('renders', () => {
    cy.mount(<CreateReview tourId={1} handleClose={() => {}}/>);
  });

  it('Text Area should have placeholder: Leave a Review', () => {
    cy.mount(<CreateReview tourId={1} handleClose={() => {}}/>);

    cy.get('textarea').should('have.attr', 'placeholder', 'Leave a Review');

  });

  it('Renders Send Button', () => {
    cy.mount(<CreateReview tourId={1} handleClose={() => {}}/>);

    cy.contains(/send/i).should('be.visible');

  });
});