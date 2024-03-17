import os,json

with open("/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/ZIM/API/MultiAPI/ModelApi/JSON/recieved/inputs.json", "r") as file:
    data = json.load(file)
    with open("/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/ZIM/API/MultiAPI/ModelApi/JSON/outputs/outputs.json", "w") as outfile:
        json.dump(data, outfile)
        print(" output file saved [Engine]")
    
