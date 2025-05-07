describe('Quiz Application', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');
  });

  it('should load the quiz page', () => {
    cy.contains('Start Quiz').should('be.visible');
  });

  it('should start the quiz when clicking the Start Quiz button', () => {
    cy.contains('Start Quiz').click();
    
    
    cy.get('.card h2').should('exist');
    
    // Check that answer options are displayed
    cy.get('.btn-primary').should('have.length.at.least', 1);
  });

  it('should navigate through quiz questions', () => {
    cy.contains('Start Quiz').click();
    
    // Get the text of the first question
    cy.get('.card h2').invoke('text').as('firstQuestion');
    
    // Click the first answer
    cy.get('.btn-primary').first().click();
    
    // The question should change
    cy.get('.card h2').invoke('text').then((secondQuestion) => {
      cy.get('@firstQuestion').then((firstQuestion) => {
        expect(secondQuestion).not.to.eq(firstQuestion);
      });
    });
  });

  it('should complete the quiz and show results', () => {
    cy.contains('Start Quiz').click();
    
   
    // Here we're clicking answers until we see the quiz completion screen
    cy.get('body').then($body => {
      function clickNextAnswer() {
        if ($body.find(':contains("Quiz Completed")').length > 0) {
          return;
        }
        
        cy.get('.btn-primary').first().click();
        
        // Check if quiz is completed
        cy.get('body').then($updatedBody => {
          if ($updatedBody.find(':contains("Quiz Completed")').length === 0) {
            clickNextAnswer();
          }
        });
      }
      
      clickNextAnswer();
    });
    
    // Verify we see the quiz results
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score:').should('be.visible');
  });

  it('should be able to restart the quiz after completion', () => {
    cy.contains('Start Quiz').click();
    
    // Simplified approach to complete the quiz
    cy.get('body').then($body => {
      function clickNextAnswer() {
        if ($body.find(':contains("Quiz Completed")').length > 0) {
          return;
        }
        
        cy.get('.btn-primary').first().click();
        
        // Check if quiz is completed
        cy.get('body').then($updatedBody => {
          if ($updatedBody.find(':contains("Quiz Completed")').length === 0) {
            clickNextAnswer();
          }
        });
      }
      
      clickNextAnswer();
    });
    
    // Start a new quiz
    cy.contains('Take New Quiz').click();
    
    // Verify that a new quiz has started
    cy.contains('Take New Quiz').should('not.exist');
    cy.get('.card h2').should('exist');
  });
});