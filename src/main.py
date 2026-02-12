"""
Flashcard Learning Application
Main entry point for the command-line flashcard memorization tool.
"""
import sys
from wordlist_manager import WordlistManager
from learn_mode import LearnMode
from test_mode import TestMode
from memorize_mode import MemorizeMode
from colors import Colors


def clear_screen():
    """Clear the console screen (cross-platform)."""
    import os
    os.system('cls' if os.name == 'nt' else 'clear')


def display_header():
    """Display application header."""
    print("\n" + Colors.cyan("="*50))
    print(Colors.bold_cyan("     FLASHCARD LEARNING APPLICATION"))
    print(Colors.cyan("="*50))


def select_wordlist(manager: WordlistManager):
    """
    Display available wordlists and let user select one.
    
    Args:
        manager: WordlistManager instance
        
    Returns:
        Loaded wordlist dictionary or None
    """
    wordlists = manager.get_available_wordlists()
    
    if not wordlists:
        print(Colors.red("\n❌ No wordlists found!"))
        print(f"Please add JSON files to the 'wordlists' directory.")
        print("\nExample format (spanish.json):")
        print('{\n  "hello": "hola",\n  "goodbye": "adiós"\n}')
        return None
    
    print(Colors.bold("\nAvailable Word Lists:"))
    print("-" * 50)
    for i, name in enumerate(wordlists, 1):
        print(f"  {Colors.yellow(str(i) + '.')} {Colors.cyan(name)}")
    print("-" * 50)
    
    while True:
        choice = input(Colors.magenta("\nEnter wordlist name or number (or 'quit' to exit): ")).strip()
        
        if choice.lower() == 'quit':
            return None
        
        # Check if user entered a number
        if choice.isdigit():
            index = int(choice) - 1
            if 0 <= index < len(wordlists):
                selected_name = wordlists[index]
                wordlist = manager.load_wordlist(selected_name)
                if wordlist:
                    print(Colors.bold_green(f"\n✓ Loaded '{selected_name}' with {len(wordlist['pairs'])} word pairs."))
                    return wordlist
            else:
                print(Colors.red(f"❌ Invalid number. Please enter a number between 1 and {len(wordlists)}."))
        # Check if user entered a name (case-insensitive)
        else:
            # Try to find a case-insensitive match
            matched_wordlist = None
            for wl in wordlists:
                if wl.lower() == choice.lower():
                    matched_wordlist = wl
                    break
            
            if matched_wordlist:
                wordlist = manager.load_wordlist(matched_wordlist)
                if wordlist:
                    print(Colors.bold_green(f"\n✓ Loaded '{matched_wordlist}' with {len(wordlist['pairs'])} word pairs."))
                    return wordlist
            else:
                print(Colors.red(f"❌ Wordlist '{choice}' not found. Please enter a valid name or number."))


def select_mode(wordlist):
    """
    Display mode selection menu and handle user choice.
    
    Args:
        wordlist: Loaded wordlist dictionary
        
    Returns:
        True to continue, False to go back to wordlist selection
    """
    while True:
        print("\n" + Colors.cyan("="*50))
        print(Colors.bold_cyan("            SELECT MODE"))
        print(Colors.cyan("="*50))
        print(f"  {Colors.yellow('1.')} Memorize Mode - Master all words")
        print(f"  {Colors.yellow('2.')} Learn Mode - Practice with feedback")
        print(f"  {Colors.yellow('3.')} Test Mode - Scored assessment")
        print(f"  {Colors.yellow('4.')} Back to wordlist selection")
        print(f"  {Colors.yellow('5.')} Quit application")
        print(Colors.cyan("="*50))
        
        choice = input(Colors.magenta("\nYour choice: ")).strip().lower()
        
        if choice == "1":
            memorize_mode = MemorizeMode(wordlist)
            memorize_mode.start()
        elif choice == "2":
            learn_mode = LearnMode(wordlist)
            learn_mode.start()
        elif choice == "3":
            test_mode = TestMode(wordlist)
            test_mode.start()
        elif choice == "4" or choice == "back":
            return True  # Continue to select new wordlist
        elif choice == "5" or choice == "quit":
            return False  # Exit application
        else:
            print(Colors.red("Invalid choice. Please enter 1, 2, 3, 4, or 5."))


def main():
    """Main application loop."""
    # WordlistManager will automatically find wordlists directory
    manager = WordlistManager("wordlists")
    
    print("\n" + Colors.cyan("="*50))
    print(Colors.bold_cyan("  Welcome to Flashcard Learning Application!"))
    print(Colors.cyan("="*50))
    
    while True:
        display_header()
        
        # Select wordlist
        wordlist = select_wordlist(manager)
        if wordlist is None:
            print(Colors.yellow("\nThank you for using Flashcard Learning Application!"))
            print(Colors.bold_green("Goodbye! 👋"))
            sys.exit(0)
        
        # Select and run mode
        continue_app = select_mode(wordlist)
        if not continue_app:
            print(Colors.yellow("\nThank you for using Flashcard Learning Application!"))
            print(Colors.bold_green("Goodbye! 👋"))
            sys.exit(0)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(Colors.yellow("\n\nApplication interrupted by user."))
        print(Colors.bold_green("Goodbye! 👋"))
        sys.exit(0)
