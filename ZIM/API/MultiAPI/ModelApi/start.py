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
        await websocket.send(json.dumps({"type": "init" ,"uid" : u_id}))
        while True:
            response = await websocket.recv()
            json_reponse = json.loads(response)
            #TODO: Temp testngs-- Remoce this once tested
            print(json_reponse)

            if json_reponse['type'] == "calib":
                with open("/Users/nominsendinu/DEWILL/CODE/Projects/MultiAPI/ModelApi/JSON/startup.json", "r") as file:
                    data = json.load(file)
                    response = await websocket.send(json.dumps(data))
                    return response.text
                
            elif json_reponse['type'] == "data":
                #TODO: yet to be tested
                file_name = json_reponse["file_name"]
                with open(f"/Users/nominsendinu/DEWILL/CODE/Projects/MultiAPI/ModelApi/JSON/recieved/{file_name}.json", "a") as file:
                    json.dump(json_reponse, file)
                    print("--file saved--")

                os.system("zim engine start cmd")
                #zim engine starts and aftr generating output json in outputs
                with open(f"/Users/nominsendinu/DEWILL/CODE/Projects/MultiAPI/ModelApi/JSON/outputs/{file_name}.json", "r") as outfile:
                    data = json.load(outfile)
                    await websocket.send(json.dumps(data))
                    print("output file sent")
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
asyncio.get_event_loop().run_until_complete(socket_connect('http://localhost:8009/handshake',123))



