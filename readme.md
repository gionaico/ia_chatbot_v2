# MIA NLP

La idea de esta práctica es crear un chat inspirándose en ChatGPT donde a través de un frontend, podamos elegir tres modelos diferentes y nos devuelva resultados de un input de texto.

## Indice

1. [Introducción](#mia-nlp)
2. [Crawling Web](#crawling-web)
   - [Script de extracción](./crawler/src/index.js)
   - [Textos generados](./crawler/textsFromCrawler/)
3. [Modelo CHAR](#modelo-char)
   - [Notebook en Colab](https://colab.research.google.com/drive/1oSyWQCV9QiZoqJR7ae0-HZewFTbKoJmy#scrollTo=yfhEHX09b3i_)
   - [Modelo entrenado](./backend-chat/models/charRNN.pth)
4. [Análisis de Sentimientos](#analisis-de-sentimientos)
   - [Notebook en Colab](https://colab.research.google.com/drive/1oSyWQCV9QiZoqJR7ae0-HZewFTbKoJmy#scrollTo=f74b5725)
   - [Modelo entrenado](./backend-chat/models/analisis_sentimientos/)
5. [Fine-Tuning](#fine-tuning)
   - [Notebook en Colab](https://colab.research.google.com/drive/1dqG6LQ2ytLVhlUAYjHVZ0ogHjHqU3tcv#scrollTo=du-BX9HWm-B4)
   - [Modelo entrenado](./backend-chat/models/model_gpt_custom_v1/)
6. [Chatbot Web](#chatbot-web)
   - [Interfaz en ReactJS](./frontend/)
   - [Demo Modelo CHAR](./videos/chartModel.mp4)
   - [Demo Análisis de Sentimientos](./videos/SentimentsModel.mp4)
   - [Demo Fine-Tuning](./videos/Gp2FineTuningModel.mp4)

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

## Chatbot web

En el siguiente apartado se muestra como funciona la interacion desde un panel web creado con [REACTJS](./frontend/)

- [Modelo CHAR](./videos/chartModel.mp4)

- [Analisis de sentimientos](./videos/SentimentsModel.mp4)

- [Fine-Tuning](./videos/Gp2FineTuningModel.mp4)
