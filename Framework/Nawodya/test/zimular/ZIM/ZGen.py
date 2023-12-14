# Path: zimular/ZIM/ZResource.py

class EntityGenerator:
    def __init__(self, env, workflow, name_prefix="Customer"):
        self.env = env
        self.name_prefix = name_prefix
        self.workflow = workflow
        self.entity_count = 0

    def generate_entity(self):
        entity_name = f"{self.name_prefix}_{self.entity_count}"
        entity = self.workflow(self.env, entity_name)
        self.entity_count += 1
        return entity
