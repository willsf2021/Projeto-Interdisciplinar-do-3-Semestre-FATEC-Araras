# Conexão e Teste
import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = "mongodb+srv://ant:<PASSWORD>@cluster0.7saq7zc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi('1'))
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    

# Criação do banco de dados
db = client['taco']

# Coleções

with open("grupos_alimentos.json", "r", encoding="utf-8") as f:
    grupos_alimentos_json = json.load(f)

db_alimentos = db.create_collection("grupos_alimentos")
db_alimentos.insert_many(grupos_alimentos_json)

with open("alimentos_geral.json", "r", encoding="utf-8") as f:
    alimentos_geral_json = json.load(f)

db_alimentos = db.create_collection("alimentos_geral")
db_alimentos.insert_many(alimentos_geral_json)

with open("acidos_graxos.json", "r", encoding="utf-8") as f:
    acidos_graxos_json = json.load(f)

db_alimentos = db.create_collection("acidos_graxos")
db_alimentos.insert_many(acidos_graxos_json)

with open("aminoacidos.json", "r", encoding="utf-8") as f:
    aminoacidos_json = json.load(f)

db_alimentos = db.create_collection("aminoacidos")
db_alimentos.insert_many(aminoacidos_json)