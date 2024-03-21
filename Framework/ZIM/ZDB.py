import zimdb
import random
from typing import List, Union
import pprint

DBNAME = "SimulationDB"
SETNAME = "SimulationSet"
TABLENAME = "SimulationTable1"
MONGO_URI = "mongodb://localhost:27017"
BUFFER_SIZE = 10000
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
        # print(time, componet_cat, componet_name, action, entity, info, metadata)
        # need error handling
        self.data.add_data(
            time, componet_cat, componet_name, action, entity, info, metadata
        )

    def send_db(self):
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


ZIMDB = DataManager(DBNAME, SETNAME, TABLENAME, MONGO_URI, BUFFER_SIZE)
