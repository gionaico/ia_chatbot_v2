class CharRNN(torch.nn.Module):
def **init**(self, input_size, embedding_size=128, hidden_size=256, num_layers=2, dropout=0.2):
super().**init**()
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

torch @ https://download.pytorch.org/whl/cu124/torch-2.5.1%2Bcu124-cp311-cp311-linux_x86_64.whl

# How to run

```sh
conda create --name mi_entorno python=3.11.11
conda activate my_chat
pip install torch numpy==1.26.4 tqdm==4.67.1 scikit-learn=1.6.1
pip install scikit-learn=1.6.1 transformers==4.30.0
pip uninstall transformers
uvicorn main:app --host 0.0.0.0 --port 8000
python main.py
```
