import zimdb
import random
from typing import List, Union
import pprint
import json

DBNAME = "SimulationDB"
SETNAME = "SimulationSet"
TABLENAME = "SimulationTable2"
MONGO_URI = "mongodb://localhost:27017"
BUFFER_SIZE = 1000
# "mongodb+srv://antiloger:077antiloger@cluster0.i9knr5x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


class ComponetInfo:
    def __init__(self) -> None:
        self.get_data = []
        self.put_data = []
        self.post_data = []

    def show_table(self):
        pprint.pprint(f"get ->> {self.get_data}")
        pprint.pprint(f"put ->> {self.put_data}")
        pprint.pprint(f"post ->> {self.post_data}")


class DataManager:

    """
    This class is used to manage the data and send it to the database.
    This written in rust using pyo3.so the zimdb library is used to send the data to the database.

    """

    def __init__(self, dbname, setname, tablename, uri, buffer_size):
        self.dbname = dbname
        self.setname = setname
        self.table = tablename
        self.uri = uri
        self.buffer_size = buffer_size
        self.data = zimdb.ZimDB(
            self.dbname, self.setname, self.uri, self.table, self.buffer_size
        )
        print("DB connected ..............................")

    def add_data(
        self,
        time: Union[int, float],
        componet_cat: str,
        componet_name: str,
        action: str,
        entity: Union[str, None],
        info: Union[int, float, None],
        metadata: Union[List[List[str]], None],
    ):
        '''
        This function is used to add data to the buffer.
        '''

        # print(time, componet_cat, componet_name, action, entity, info, metadata)
        # need error handling
        self.data.add_data(
            time, componet_cat, componet_name, action, entity, info, metadata
        )

    def add_workflow(self, workflow: str):
        '''
        This function is used to add the workflow to the buffer.
        '''
        self.data.add_workflow(workflow)

    def add_com_to_workflow(self, workflow: str, com_cat: str, componet: str):
        '''
        This function is used to add the componet to the workflow.

        '''

        #print(type(workflow), type(com_cat), type(componet))
        self.data.addcomp_toworkflow(workflow, componet, com_cat)   

    def send_db(self):
        '''
        This function is used to send the data to the database.
        '''

        self.data.senddb()

    def send_table(self):
        self.data.sendtable()

    def uptable(self):
        self.data.sendtablecollection()

    def get_comp_data(self, component: str) -> ComponetInfo:
        comp = ComponetInfo()
        comp.get_data = self.data.getcomp(component, "get")
        comp.put_data = self.data.getcomp(component, "put")
        comp.post_data = self.data.getcomp(component, "post")

        return comp
    
    def save_entity(self, entity: str, count: int):
        self.data.add_entity_to_db(entity, count)

    def testroute(self):
        print(self.data.getcomp("Modeling_Machien_0", "enter"))

    def test1(self):
        for i in range(100):
            self.add_data(
                i,
                random.choice(["resource", "store", "container"]),
                random.choice(["A", "B", "C"]),
                random.choice(["get", "post", "put"]),
                f"user{i}",
                random.choice([1, 2, 3, 4, 5]),
                None,
            )

class QueryManger:
    def __init__(self, dbname, setname, tablename, uri):
        self.dbname = dbname
        self.setname = setname
        self.table = tablename
        self.uri = uri

class APIQueryManager:
    def __init__(self, dbname, setname, tablenamecoll, uri):
        self.dbname = dbname
        self.setname = setname
        self.tablecoll = tablenamecoll
        self.uri = uri
        self.data = zimdb.QueryDB(self.uri, self.setname, self.dbname, self.tablecoll)

    def overview_json(self, simulation_name: str) -> dict:
        total_time = self.data.last_element_time()
        workflow_json = json.loads(self.data.get_workflow_details(simulation_name))
        entity_json = json.loads(self.data.get_entity_info(simulation_name))
        avg_entity_time = self.data.avg_entity_time(simulation_name)
        chart1 = self.data.get_component_count(simulation_name)
        overview_table = self.data.get_comp_name_cat_workflow(simulation_name)

        final_json = {
            "details": {
                "simulation_name": simulation_name,
                "total_time": total_time,
                "avg_entity_time": avg_entity_time,
            },
            "workflow_table": workflow_json,
            "entity_table": entity_json,
            "chart_1": chart1,
            "chart_2":"none",
            "overview_table": overview_table
        }

        return final_json        

ZIMDB = DataManager(DBNAME, SETNAME, TABLENAME, MONGO_URI, BUFFER_SIZE)
