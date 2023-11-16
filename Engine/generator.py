#import section to be implemented in generator instantiating ground
from ..utility import entityImporter
entity = entityImporter.ImportEntities('../app/Entity')
resources = entityImporter.ImportEntities('../app/Resources')


class Generator():
    def __init__(imports = [],engine):
        
        pass    