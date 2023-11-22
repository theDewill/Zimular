import sys,os

grandparent_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utility'))
print(grandparent_path)
sys.path.append(grandparent_path)
from entityImporter import ImportFiles

impo = ImportFiles('../app/Metrics')

print(impo[0])