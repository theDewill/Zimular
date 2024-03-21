from ZIM.output_table import System_Output
import simpy
from Genarator import customer_generator
from manage import runReady
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
    
    runReady()
    run_simulation()
    #System_Output.show_table()
    ZIMDB.uptable()
    ZIMDB.send_db()
    print("+++++++++++++++++++++++++++++++++++++")
    #ZIMDB.testroute()
    componet_handler.show_data()

    print("----------------END-----------------")
    
