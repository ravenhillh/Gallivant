import React from 'react';
import CustomModal from '../tourComponents/Modal';

describe('<CustomModal />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CustomModal openModal={true} closeModal={() => {}} >Test input</CustomModal>);
  });

  it('should have a cancel button', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CustomModal openModal={true} closeModal={() => {}} >Test input</CustomModal>);
    const cancelButton = cy.get('.MuiButtonBase-root');
  });
});
