import zimdb
import random
from typing import List, Union

DBNAME = "SimulationDB"
SETNAME = "SimulationSet"
TABLENAME = "SimulationTable1"
MONGO_URI = "mongodb://localhost:27017/"


class DataManager:

    """
    This class is used to manage the data and send it to the database.
    This written in rust using pyo3.so the zimdb library is used to send the data to the database.

    """

    def __init__(self, dbname, setname, tablename, uri):
        self.dbname = dbname
        self.setname = setname
        self.table = tablename
        self.uri = uri
        self.data = zimdb.ZimDB(self.dbname, self.setname, self.uri, self.table)

    def add_data(
        self,
        time: Union[int, float],
        componet_cat: str,
        componet_name: str,
        action: str,
        entity: str,
        metadata: List[List[str]],
    ):
        # need error handling
        self.data.add_data(time, componet_cat, componet_name, action, entity, metadata)

    def send_db(self):
        self.data.senddb()

    def send_table(self):
        self.data.sendtable()

    def test1(self):
        for i in range(1000000):
            self.add_data(
                i,
                random.choice(["resource", "store", "container"]),
                random.choice(["A", "B", "C"]),
                random.choice(["get", "post", "put", "delete"]),
                f"user{i}",
                [["hello", "1"], ["world", "2"]],
            )


ZIMDB = DataManager(DBNAME, SETNAME, TABLENAME, MONGO_URI)

ZIMDB.test1()
ZIMDB.send_db()
ZIMDB.data.sendtablecollection()