import sys,os
import simpy as sp
grandparent_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utility'))
print(grandparent_path)
sys.path.append(grandparent_path)
from entityImporter import ImportFiles

#masterResource = ImportFiles('../../Services/services.py')

class hotelCashier(masterResource):
    def __init__(self):
        self.user = None

def setup(self,user):
    self.user = user

