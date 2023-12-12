import importlib.util as imprt
import os
#from dotenv import load_dotenv
#load_dotenv() 

def ImportFiles(pdir = os.getenv('ENTITYDIR')):

    grandparent_dir = os.path.abspath(os.path.join(os.getcwd(), "Framework/sim1"))
    pdir = os.path.join(grandparent_dir, 'agents')
    print(pdir)

    if os.path.exists(pdir):
        PyList = os.listdir(pdir)
        print(PyList) 
        modules = []
        for pyFile in PyList:
            if pyFile.endswith(".py"):

                module_name = pyFile[:-3]
                module_path = os.path.join(pdir, pyFile)

                spec = imprt.spec_from_file_location(module_name, module_path)
                module = imprt.module_from_spec(spec)
                spec.loader.exec_module(module)
                print(f"File Name: {pyFile}") 
                modules.append(module) 

        return modules   


