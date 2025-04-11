
from fastapi import FastAPI
from pydantic import BaseModel
from model1 import responseFromModel  # Importar la función desde utils.py
import pickle
from transformers import GPT2LMHeadModel, AutoTokenizer
import os
from fastapi.middleware.cors import CORSMiddleware

import torch


# Carga modelo2
paquete = pickle.load(open("./models/analisis_sentimientos/v1/modelo_completo.pkl", "rb"))
# Separar el modelo y el vectorizador
modelo2 = paquete["modelo"]
vectorizador2 = paquete["vectorizador"]

# Carga modelo3
model3path = os.path.join("./models/model_gpt_custom_v1")
model3 = GPT2LMHeadModel.from_pretrained(model3path)
tokenizer = AutoTokenizer.from_pretrained(
    model3path,
    bos_token='<|startoftext|>',
    eos_token='<|endoftext|>',
    pad_token='<|pad|>'
)
device = torch.device("cpu")
model3.to(device)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las URLs
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
)
class InputText(BaseModel):
  text: str
  

# Endpoint que recibe datos por POST y devuelve un objeto
#curl -X 'POST' 'http://127.0.0.1:8000/model1/' -H 'Content-Type: application/json' -d '{"name": "Laptop", "price": 1200.50, "quantity": 2}'
#curl -X 'POST' 'http://127.0.0.1:8000/model1/' -H 'Content-Type: application/json' -d '{"name": "Las tortugas son animales mamiferos que viv"}'
@app.post("/model0/")
async def create_item(item: InputText):
  response = await responseFromModel(item.text)
  print("--------------"+response+"--------------")
  return {
    "response": response
  }
  
  
#curl -X 'POST' 'http://127.0.0.1:8000/model2/' -H 'Content-Type: application/json' -d '{"text": "Los hábitos alimenticios de las tortugas de caja orientales puede variar mucho debido al gusto de cada una, la temperatura, la iluminación y su entorno. A diferencia de los animales de sangre caliente su metabolismo no maneja el hambre, solo puede disminuir su nivel de actividad, retirarse a sus caparazones y detener el consumo de alimentos hasta que surjan mejores condiciones. En la naturaleza las tortugas de caja del este son oportunistas omnívoras y se alimentan de una variedad de materia animal y vegetal. Hay una variedad de alimentos que son universalmente aceptados por las tortugas de caja del este, que incluyen gusanos, caracoles, escarabajos, orugas, hierbas, fruta caída, bayas, hongos, flores, el pasto de malas hierbas, y el carrión. Estudios en los humedales de la bahía de Maryland también han demostrado que las tortugas de caja del este se han alimentado de aves vivas que estaban atrapadas en redes. Muchas veces, van a comer un trozo de comida, sobre todo en cautividad, solo porque ven y huelen a comestibles, como hamburguesas o huevos, aunque el alimento puede ser nocivo o no saludable. También se sabe que han consumido hongos tóxicos. La evidencia anecdótica sugiere que los recién nacidos de tortugas de caja son más carnívoros que sus subadultos y adultos. No hay todavía ninguna evidencia concreta para apoyar esta teoría."}'
@app.post("/model1/")
async def create_item(input: InputText):
  
  X_nuevos = vectorizador2.transform([input.text])
  predicciones = modelo2.predict(X_nuevos)
  
  # Diccionario de ejemplo
  categories = {
    1:"habbit",
    2:"appearance",
    3:"mating",
  }
  
  return {"response": "Este texto es de tipo: " + categories[predicciones[0]]}



#curl -X 'POST' 'http://127.0.0.1:8000/model3/' -H 'Content-Type: application/json' -d '{"text": "¿ cual es el habitat de los mamiferos ?"}'
@app.post("/model2/")
async def create_item(input: InputText):
  model3.eval()
  generated = torch.tensor(tokenizer.encode(input.text)).unsqueeze(0)
  generated = generated.to(device)
  sample_outputs = model3.generate(
    generated,
    do_sample=True,
    top_k=50,
    top_p=0.95,
    max_length = 300,
    num_return_sequences=8
  )
  respuesta = tokenizer.decode(sample_outputs[0], skip_special_tokens=True)
  
  print("-------"+respuesta+"-------")  
  
  return {"response":respuesta}


