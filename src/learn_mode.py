"""
Learn Mode Module
Handles the learning mode functionality.
"""
import random
from typing import Dict
from colors import Colors


class LearnMode:
    """Manages the learn mode for flashcard practice."""
    
    def __init__(self, wordlist: Dict):
        """
        Initialize learn mode with a wordlist.
        
        Args:
            wordlist: Dictionary containing word pairs
        """
        self.wordlist = wordlist
        self.pairs = wordlist["pairs"]
    
    def start(self):
        """Start the learn mode with direction selection."""
        while True:
            print("\n" + Colors.cyan("="*50))
            print(Colors.bold_cyan("           LEARN MODE OPTIONS"))
            print(Colors.cyan("="*50))
            print(f"  {Colors.yellow('1.')} Word → Meaning")
            print(f"  {Colors.yellow('2.')} Meaning → Word")
            print(f"  {Colors.yellow('3.')} Random")
            print(f"  {Colors.yellow('4.')} Back to main menu")
            print(Colors.cyan("="*50))
            
            choice = input(Colors.magenta("\nYour choice: ")).strip().lower()
            
            if choice == "1":
                self._practice_loop("word_to_meaning")
            elif choice == "2":
                self._practice_loop("meaning_to_word")
            elif choice == "3":
                self._practice_loop("random")
            elif choice == "4" or choice == "back":
                break
            else:
                print(Colors.red("Invalid choice. Please enter 1, 2, 3, or 4."))
    
    def _practice_loop(self, direction: str):
        """
        Main practice loop for learning.
        
        Args:
            direction: Learning direction (word_to_meaning, meaning_to_word, or random)
        """
        print(f"\n{Colors.cyan('='*50)}")
        print(Colors.bold_cyan("  Starting practice session!"))
        print(Colors.yellow("  Type 'end session' at any time to return to learn menu"))
        print(f"{Colors.cyan('='*50)}\n")
        
        while True:
            # Select random pair
            pair = random.choice(self.pairs)
            
            # Determine direction for this question
            if direction == "random":
                current_direction = random.choice(["word_to_meaning", "meaning_to_word"])
            else:
                current_direction = direction
            
            # Ask question based on direction
            if current_direction == "word_to_meaning":
                question = pair["word"]
                correct_answer = pair["meaning"]
                prompt_type = "Word"
            else:
                question = pair["meaning"]
                correct_answer = pair["word"]
                prompt_type = "Meaning"
            
            print(f"{Colors.bold(prompt_type)}: {Colors.blue(question)}")
            user_answer = input(Colors.magenta("Your answer: ")).strip()
            
            if user_answer.lower() == "end session":
                print(Colors.yellow("\nReturning to learn mode menu..."))
                break
            
            # Check answer (case-insensitive)
            if user_answer.lower() == correct_answer.lower():
                print(Colors.bold_green("✓ Correct!") + "\n")
            else:
                print(Colors.bold_red("✗ Incorrect.") + f" The correct answer is: {Colors.green(correct_answer)}")
                
                # Ask if they want to mark it as correct anyway
                mark_correct = input(Colors.magenta("Mark as correct anyway? [y/n]: ")).strip().lower()
                
                if mark_correct != 'y':
                    # Make them practice typing both word and meaning
                    print(Colors.yellow("\nPlease practice typing both:"))
                    
                    # Type the word
                    while True:
                        typed_word = input(Colors.magenta(f"Type the word: ")).strip()
                        if typed_word.lower() == pair["word"].lower():
                            print(Colors.green("✓ Correct!"))
                            break
                        else:
                            print(Colors.red(f"✗ Try again. The word is: {Colors.green(pair['word'])}"))
                    
                    # Type the meaning
                    while True:
                        typed_meaning = input(Colors.magenta(f"Type the meaning: ")).strip()
                        if typed_meaning.lower() == pair["meaning"].lower():
                            print(Colors.green("✓ Correct!"))
                            break
                        else:
                            print(Colors.red(f"✗ Try again. The meaning is: {Colors.green(pair['meaning'])}"))
                
                print()  # Empty line for readability
