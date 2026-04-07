"""
View Mode Module
Displays all word pairs in a simple list format.
"""
from typing import Dict
from colors import Colors
import sys
import os

# Platform-specific imports for key detection
if os.name == 'nt':  # Windows
    import msvcrt
else:  # Unix/Linux/Mac
    import tty
    import termios


class ViewMode:
    """Manages the view mode for displaying all word pairs."""
    
    def __init__(self, wordlist: Dict):
        """
        Initialize view mode with a wordlist.
        
        Args:
            wordlist: Dictionary containing word pairs
        """
        self.wordlist = wordlist
        self.pairs = wordlist["pairs"]
    
    def start(self):
        """Display all word pairs in a list format."""
        print("\n" + Colors.cyan("="*70))
        print(Colors.bold_cyan("                           VIEW MODE"))
        print(Colors.cyan("="*70))
        print(Colors.yellow(f"Displaying all {len(self.pairs)} word pairs"))
        print(Colors.cyan("Press Enter or Escape to return to mode selection"))
        print(Colors.cyan("="*70) + "\n")
        
        # Display all pairs in a table format
        max_word_length = max(len(pair["word"]) for pair in self.pairs)
        max_meaning_length = max(len(pair["meaning"]) for pair in self.pairs)
        num_width = len(str(len(self.pairs)))
        
        # Print header
        header_num = "#".rjust(num_width)
        header_word = "WORD".ljust(max_word_length)
        header_meaning = "MEANING".ljust(max_meaning_length)
        print(f"  {Colors.bold_cyan(header_num)}  {Colors.bold_cyan(header_word)}   {Colors.bold_cyan(header_meaning)}")
        print(Colors.cyan("  " + "-"*(num_width + max_word_length + max_meaning_length + 6)))
        
        # Print all pairs
        for i, pair in enumerate(self.pairs, 1):
            num = str(i).rjust(num_width)
            word = pair["word"].ljust(max_word_length)
            meaning = pair["meaning"]
            print(f"  {Colors.yellow(num)}  {Colors.green(word)} → {Colors.blue(meaning)}")
        
        print(Colors.cyan("\n" + "="*70))
        print(Colors.yellow("\nPress Enter or Escape to return..."))
        
        # Wait for user input
        self._wait_for_exit()
    
    def _wait_for_exit(self):
        """Wait for user to press Enter or Escape."""
        if os.name == 'nt':  # Windows
            while True:
                if msvcrt.kbhit():
                    key = msvcrt.getch()
                    # Enter (13) or Escape (27)
                    if key in (b'\r', b'\x1b'):
                        break
        else:  # Unix/Linux/Mac
            # Save terminal settings
            fd = sys.stdin.fileno()
            old_settings = termios.tcgetattr(fd)
            try:
                tty.setraw(sys.stdin.fileno())
                while True:
                    key = sys.stdin.read(1)
                    # Enter (10 or 13) or Escape (27)
                    if ord(key) in (10, 13, 27):
                        break
            finally:
                # Restore terminal settings
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
