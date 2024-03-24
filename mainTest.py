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

from ZIM.output_table import System_Output
import simpy
from Genarator import customer_generator
import json
import httpx
import asyncio
import websockets as wb
import sys
import os
import subprocess as sb
#from zimdb.ts import ZIMDB
from ZIM.ZComponets import componet_handler
from ZIM.ZDB import ZIMDB,APIQueryManager
import pprint


env = simpy.Environment()

def output():
    pass

def run_simulation():
    env.process(customer_generator(env=env))
    env.run()
    print("Simulation done.")

def initiate():
    run_simulation()
    #TODO: uptp here WORKING------------
    #System_Output.show_table()
    ZIMDB.uptable()
    ZIMDB.send_db()
    print("+++++++++++++++++++++++++++++++++++++")
    #ZIMDB.testroute()
    componet_handler.show_data()

async def send_handshake(url,user_id):
    async with httpx.AsyncClient() as client:
        response = await client.post(url,json={"user_id": user_id})
        return  response.text
        #TODO: this will happen inside the socket
        

async def socket_connect(url,u_id):
    
    WBjson  = await send_handshake(url,u_id)
    WBdata = json.loads(WBjson)
    
    async with wb.connect(WBdata['webUri'].strip()) as websocket:

        apiManager = APIQueryManager(DBNAME, SETNAME, CONFIG.sim_table_name, MONGO_URI)
        # with open("/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/Framework/ZIM/API/MultiAPI/ModelApi/JSON/startup.json", "r") as file:
        #             data = json.load(file)
        #             #response = await websocket.send(json.dumps(data))
        #             #return response.text
        #             await websocket.send(json.dumps({"type": "calib" ,"uid" : u_id, "content" : data}))
        await websocket.send(json.dumps({"type": "calib" ,"uid" : u_id, "content" : CONFIG.input_struct}))

        while True:
            
            response = await websocket.recv()

            json_reponse = json.loads(response)
            #TODO: Temp testngs-- Remoce this once tested
            pprint.pprint(json_reponse)

            if json_reponse['type'] == "calib":
                #TODO: yet to be implemented [UNCOMMENT]
                print("calib recieved")

            elif json_reponse['type'] == "subreq":
                
                if json_reponse["func"] == "component":

                    send_package = {
                            "type" : "subreq",
                            "uid" : json_reponse["uid"],
                            "sid" : json_reponse["sid"],
                            "func" : json_reponse["func"],
                            "content" : {
                                #  "rawData" : json.load(outfile),
                                "component": apiManager.get_all_component(CONFIG.sim_table_name)},
                        }
                elif json_reponse["func"] == "onecomponent":

                    if (json_reponse["category"] == "resources"):
                        send_package = {
                            "type" : "subreq",
                            "uid" : json_reponse["uid"],
                            "sid" : json_reponse["sid"],
                            "func" : json_reponse["func"],
                            "content" : {
                                #  "rawData" : json.load(outfile),
                                "onecomponent": apiManager.resource_overview(json_reponse["compname"])},
                        }
                    
                    elif (json_reponse["category"] == "container"):

                        send_package = {
                                "type" : "subreq",
                                "uid" : json_reponse["uid"],
                                "sid" : json_reponse["sid"],
                                "func" : json_reponse["func"],
                                "content" : {
                                    #  "rawData" : json.load(outfile),
                                    "onecomponent": apiManager.container_overview(json_reponse["compname"])},
                            }
                        
                    elif (json_reponse["category"] == "store"):
                        send_package = {
                                "type" : "subreq",
                                "uid" : json_reponse["uid"],
                                "sid" : json_reponse["sid"],
                                "func" : json_reponse["func"],
                                "content" : {
                                    #  "rawData" : json.load(outfile),
                                    "onecomponent": apiManager.store_overview(json_reponse["compname"])},
                            }
                    else:
                        print("Invalid category")
                        return False
                
                else :

                        #TODO: here formData comes as a paramter .....
                        formData = json_reponse['formData']
                        print("form Data is : ",formData)
                        send_package = {
                                "type" : "subreq",
                                "uid" : json_reponse["uid"],
                                "sid" : json_reponse["sid"],
                                "func" : json_reponse["func"],
                                "content" : {
                                    #  "rawData" : json.load(outfile),
                                    "table": apiManager.table_filter(formData['time'],formData['componentCategory'],formData['componentName'],formData['action'],formData['entity'],None)},
                            }

                await websocket.send(json.dumps(send_package))
                print(f"{json_reponse["func"]} output file sent via Socket")
                

            elif json_reponse['type'] == "data":
                #TODO: yet to be implemented [UNCOMMENT]
                file_name = json_reponse["file_name"]
                out_file_name = file_name[file_name.find('_'):]
                
                CONFIG.api_input = json_reponse["content"]
                
                initiate()

                #TODO: complete from here ..............
               
                send_package = {
                        "type" : "data",
                        "uid" : json_reponse["uid"],
                        "sid" : json_reponse["sid"],
                        "content" : {
                            #  "rawData" : json.load(outfile),
                             "overview": apiManager.overview_json(CONFIG.sim_table_name)},
                    }
                await websocket.send(json.dumps(send_package))
                print("overview output file sent via Socket")

            else:
                print("Invalid type")
                return False
            
#command execution

def ignite():
    try:
        command = ["uvicorn", "interface:app", "--reload"]
        result = sb.run(command, capture_output=True, text=True, check=True)
        print(result.stdout)

    except sb.CalledProcessError as e:
        print("Error: ", e.stderr)
        return False
    
# sys.argv[1]

#TODO: check ignite command
#argument must be the url path in node server which return sokcet ur and process the sent json 
asyncio.get_event_loop().run_until_complete(socket_connect('http://localhost:3005/handshake',1))




    
