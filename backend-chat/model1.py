import torch
import string

all_characters = string.printable + "ñÑáÁéÉíÍóÓúÚ¿¡"

def predict(model, X):
  model.eval()
  with torch.no_grad():
      X = torch.tensor(X).to(device)
      pred = model(X.unsqueeze(0))
      return pred
      
class Tokenizer():

  def __init__(self):
    self.all_characters = all_characters
    self.n_characters = len(self.all_characters)

  def text_to_seq(self, string):
    seq = []
    for c in range(len(string)):
        try:
            seq.append(self.all_characters.index(string[c]))
        except:
            continue
    return seq

  def seq_to_text(self, seq):
    text = ''
    for c in range(len(seq)):
        text += self.all_characters[seq[c]]
    return text



class CharRNN(torch.nn.Module):
  def __init__(self, input_size, embedding_size=128, hidden_size=256, num_layers=2, dropout=0.2):
    super().__init__()
    self.encoder = torch.nn.Embedding(input_size, embedding_size)
    self.rnn = torch.nn.LSTM(
        input_size=embedding_size,
        hidden_size=hidden_size,
        num_layers=num_layers,
        dropout=dropout,
        batch_first=True)
    self.fc = torch.nn.Linear(hidden_size, input_size)

  def forward(self, x):
    x = self.encoder(x)
    x, h = self.rnn(x)
    y = self.fc(x[:,-1,:])
    return y
  
  def predict(model, X):
    model.eval()
    with torch.no_grad():
        X = torch.tensor(X).to(device)
        pred = model(X.unsqueeze(0))
        return pred

tokenizer = Tokenizer()
tokenizer.n_characters
      
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = CharRNN(input_size=tokenizer.n_characters)
model.load_state_dict(
  torch.load(
    'models/charRNN.pth',
    map_location=device
  )
)
model.to(device)
model.eval()


async def responseFromModel(text):
  
  for i in range(100):
    X_new_encoded = tokenizer.text_to_seq(text[-100:])
    y_pred = predict(model, X_new_encoded)
    y_pred = torch.argmax(y_pred, axis=1)[0].item()
    text += tokenizer.seq_to_text([y_pred])

  print(text)  
  return text

# py 3.11.11
# 
# torch @ https://download.pytorch.org/whl/cu124/torch-2.5.1%2Bcu124-cp311-cp311-linux_x86_64.whl
# Cuando nacen h      