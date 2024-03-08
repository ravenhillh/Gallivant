import React from 'react';
import CustomModal from '../tourComponents/Modal';

describe('<CustomModal />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <CustomModal openModal={true} closeModal={() => {}}>
        Test input
      </CustomModal>
    );
  });

  it('should have a cancel button', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <CustomModal openModal={true} closeModal={() => {}}>
        Test input
      </CustomModal>
    );
    cy.get('.MuiButtonBase-root');
  });

  it('clicking the cancel button should close modal', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    cy.mount(
      <CustomModal
        openModal={true}
        closeModal={onChangeSpy}
      >
        Test input
      </CustomModal>
    );
    cy.get('.MuiButtonBase-root').click();
    cy.get('@onChangeSpy').should('have.been.called');
  });
});
