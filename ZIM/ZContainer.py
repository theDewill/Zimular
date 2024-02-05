from .output_table import System_Output

ContainerPool = {}

class IContainer:

    def __init__(self, env, simpy_container, name, ):
        self.env = env
        self.container = simpy_container
        self.name = name
        self.capacity = simpy_container.capacity
        self.put_output = []    # [put_time, put_amount, level(after), entity]
        self.get_output = []    # [get_time, get_amount, level(after), entity]
        ContainerPool[name] = self
    def put(self, amount, entity="unknown"):
        '''
        put amount of items into container
        '''
        entity = entity_name(entity)

        self.container.put(amount)
        self.update_put_output(amount, entity)
        self.system_table_append( entity=entity, activity="put")

    def get(self, amount, entity="unknown"):
        '''
        get amount of items from container
        '''
        entity = entity_name(entity)

        self.container.get(amount)
        self.update_get_output(amount, entity)
        self.system_table_append( entity=entity, activity="get")

    def level(self):
        '''
        returns the current level of the container
        '''
        return self.container.level

    def update_put_output(self, amount, entity):
        if entity == "unknown":
            self.put_output.append(
                [self.env.now, amount, self.container.level]
            )
        else:
            self.put_output.append(
                [self.env.now, amount, self.container.level, entity]
            )

    def update_get_output(self, amount, entity):
        if entity == "unknown":
            self.get_output.append(
                [self.env.now, amount, self.container.level]
            )
        else:
            self.get_output.append(
                [self.env.now, amount, self.container.level, entity]
            )

    def system_table_append(self, entity, activity: str):
        """
        Appends the system output table.
        """
        System_Output.append([
            str(self.env.now),
            str(entity),
            str(self.name),
            activity,
            f'container_level={str(self.container.level)}'
        ])

def entity_name(entity) -> str:
    if entity == "unknown":
        return "unknown"
    else:
        return f'{entity["type"]}_{entity["id"]}'