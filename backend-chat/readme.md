# How to run

```sh
conda create --name mi_entorno python=3.11.11
conda mi_entorno
pip install torch numpy==1.26.4 tqdm==4.67.1 scikit-learn=1.6.1 scikit-learn=1.6.1 transformers==4.30.0

uvicorn main:app --host 0.0.0.0 --port 8000
python main.py
```
