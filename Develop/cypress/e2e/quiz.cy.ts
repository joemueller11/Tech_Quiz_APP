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
    
    // Wait for questions to load
    cy.get('.card h2').should('exist').should('be.visible');
    
    // Check that answer options are displayed
    cy.get('.btn-primary').should('have.length.at.least', 1);
  });

  it('should navigate through quiz questions', () => {
    cy.contains('Start Quiz').click();
    
    // Wait for questions to fully load before proceeding
    cy.get('.card h2').should('be.visible');
    cy.get('.btn-primary').should('be.visible');
    
    // Get the text of the first question
    cy.get('.card h2').invoke('text').then(firstQuestionText => {
      // Store the first question text
      cy.wrap(firstQuestionText).as('firstQuestion');
      
      // Ensure we have a valid question before proceeding
      expect(firstQuestionText).to.be.a('string').and.not.to.be.empty;
      
      // Click the first answer using test id
      cy.get('[data-testid="answer-0"]').should('be.visible').click();
      
      // Give the UI time to update with the next question
      cy.wait(1000);
      
      // The question should change - get the second question
      cy.get('.card h2').should('be.visible').invoke('text').then(secondQuestionText => {
        // Log the questions for debugging
        cy.log(`First question: "${firstQuestionText}"`);
        cy.log(`Second question: "${secondQuestionText}"`);
        
        // Make sure the second question is valid
        expect(secondQuestionText).to.be.a('string').and.not.to.be.empty;
        
        // The key assertion - questions should be different
        expect(secondQuestionText).to.not.equal(firstQuestionText);
      });
    });
  });

  it('should complete the quiz and show results', () => {
    cy.contains('Start Quiz').click();
    
    // Wait for questions to load
    cy.get('.card h2').should('be.visible');
   
    // Here we're clicking answers until we see the quiz completion screen
    cy.get('body').then($body => {
      function clickNextAnswer() {
        if ($body.find(':contains("Quiz Completed")').length > 0) {
          return;
        }
        
        // Use data-testid instead of generic class selector
        cy.get('[data-testid="answer-0"]').should('be.visible').click();
        cy.wait(300); // Give time for the next question to load
        
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
    
    // Wait for questions to load
    cy.get('.card h2').should('be.visible');
    
    // Simplified approach to complete the quiz
    cy.get('body').then($body => {
      function clickNextAnswer() {
        if ($body.find(':contains("Quiz Completed")').length > 0) {
          return;
        }
        
        // Use data-testid instead of generic class selector
        cy.get('[data-testid="answer-0"]').should('be.visible').click();
        cy.wait(300); // Give time for the next question to load
        
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