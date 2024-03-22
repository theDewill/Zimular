import json
import httpx
import asyncio
import websockets as wb
import sys
import os
import subprocess as sb


async def send_handshake(url,user_id):
    async with httpx.AsyncClient() as client:
        response = await client.post(url,json={"user_id": user_id})
        return  response.text
        #TODO: this will happen inside the socket
        

async def socket_connect(url,u_id):
    
    WBjson  = await send_handshake(url,u_id)
    WBdata = json.loads(WBjson)
    
    async with wb.connect(WBdata['webUri'].strip()) as websocket:
        with open("/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/Framework/ZIM/API/MultiAPI/ModelApi/JSON/startup.json", "r") as file:
                    data = json.load(file)
                    #response = await websocket.send(json.dumps(data))
                    #return response.text
                    await websocket.send(json.dumps({"type": "calib" ,"uid" : u_id, "content" : data}))

        
        
        while True:
            
            response = await websocket.recv()
            
            json_reponse = json.loads(response)
            #TODO: Temp testngs-- Remoce this once tested
            print(json_reponse)

            if json_reponse['type'] == "calib":
                #TODO: yet to be implemented [UNCOMMENT]
                print("calib recieved")
                
            elif json_reponse['type'] == "data":
                #TODO: yet to be implemented [UNCOMMENT]
                file_name = json_reponse["file_name"]
                out_file_name = file_name[file_name.find('_'):]
                
                #with open(f"/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/ZIM/API/MultiAPI/ModelApi/JSON/recieved/{file_name}.json", "a") as file:

                with open(f"/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/ZIM/API/MultiAPI/ModelApi/JSON/recieved/inputs.json", "w") as file:
                    json.dump(json_reponse, file)
                    print("Got the input file and saved")

                #TODO: replace this with the actual engine from appa
                os.system("python3 /Users/nominsendinu/DEWILL/CODE/Projects/Zimular/ZIM/API/engineClone.py")
                # #zim engine starts and aftr generating output json in outputs
                with open(f"/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/ZIM/API/MultiAPI/ModelApi/JSON/outputs/outputs.json", "r") as outfile:
                    send_package = {
                        "type" : "data",
                        "file_name" : out_file_name,
                        "uid" : json_reponse["uid"],
                        "sid" : json_reponse["sid"],
                        "content" : {
                             "rawData" : json.load(outfile),
                             "overview": json.load()},
                    }
                    await websocket.send(json.dumps(send_package))
                    print("output file sent via Socket")


            elif json_reponse['type'] == "outreq":
                 #TODO: yet to add the mongo querying and sending the file
                trigger_key = json_reponse["trigger_key"]
                


                print("output request recieved")


                
                

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
    
#sys.argv[1]

#TODO: check ignite command
#argument must be the url path in node server which return sokcet ur and process the sent json 
asyncio.get_event_loop().run_until_complete(socket_connect('http://localhost:3005/handshake',1))



