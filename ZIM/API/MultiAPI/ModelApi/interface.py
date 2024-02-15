from fastapi import FastAPI

print("we are in interface.py")
app = FastAPI()


@app.get("/")
async def sample():
    print("we got a request")
    return {"message": "Hello World"}