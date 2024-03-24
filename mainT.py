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
from Genarator import customer_generator
from ZIM.ZComponets import componet_handler
from ZIM.ZDB import ZIMDB

env = simpy.Environment()

def output():
    pass

def run_simulation():
    env.process(customer_generator(env=env))
    env.run()
    print("Simulation done.")

    
if __name__ == "__main__":
    print("----------------START-----------------")
    

    #run_ready()
    run_simulation()
    #System_Output.show_table()
    ZIMDB.uptable()
    ZIMDB.send_db()
    print("+++++++++++++++++++++++++++++++++++++")
    #ZIMDB.testroute()
    componet_handler.show_data()

    print("----------------END-----------------")
    
