# MIA NLP

La idea de esta practica es crear un chat inspirandose en ChatGPT donde a travez de un frontend, podamos elegir 3 tres modelos diferentes y nos devuelva resultados de un input de texto.

## Crawling Web

La idea es extraer informacion de alguna web para posteriormente utilizarla en los entrenamientos de los diferentes modelos. Para dicho proposito se ha creado un **[script](./crawler/src/index.js)** el cual extrae textos para guardarlos en una **[carpeta](./crawler/textsFromCrawler/)** en formato txt (empleado para entrenamientos de prediccion de texto) y csv (textos etiquetados).

## Modelo CHAR

La intencion que buscamos con este modelo es la prediccion de texto, es decir, al pasarle un input es capaz de devolver como resultado letras que el modelo considera como mas probables para continuar el texto.

- [notebook char colab](https://colab.research.google.com/drive/1oSyWQCV9QiZoqJR7ae0-HZewFTbKoJmy#scrollTo=yfhEHX09b3i_)

- [modelo entrenado](./backend-chat/models/charRNN.pth)

## Analisis de sentimientos

Un modelo de análisis de sentimientos es un tipo específico de modelo de clasificación. Es un tipo de modelo que se enfoca en identificar la carga emocional o la opinión en un texto. Generalmente, predice si un texto es: Positivo, Negativo o Neutral. En este caso se va a intentar que el modelo haga una prediccion de categoria eligiendo una entre 3.

- [notebook char colab](https://colab.research.google.com/drive/1oSyWQCV9QiZoqJR7ae0-HZewFTbKoJmy#scrollTo=f74b5725)

- [modelo entrenado](./backend-chat/models/analisis_sentimientos/)

## Fine-Tuning

El es el proceso de ajustar un modelo previamente entrenado en una nueva tarea o dominio con un conjunto de datos específico. En lugar de entrenar un modelo desde cero (lo que requiere muchos datos y recursos computacionales), se toma un modelo preentrenado y se adapta con datos adicionales.

- [notebook char colab](https://colab.research.google.com/drive/1dqG6LQ2ytLVhlUAYjHVZ0ogHjHqU3tcv#scrollTo=du-BX9HWm-B4)
- [modelo entrenado](./backend-chat/models/model_gpt_custom_v1/)
