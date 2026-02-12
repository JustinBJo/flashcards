"""
Memorize Mode Module
Handles the memorize mode functionality with three-stage learning.
"""
import random
from typing import Dict, List, Set, Tuple, Optional
from colors import Colors


class MemorizeMode:
    """Manages the memorize mode for comprehensive flashcard memorization."""
    
    # Constants for stages
    STAGE_TYPE_BOTH = 1       # Type both word and meaning
    STAGE_WORD_TO_MEANING = 2 # See word, type meaning
    STAGE_MEANING_TO_WORD = 3 # See meaning, type word
    
    def __init__(self, wordlist: Dict):
        """
        Initialize memorize mode with a wordlist.
        
        Args:
            wordlist: Dictionary containing word pairs
        """
        self.wordlist = wordlist
        self.pairs = wordlist["pairs"]
        
        # Track progress for each word (word_index -> current_stage)
        # Stage 0 means not started, 1-3 are the stages, 4 means completed all stages
        self.word_stages = {i: 0 for i in range(len(self.pairs))}
        
        # Track which words are in the active pool (introduced but not fully memorized)
        self.words_in_pool = set()  # Set of word indices
        
        # Track which words haven't been introduced yet
        self.words_not_yet_introduced = set(range(len(self.pairs)))
    
    def start(self):
        """Start the memorize mode."""
        print("\n" + Colors.cyan("="*50))
        print(Colors.bold_cyan("           MEMORIZE MODE"))
        print(Colors.cyan("="*50))
        print(Colors.yellow("\nThis mode helps you fully memorize all words."))
        print(Colors.yellow("Each word has 3 stages:"))
        print(Colors.yellow("  1. Type both word and meaning"))
        print(Colors.yellow("  2. See word → type meaning"))
        print(Colors.yellow("  3. See meaning → type word"))
        print(Colors.yellow("\nAnswer all questions correctly to complete!"))
        print(Colors.yellow("Type 'end session' at any time to quit."))
        print(Colors.cyan("="*50))
        
        input(Colors.magenta("\nPress Enter to start..."))
        
        self._memorization_loop()
    
    def _memorization_loop(self):
        """Main memorization loop with runs of 10 questions."""
        run_number = 1
        last_question = None  # Track to avoid immediate repetition
        
        while self.words_in_pool or self.words_not_yet_introduced:
            # Add up to 10 new words to the pool for this run
            self._add_new_words_to_pool()
            
            print(f"\n{Colors.cyan('='*50)}")
            print(Colors.bold_cyan(f"           RUN {run_number}"))
            print(f"{Colors.cyan('='*50)}\n")
            
            # Prepare questions for this run
            questions_this_run = self._prepare_run_questions(last_question)
            
            if not questions_this_run:
                break  # All done!
            
            # Track failed questions for next run
            failed_questions = []
            
            # Ask up to 10 questions in this run
            for i, (word_idx, stage) in enumerate(questions_this_run, 1):
                print(Colors.yellow(f"Question {i}/{len(questions_this_run)}"))
                
                result = self._ask_question(word_idx, stage)
                
                if result == "quit":
                    print(Colors.yellow("\nSession ended. Progress has been saved."))
                    self._display_progress()
                    return
                elif result == "correct":
                    # Move to next stage or mark as complete
                    if stage == self.STAGE_MEANING_TO_WORD:
                        # Completed all stages - remove from pool
                        self.word_stages[word_idx] = 4
                        self.words_in_pool.discard(word_idx)
                    else:
                        # Move to next stage
                        self.word_stages[word_idx] = stage + 1
                else:  # incorrect
                    # Stay at same stage
                    last_question = (word_idx, stage)
                
                print()  # Empty line for readability
            
            # Show progress after this run
            self._display_progress()
            
            # Check if all words are memorized
            if not self.words_in_pool and not self.words_not_yet_introduced:
                print(Colors.bold_green("\n🎉 CONGRATULATIONS! 🎉"))
                print(Colors.bold_green("You have successfully memorized all words!"))
                print(Colors.cyan("="*50))
                return
            
            run_number += 1
            
            # Ask if user wants to continue
            if self.words_in_pool or self.words_not_yet_introduced:
                continue_choice = input(Colors.magenta("\nContinue to next run? [Y/n]: ")).strip().lower()
                if continue_choice and continue_choice not in ['y', 'yes', '']:
                    print(Colors.yellow("\nSession paused. Progress has been saved."))
                    self._display_progress()
                    return
    
    def _add_new_words_to_pool(self):
        """
        Add up to 10 new words to the active pool.
        New words start at stage 1 (type both).
        """
        # Add up to 10 new words
        words_to_add = min(10, len(self.words_not_yet_introduced))
        
        if words_to_add > 0:
            # Get random words from the not-yet-introduced set
            new_word_indices = random.sample(list(self.words_not_yet_introduced), words_to_add)
            
            for word_idx in new_word_indices:
                self.words_in_pool.add(word_idx)
                self.word_stages[word_idx] = 1  # Start at stage 1
                self.words_not_yet_introduced.remove(word_idx)
    
    def _prepare_run_questions(self, last_question: Optional[Tuple[int, int]]) -> List[Tuple[int, int]]:
        """
        Prepare up to 10 questions for this run from the active pool.
        Questions are randomized without duplicates.
        
        Args:
            last_question: The last question asked (to avoid immediate repetition)
            
        Returns:
            List of (word_index, stage) tuples for this run
        """
        if not self.words_in_pool:
            return []
        
        # Generate all possible questions from words in pool
        all_questions = [(word_idx, self.word_stages[word_idx]) 
                        for word_idx in self.words_in_pool]
        
        # Shuffle the questions
        random.shuffle(all_questions)
        
        # Take up to 10 questions
        num_questions = min(10, len(all_questions))
        questions_this_run = all_questions[:num_questions]
        
        # If the first question is the same as the last one, try to swap it
        if last_question and len(questions_this_run) > 1 and questions_this_run[0] == last_question:
            # Swap first and second
            questions_this_run[0], questions_this_run[1] = questions_this_run[1], questions_this_run[0]
        
        return questions_this_run
    
    def _ask_question(self, word_idx: int, stage: int) -> str:
        """
        Ask a question based on word index and stage.
        
        Args:
            word_idx: Index of the word in self.pairs
            stage: Current stage (1, 2, or 3)
            
        Returns:
            "correct", "incorrect", or "quit"
        """
        pair = self.pairs[word_idx]
        word = pair["word"]
        meaning = pair["meaning"]
        
        if stage == self.STAGE_TYPE_BOTH:
            return self._stage_type_both(word, meaning)
        elif stage == self.STAGE_WORD_TO_MEANING:
            return self._stage_word_to_meaning(word, meaning)
        elif stage == self.STAGE_MEANING_TO_WORD:
            return self._stage_meaning_to_word(word, meaning)
        
        return "incorrect"
    
    def _stage_type_both(self, word: str, meaning: str) -> str:
        """
        Stage 1: User must type both word and meaning correctly.
        
        Args:
            word: The word
            meaning: The meaning
            
        Returns:
            "correct", "incorrect", or "quit"
        """
        print(Colors.bold("Stage 1: Type both word and meaning"))
        print(Colors.blue(f"Word: {word}"))
        print(Colors.blue(f"Meaning: {meaning}"))
        print(Colors.yellow("Please type both to memorize them:"))
        
        # Type the word
        typed_word = input(Colors.magenta("Type the word: ")).strip()
        if typed_word.lower() == "end session":
            return "quit"
        
        # Type the meaning
        typed_meaning = input(Colors.magenta("Type the meaning: ")).strip()
        if typed_meaning.lower() == "end session":
            return "quit"
        
        # Check both (case-insensitive)
        word_correct = typed_word.lower() == word.lower()
        meaning_correct = typed_meaning.lower() == meaning.lower()
        
        if word_correct and meaning_correct:
            print(Colors.bold_green("✓ Perfect! Both correct!"))
            return "correct"
        else:
            print(Colors.bold_red("✗ Not quite right."))
            if not word_correct:
                print(f"  Word should be: {Colors.green(word)}")
            if not meaning_correct:
                print(f"  Meaning should be: {Colors.green(meaning)}")
            return "incorrect"
    
    def _stage_word_to_meaning(self, word: str, meaning: str) -> str:
        """
        Stage 2: Show word, user types meaning.
        
        Args:
            word: The word
            meaning: The meaning
            
        Returns:
            "correct", "incorrect", or "quit"
        """
        print(Colors.bold("Stage 2: Word → Meaning"))
        print(f"{Colors.bold('Word')}: {Colors.blue(word)}")
        
        user_answer = input(Colors.magenta("Type the meaning: ")).strip()
        
        if user_answer.lower() == "end session":
            return "quit"
        
        # Check answer (case-insensitive)
        if user_answer.lower() == meaning.lower():
            print(Colors.bold_green("✓ Correct!"))
            return "correct"
        else:
            print(Colors.bold_red("✗ Incorrect.") + f" The correct answer is: {Colors.green(meaning)}")
            return "incorrect"
    
    def _stage_meaning_to_word(self, word: str, meaning: str) -> str:
        """
        Stage 3: Show meaning, user types word.
        
        Args:
            word: The word
            meaning: The meaning
            
        Returns:
            "correct", "incorrect", or "quit"
        """
        print(Colors.bold("Stage 3: Meaning → Word"))
        print(f"{Colors.bold('Meaning')}: {Colors.blue(meaning)}")
        
        user_answer = input(Colors.magenta("Type the word: ")).strip()
        
        if user_answer.lower() == "end session":
            return "quit"
        
        # Check answer (case-insensitive)
        if user_answer.lower() == word.lower():
            print(Colors.bold_green("✓ Correct!"))
            return "correct"
        else:
            print(Colors.bold_red("✗ Incorrect.") + f" The correct answer is: {Colors.green(word)}")
            return "incorrect"
    
    def _display_progress(self):
        """Display current memorization progress."""
        total_words = len(self.pairs)
        memorized_count = sum(1 for stage in self.word_stages.values() if stage == 4)
        
        # Count words at each stage
        stage_1_count = sum(1 for stage in self.word_stages.values() if stage == 1)
        stage_2_count = sum(1 for stage in self.word_stages.values() if stage == 2)
        stage_3_count = sum(1 for stage in self.word_stages.values() if stage == 3)
        
        print(f"\n{Colors.cyan('='*50)}")
        print(Colors.bold_cyan("           PROGRESS REPORT"))
        print(f"{Colors.cyan('='*50)}")
        print(f"Total words: {Colors.cyan(str(total_words))}")
        print(f"Fully memorized: {Colors.bold_green(str(memorized_count))} / {Colors.cyan(str(total_words))}")
        
        if memorized_count < total_words:
            print(f"\nWords by stage:")
            print(f"  Stage 1 (Type both): {Colors.yellow(str(stage_1_count))}")
            print(f"  Stage 2 (Word→Meaning): {Colors.yellow(str(stage_2_count))}")
            print(f"  Stage 3 (Meaning→Word): {Colors.yellow(str(stage_3_count))}")
        
        percentage = (memorized_count / total_words) * 100
        print(f"\nCompletion: {Colors.bold_green(f'{percentage:.1f}%')}")
        print(f"{Colors.cyan('='*50)}")
