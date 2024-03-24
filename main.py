from settings import INPUT, SAVE_FOLDER, DBNAME, MONGO_URI, SETNAME, TABLENAME, BUFFER_SIZE
from ZIM.config import CONFIG

CONFIG.set_config(
    DBNAME,
    MONGO_URI,
    SETNAME,
    TABLENAME,
    SAVE_FOLDER,
    BUFFER_SIZE,
    INPUT
)
import simpy
from ZIM.ZGen import GENPOOL
from Genarator import customer_generator
from ZIM.ZComponets import componet_handler
from ZIM.ZDB import ZIMDB, QueryManger

env = simpy.Environment()

def output():
    data = QueryManger(
        CONFIG.db_name,
        CONFIG.db_set_name,
        CONFIG.sim_table_name,
        CONFIG.mongo_uri
    )

    data.get_overview()
    data.view_full_dataset()

def run_simulation():
    env.process(customer_generator(env=env))
    env.run(until=10)
    GENPOOL["customer"].save_entity()
    print("Simulation done.")

    
if __name__ == "__main__":
    print("----------------START-----------------")
    

    #run_ready()
    run_simulation()
    #System_Output.show_table()
    ZIMDB.uptable()
    ZIMDB.send_db()
    output()
    print("+++++++++++++++++++++++++++++++++++++")
    #ZIMDB.testroute()
    componet_handler.show_data()

    print("----------------END-----------------")
    
