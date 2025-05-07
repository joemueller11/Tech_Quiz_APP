import Quiz from '../../client/src/components/Quiz';
import * as questionApi from '../../client/src/services/questionApi';

describe('Quiz Component', () => {
  beforeEach(() => {
    // Create stub for API call to prevent actual network requests during testing
    cy.stub(questionApi, 'getQuestions').resolves([
      {
        id: '1',
        question: 'What is React?',
        answers: [
          { text: 'A JavaScript library for building user interfaces', isCorrect: true },
          { text: 'A programming language', isCorrect: false },
          { text: 'A database management system', isCorrect: false },
          { text: 'An operating system', isCorrect: false }
        ]
      },
      {
        id: '2',
        question: 'Which hook is used for state in React?',
        answers: [
          { text: 'useEffect', isCorrect: false },
          { text: 'useState', isCorrect: true },
          { text: 'useContext', isCorrect: false },
          { text: 'useReducer', isCorrect: false }
        ]
      }
    ]);
  });

  it('should render the Start Quiz button initially', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz').should('be.visible');
  });

  it('should load and show questions after clicking Start Quiz', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz').click();
    cy.contains('What is React?').should('be.visible');
    cy.contains('A JavaScript library for building user interfaces').should('be.visible');
  });

  it('should move to the next question after answering', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz').click();
    cy.contains('1').click(); // Click the first answer
    cy.contains('Which hook is used for state in React?').should('be.visible');
  });

  it('should show quiz results after completing all questions', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz').click();
    
    // Answer first question correctly
    cy.contains('1').click();
    
    // Answer second question
    cy.contains('2').click();
    
    // Should show results
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score:').should('be.visible');
  });

  it('should restart the quiz when clicking Take New Quiz button', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz').click();
    
    // Complete the quiz quickly
    cy.contains('1').click();
    cy.contains('2').click();
    
    cy.contains('Take New Quiz').click();
    cy.contains('What is React?').should('be.visible');
  });
});