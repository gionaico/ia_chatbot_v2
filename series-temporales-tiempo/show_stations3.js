// aemet_script.js

const fs = require('fs');
const Papa  = require('papaparse');


// Constantes de configuración
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnbWMueWFuZXpAZ21haWwuY29tIiwianRpIjoiN2M0ZDc0YWEtODNmNC00ZjdmLWIwN2UtNjg3ZTBhMGE5OWM1IiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE3MzkyOTY4OTYsInVzZXJJZCI6IjdjNGQ3NGFhLTgzZjQtNGY3Zi1iMDdlLTY4N2UwYTBhOTljNSIsInJvbGUiOiIifQ.hd671xPW0ykj1E1LdG3l7SNWNjYDv4OhHqnkUCtpecw";
const BASE_URL = "https://opendata.aemet.es/opendata/api/valores/climatologicos/diarios/datos/";
const ESTACIONES = [ 
  "7012C" /*cartagena*/, 
  "7209" /*lorca*/, 
  "7178I"/*murcia*/, 
  "7031" /*san javier aeropuerto */, 
  //"8018X" /*moratalla*/
];
const START_DATE = new Date("1999-11-29"); //"2024-01-01"
const END_DATE = new Date("2025-02-11");


/**
 * Formatea un objeto Date al formato "YYYY-MM-DD"
 * @param {Date} date 
 * @returns {string}
 */
function formatDate(date) {
    const year = date.getFullYear();
    // Los meses en JS van de 0 a 11, por ello se suma 1
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Función para "dormir" un determinado número de milisegundos.
 * @param {number} ms - milisegundos a esperar.
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Función asíncrona para obtener datos de la API de AEMET para un intervalo de fechas y una estación.
 * Construye la URL en función de los parámetros, realiza la primera solicitud, y si la respuesta
 * contiene la propiedad "datos", realiza una segunda solicitud para obtener el JSON real.
 * 
 * @param {Date} start - Fecha de inicio.
 * @param {Date} end - Fecha de fin.
 * @param {string} estacion - Indicativo de la estación.
 * @returns {Promise<any[]|null>} - Devuelve un array de datos o null en caso de error.
 */
async function fetchData(start, end, estacion) {
    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);
    // Se codifica la fecha con la hora fija T00:00:00UTC (nota: se usan códigos URL para los dos puntos)
    const url = `${BASE_URL}fechaini/${formattedStart}T00:00:00UTC/fechafin/${formattedEnd}T00:00:00UTC/estacion/${estacion}`;

    console.log({url},`Fetching data from ${formattedStart} to ${formattedEnd} for station ${estacion}...`);

    const headers = {
        "accept": "application/json",
        "api_key": API_KEY
    };
    
    try {
        const response = await fetch(url, { headers });
        
        if (response.ok) {
          const data = await response.json();
          //console.log("data---",{data});
            if (data.datos) {
                const dataUrl = data.datos;
                const dataResponse = await fetch(dataUrl);
                if (dataResponse.ok) {
                    const jsonData = await dataResponse.json();
                    return jsonData;
                } else {
                    console.error(`Error al obtener datos desde ${dataUrl}: ${dataResponse.statusText}`);
                }
            } else {
                console.error("La respuesta no contiene la propiedad 'datos'.");
            }
        } else {
            console.error(`Error en la solicitud: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error en fetchData:", error);
    }
    return null;
}

/**
 * Función asíncrona para obtener los datos de una estación en intervalos de 180 días,
 * concatenar los resultados y guardarlos en un fichero JSON.
 * 
 * @param {string} estacion - Indicativo de la estación.
 */
async function getDataForStation(estacion) {
    let results = [];
    let currentStart = new Date(START_DATE);

    while (currentStart < END_DATE) {
        // Calcular la fecha final del intervalo (máximo 180 días)
        let currentEnd = new Date(currentStart.getTime() + 180 * 24 * 3600 * 1000);
        
        //console.log({currentEnd});
        
        if (currentEnd > END_DATE) {
            currentEnd = new Date(END_DATE);
        }
        
        const dataArray = await fetchData(currentStart, currentEnd, estacion);
        
        if(dataArray && dataArray.length )
          while (dataArray.length) {
            const data = dataArray.shift()
          
            // results = results.concat(data);
            const row = [
              data.nombre,
              new Date(data.fecha),
              parseFloat(data.tmed) || null,
              parseFloat(data.prec || 0)|| 0
            ];           
            //console.log(typeof data, row, data) 
            // Convertimos la fila a CSV y escribimos en el archivo
            const csvLine = Papa.unparse([row]);

            fs.appendFileSync(
              "./temperaturas.csv", 
              "\r\n" + csvLine,
              'utf8'
            );
        
          
          }
        else
          console.log(typeof dataArray, dataArray);

        // Espera 1 segundo entre solicitudes
        await sleep(1000);
        // Avanza al día siguiente después de currentEnd
        currentStart = new Date(currentEnd.getTime() + 24 * 3600 * 1000);
    }
    
    // Guardar los datos en un fichero JSON
    // const filename = `aemet_data_${estacion}.json`;
    // console.log(results)
    // fs.writeFileSync(filename, JSON.stringify(results, null, 4), 'utf8');
    // console.log(`Datos guardados en ${filename}`);
}

/**
 * Función principal que gestiona la obtención de datos para todas las estaciones.
 * Se limita la concurrencia a 3 tareas a la vez.
 */
async function getData() {
    let index = 0;
    console.log("-----------")
    while (index < ESTACIONES.length) {
        // Se crea un lote (batch) de hasta 3 estaciones
        const batch = ESTACIONES.slice(index, index + 4)
        
        //console.log("batch",{batch});

        await getDataForStation(batch)

        
//        await Promise.all(batch);
        index += 3;
    }
}

// Ejecuta la función principal
getData();
