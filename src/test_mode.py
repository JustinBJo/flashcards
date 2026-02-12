"""
Test Mode Module
Handles the test mode functionality with scoring.
"""
import random
from typing import Dict, List
from colors import Colors


class TestMode:
    """Manages the test mode for flashcard assessment."""
    
    def __init__(self, wordlist: Dict):
        """
        Initialize test mode with a wordlist.
        
        Args:
            wordlist: Dictionary containing word pairs
        """
        self.wordlist = wordlist
        self.pairs = wordlist["pairs"]
        self.max_questions = min(100, len(self.pairs))
    
    def start(self):
        """Start the test mode."""
        print("\n" + Colors.cyan("="*50))
        print(Colors.bold_cyan("              TEST MODE"))
        print(Colors.cyan("="*50))
        
        # Select test direction mode
        test_mode = self._select_test_mode()
        if test_mode is None:
            return
        
        # Get number of questions
        num_questions = self._get_question_count()
        if num_questions is None:
            return
        
        # Run the test
        results = self._run_test(num_questions, test_mode)
        
        # Display results
        self._display_results(results, num_questions, test_mode)
    
    def _select_test_mode(self) -> str:
        """
        Prompt user to select test mode.
        
        Returns:
            Test mode string ('word-to-meaning', 'meaning-to-word', 'random') or None if cancelled
        """
        while True:
            print(f"\n{Colors.bold('Select Test Direction:')}")
            print(f"  {Colors.yellow('1.')} Word → Meaning (you see the word, type the meaning)")
            print(f"  {Colors.yellow('2.')} Meaning → Word (you see the meaning, type the word)")
            print(f"  {Colors.yellow('3.')} Random (questions in random directions)")
            print(f"  {Colors.yellow('4.')} Back to menu")
            print(Colors.cyan("="*50))
            
            choice = input(Colors.magenta("\nYour choice: ")).strip().lower()
            
            if choice == "1":
                return "word-to-meaning"
            elif choice == "2":
                return "meaning-to-word"
            elif choice == "3":
                return "random"
            elif choice == "4" or choice == "back":
                return None
            else:
                print(Colors.red("Invalid choice. Please enter 1, 2, 3, or 4."))
    
    def _get_question_count(self) -> int:
        """
        Prompt user for number of test questions.
        
        Returns:
            Number of questions or None if cancelled
        """
        while True:
            print(f"\nWordlist size: {Colors.cyan(str(len(self.pairs)))} words")
            print(f"Maximum questions: {Colors.cyan(str(self.max_questions))}")
            
            user_input = input(Colors.magenta(f"\nHow many questions (1-{self.max_questions}, or 'back' to cancel)? ")).strip()
            
            if user_input.lower() == "back":
                return None
            
            try:
                num = int(user_input)
                if 1 <= num <= self.max_questions:
                    return num
                else:
                    print(Colors.red(f"Please enter a number between 1 and {self.max_questions}."))
            except ValueError:
                print(Colors.red("Invalid input. Please enter a number."))
    
    def _run_test(self, num_questions: int, test_mode: str) -> List[Dict]:
        """
        Run the test with specified number of questions.
        
        Args:
            num_questions: Number of questions to ask
            test_mode: Test direction ('word-to-meaning', 'meaning-to-word', or 'random')
            
        Returns:
            List of result dictionaries
        """
        # Select random unique pairs
        test_pairs = random.sample(self.pairs, num_questions)
        results = []
        
        mode_display = {
            "word-to-meaning": "Word → Meaning",
            "meaning-to-word": "Meaning → Word",
            "random": "Random Direction"
        }
        
        print(f"\n{Colors.cyan('='*50)}")
        print(Colors.bold_cyan(f"  TEST STARTED - {num_questions} questions"))
        print(Colors.bold(f"  Mode: {Colors.blue(mode_display[test_mode])}"))
        print(f"{Colors.cyan('='*50)}\n")
        
        for i, pair in enumerate(test_pairs, 1):
            # Determine question direction based on test mode
            if test_mode == "word-to-meaning":
                is_word_to_meaning = True
            elif test_mode == "meaning-to-word":
                is_word_to_meaning = False
            else:  # random
                is_word_to_meaning = random.choice([True, False])
            
            if is_word_to_meaning:
                question = pair["word"]
                correct_answer = pair["meaning"]
                question_type = "Word → Meaning"
            else:
                question = pair["meaning"]
                correct_answer = pair["word"]
                question_type = "Meaning → Word"
            
            print(Colors.yellow(f"Question {i}/{num_questions}"))
            print(f"{Colors.bold(question_type)}: {Colors.blue(question)}")
            user_answer = input(Colors.magenta("Your answer: ")).strip()
            
            # Check answer (case-insensitive)
            is_correct = user_answer.lower() == correct_answer.lower()
            
            results.append({
                "question_number": i,
                "question": question,
                "question_type": question_type,
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                "word": pair["word"],
                "meaning": pair["meaning"]
            })
            
            print()  # Empty line for readability
        
        return results
    
    def _display_results(self, results: List[Dict], total_questions: int, test_mode: str):
        """
        Display test results with score and wrong answers.
        
        Args:
            results: List of result dictionaries
            total_questions: Total number of questions
            test_mode: Test direction that was used
        """
        mode_display = {
            "word-to-meaning": "Word → Meaning",
            "meaning-to-word": "Meaning → Word",
            "random": "Random Direction"
        }
        
        correct_count = sum(1 for r in results if r["is_correct"])
        percentage = (correct_count / total_questions) * 100
        
        print("\n" + Colors.cyan("="*50))
        print(Colors.bold_cyan("              TEST RESULTS"))
        print(Colors.bold(f"       Mode: {Colors.blue(mode_display[test_mode])}"))
        print(Colors.cyan("="*50))
        
        # Determine color based on percentage
        if percentage >= 90:
            score_color = Colors.bold_green
        elif percentage >= 70:
            score_color = Colors.yellow
        else:
            score_color = Colors.red
        
        print(f"\n{Colors.bold('Score:')} {score_color(f'{correct_count}/{total_questions}')}")
        print(f"{Colors.bold('Percentage:')} {score_color(f'{percentage:.1f}%')}")
        
        # Display wrong answers
        wrong_answers = [r for r in results if not r["is_correct"]]
        
        if wrong_answers:
            print(f"\n{Colors.cyan('='*50)}")
            print(Colors.bold_red(f"  INCORRECT ANSWERS ({len(wrong_answers)})"))
            print(f"{Colors.cyan('='*50)}\n")
            
            for result in wrong_answers:
                print(Colors.yellow(f"Question {result['question_number']}:"))
                print(f"  Asked: {Colors.cyan(result['question_type'])} - {Colors.blue(result['question'])}")
                print(f"  Your answer: {Colors.red(result['user_answer'])}")
                print(f"  Correct answer: {Colors.green(result['correct_answer'])}")
                print(f"  [Word: '{Colors.cyan(result['word'])}' = Meaning: '{Colors.cyan(result['meaning'])}']")
                print()
        else:
            print(Colors.bold_green("\n🎉 Perfect score! All answers correct!"))
        
        print(Colors.cyan("="*50))
        input(Colors.magenta("\nPress Enter to return to main menu..."))

