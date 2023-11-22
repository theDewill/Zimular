grandparent_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utility'))
print(grandparent_path)
sys.path.append(grandparent_path)
from entityImporter import ImportEntities

metrics = ImportEntities('../app/Metrics')

class MonitorData:
    def __init__(self,rid):
        self.id = rid
        self.report = metrics[0]
#prepare monitoring set