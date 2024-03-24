# Path: zimular/ZIM/ZResource.py
from ZIM.ZDB import ZIMDB

GENPOOL = {}

class EntityGenerator:
    def __init__(self, env, workflow, entity_format, init_count=0):
        self.env = env
        self.workflow = workflow
        self.entity_format = entity_format
        self.entity_count = init_count
        GENPOOL[self.entity_format["type"]] = self

    def generate_entity(self):
        
        #entity = self.workflow.work(entity=entity_name)
        entity = self.entity_format.copy()
        entity = self.entity_list_check(entity)
        try:
            entity["id"] = self.entity_count
        except KeyError:
            raise KeyError("entity_format must have an id key") 
        
        self.entity_count += 1

        return entity

    def entity_list_check(self, entity_list):

        for key, value in entity_list.items():
            if callable(value):

                if key == "type":
                    raise KeyError("entity_format must not have a type key or not be a callable")
                
                if key == "id":
                    raise KeyError("entity_format must not have an id key or not be a callable")
                
                entity_list[key] = value()

            return entity_list

    def save_entity(self):

        '''
            save the entity to the database
        '''

        ZIMDB.save_entity(self.entity_format["type"], self.entity_count)

    def enter_format(self, priority):
        ent = self.entity_format.copy()
        ent["priority"] = priority
        ent["id"] = self.entity_count
        self.entity_count += 1
        return ent
    

def entity_scrape():
    pass