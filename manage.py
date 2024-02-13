import sys
import os

SAVE_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sim_db")

def main():
    arg = sys.argv[1]

    print(arg)

if __name__ == "__main__":
    main()