import sys,os

grandparent_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utility'))
print(grandparent_path)
sys.path.append(grandparent_path)
from entityImporter import ImportFiles


def Dec(func):
    def inner(*args,**kwargs):
        print("Before Function")
        func(34)
        print("After Function")
    return inner

@Dec
def test(*arg):
    print(f"inside test{arg[0]}")

test()

# impo = ImportFiles('../app/Metrics')

