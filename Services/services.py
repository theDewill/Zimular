import os,sys
grandparent_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utility'))
print(grandparent_path)
sys.path.append(grandparent_path)
from entityImporter import ImportFiles

metrics = ImportFiles('../app/Metrics')

class MonitorData:
    def __init__(self,rid):
        self.id = rid
        self.report = metrics[0].report
#prepare monitoring set