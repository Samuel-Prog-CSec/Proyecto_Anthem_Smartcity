# Proyecto_Anthem_Smartcity

- `script/cargarDatosAire.js`: Script para procesar y cargar archivos CSV de calidad del aire a MongoDB.
- `models/Aire.js`: Modelo Mongoose que define la estructura de los datos de calidad del aire, con campos y validaciones específicas.
- `README.md`: Documentación del proyecto y uso del script.

---


## Modelos 

### Modelo `Aire`

#### Descripción del Modelo y Estructura

El modelo `Aire` representa los datos de calidad del aire que se extraen de archivos CSV y se almacenan en MongoDB. Este modelo incluye información sobre el origen, la ubicación y una serie de mediciones horarias de calidad del aire, cada una con su respectiva validación.

#### Estructura del Modelo

##### `AireSchema`

El esquema principal, `AireSchema`, se compone de los siguientes campos clave:

- **_id**: Identificador único para cada documento (se genera automáticamente).
- **origen**: Ruta del archivo CSV de origen, útil para rastrear la procedencia de los datos.
- **provincia**, **municipio**, **estacion**: Campos numéricos que representan la ubicación de la estación de muestreo. Las restricciones mínimas y máximas se aplican para asegurar valores coherentes.
- **magnitud**: Tipo de contaminante medido. Este campo utiliza `enum` para limitar los valores permitidos a ciertos números que representan contaminantes específicos.
- **punto_muestreo**: Código de estación con validación de formato usando una expresión regular (`match`), para que cumpla con el formato específico de la estación.
- **ano**, **mes**, **dia**: Fecha del registro de datos, validada para garantizar un rango temporal coherente y prevenir datos futuros incorrectos.
- **horas**: Array de subdocumentos que representa las mediciones horarias del día, implementado con el subesquema `HoraSchema`.

##### `HoraSchema`

`HoraSchema` representa cada medición horaria de calidad del aire para un día específico. Contiene los campos:

- **hora**: Número entero de 1 a 24 que indica la hora del día.
- **valor**: Valor numérico que representa la medición de calidad del aire. Se usa `parseFloat` en el script para soportar decimales, manteniendo la precisión de los datos.
- **validacion**: Este campo solo admite los valores `'V'` o `'N'`, que indican si la medición es válida (`'V'`) o no (`'N'`). Solo se almacenan valores con `'V'` según las especificaciones.

#### Decisiones de Implementación

1. **Filtrado de Validación en la Carga de Datos**: 
   Los datos de calidad del aire solo se almacenan si tienen una validación `'V'`. Esto reduce el volumen de almacenamiento y mejora la eficiencia de consultas futuras, ya que solo se retienen las mediciones válidas.

2. **Uso de Subesquemas**:
   `HoraSchema` está implementado como un subesquema de `AireSchema` para representar las mediciones horarias, facilitando la organización y consulta de datos. Esta estructura permite almacenar múltiples mediciones dentro de un solo documento `Aire`, manteniendo la coherencia y optimizando el espacio.

3. **Restricciones y Validaciones**:
   Se implementaron validaciones para todos los campos, garantizando:
   - Formatos correctos para `punto_muestreo` y el rango de `ano`, `mes`, `dia`.
   - Valores válidos para `magnitud` mediante un `enum`.
   - Limitar `horas` a 24 elementos para asegurar un registro completo por día.
   
   Estas validaciones previenen errores y garantizan la calidad de los datos almacenados.

4. **Índices en MongoDB**:
   Se añadieron índices en los campos `provincia`, `municipio`, `estacion`, `magnitud`, `ano`, `mes` y `dia` para mejorar la velocidad de consulta. Estos campos suelen ser los más consultados en operaciones de filtrado y análisis de datos, y los índices optimizan estas consultas en grandes volúmenes de datos.

5. **Uso de Campos de Timestamps**:
   Los campos `createdAt` y `updatedAt` se generan automáticamente mediante `timestamps: true`, lo que permite un registro temporal de cada documento para facilitar auditorías y trazabilidad.

En conjunto, estas decisiones aseguran que el modelo `Aire` sea flexible, eficiente y optimizado para almacenar grandes volúmenes de datos de calidad del aire, manteniendo una estructura coherente y validaciones robustas.


## Scripts

### Script de Carga de Datos de Aire

#### Descripción General

El script `cargarDatosAire.js` es responsable de procesar los archivos CSV de calidad del aire ubicados en la carpeta `"Aire"` y almacenar la información en MongoDB siguiendo la estructura definida en el modelo `Aire`. Este script carga múltiples archivos CSV, procesando únicamente las horas que tengan validación `'V'` para evitar registros de datos no válidos.

#### Funciones Principales

##### `loadCSV(filePath)`

La función `loadCSV` se encarga de leer un archivo CSV específico y cargar sus datos en MongoDB. Esta función:
- **Filtra y carga las horas válidas**: Procesa únicamente los registros de horas donde la validación (`Vx`) es `'V'`, asegurando que solo se almacenen datos confiables.
- **Estructura los datos de cada fila**: Crea un objeto `Aire` para cada registro de fila, incluyendo la información de ubicación, fecha, magnitud, y las horas válidas con sus valores.
- **Maneja errores**: Captura y maneja errores tanto en la lectura del archivo como en la inserción en MongoDB para asegurar la estabilidad del proceso de carga.

##### `loadAllCSVFiles(dirPath)`

La función `loadAllCSVFiles` itera sobre todos los archivos en la carpeta "Aire", invocando loadCSV para cada archivo. Este proceso es sincrónico, procesando un archivo a la vez para evitar sobrecargar el sistema y MongoDB.

#### Decisiones de Implementación

1. **Filtrado de Validación en el Proceso de Carga**: 
    Solo se procesan los datos de las horas que tengan validación 'V', conforme a los requisitos. Esto mejora el rendimiento y minimiza el almacenamiento, al enfocarse únicamente en datos confiables.

2. **Manejo Asíncrono y Promesas**: 
    Cada fila procesada se guarda en MongoDB como una promesa dentro de savePromises. Al final de la lectura de cada archivo (.on('end')), se espera a que todas las promesas save() se completen usando Promise.all(). Esto asegura que el archivo se haya procesado completamente antes de continuar con el siguiente.

3. **Proceso Secuencial para la Carga de Archivos**: 
    La función loadAllCSVFiles usa await para procesar un archivo a la vez, lo que reduce el uso intensivo de recursos y asegura que MongoDB pueda manejar cada archivo de forma estable. Este enfoque secuencial previene problemas de carga y fallos de red debido a un exceso de conexiones concurrentes.

4. **Desconexión Segura de MongoDB**: 
    El bloque finally en loadAllCSVFiles se asegura de desconectar MongoDB al finalizar el procesamiento de todos los archivos, evitando conexiones abiertas y posibles pérdidas de rendimiento.

5. **Registro del Archivo de Origen**: 
    Se guarda la ruta de cada archivo de origen en el campo origen del documento Aire, permitiendo identificar la fuente de cada registro. Esto es útil para auditorías o para reanudar procesos en caso de interrupciones.

#### Mejoras de Implementación

Uso de async y await:
La función loadCSV es ahora async y utiliza await para manejar las promesas de guardado.
La función loadAllCSVFiles también es async y utiliza await para esperar a que cada archivo se procese completamente antes de seguir con el siguiente.
Manejo de Errores:
Se manejan los errores en todas las promesas y operaciones asíncronas.
Se asegura de que la desconexión de MongoDB se realice correctamente incluso si ocurre un error.
Optimización de Promesas:
Se utiliza Promise.all para manejar múltiples promesas de guardado de manera eficiente.

---

Permitir que se realice la ingesta de varios archivos CSV a la vez puede mejorar significativamente el rendimiento, especialmente si tienes muchos archivos CSV que procesar. Para lograr esto, puedes usar Promise.all para procesar todos los archivos en paralelo.
Procesamiento en Paralelo:
Se utiliza Promise.all para procesar todos los archivos CSV en paralelo.
files.map crea una promesa para cada archivo CSV y las almacena en loadPromises.
Manejo de Errores:
Cada promesa de carga maneja sus propios errores y los registra en la consola.

---

Para optimizar la lectura de archivos CSV grandes y la inserción de datos en MongoDB, puedes considerar las siguientes estrategias:
Lectura en Streaming: Ya estás utilizando fs.createReadStream y csv-parser, lo cual es bueno para manejar archivos grandes en streaming.
Inserciones en Lotes: En lugar de guardar cada documento individualmente, agrupa los documentos en lotes y usa insertMany para insertar los lotes en MongoDB. Esto reduce la sobrecarga de las operaciones de inserción.
Manejo de Memoria: Asegúrate de que los datos se procesen y se liberen de la memoria tan pronto como sea posible para evitar problemas de memoria.
Explicación de las Mejoras:
Inserciones en Lotes:
Se define un tamaño de lote (BATCH_SIZE) para las inserciones en MongoDB.
Los documentos se agrupan en lotes y se insertan en la base de datos utilizando insertMany.
Manejo de Memoria:
Se asegura de que los datos se procesen y se liberen de la memoria tan pronto como sea posible.
Se pausa la lectura del archivo CSV cuando se inserta un lote y se reanuda después de la inserción.

---

Para optimizar la lectura de archivos CSV grandes, puedes considerar las siguientes estrategias:
Lectura en Streaming: Ya estás utilizando fs.createReadStream y csv-parser, lo cual es bueno para manejar archivos grandes en streaming.
Manejo de Memoria: Asegúrate de que los datos se procesen y se liberen de la memoria tan pronto como sea posible.
Inserciones en Lotes: Ya estás utilizando insertMany para insertar los documentos en lotes, lo cual es eficiente.
Estrategias Adicionales para Optimizar la Lectura de CSV
Ajustar el Tamaño del Buffer: Puedes ajustar el tamaño del buffer de lectura para optimizar el rendimiento.
Manejo de Backpressure: Asegúrate de manejar correctamente la presión de retroceso (backpressure) para evitar que el flujo de datos sobrecargue la memoria.
Explicación de las Mejoras:
Ajuste del Tamaño del Buffer:
Se ajusta el tamaño del buffer de lectura a 64 KB (highWaterMark: 64 * 1024). Esto puede mejorar el rendimiento al leer archivos grandes.
Manejo de Backpressure:
Se utiliza readStream.pause() y readStream.resume() para manejar la presión de retroceso (backpressure) y evitar que el flujo de datos sobrecargue la memoria.

---

El tamaño óptimo del buffer de lectura (highWaterMark) puede variar dependiendo del tamaño de los archivos CSV y de la cantidad de memoria disponible en tu sistema. Sin embargo, un tamaño de buffer comúnmente utilizado es de 64 KB (64 * 1024 bytes), que suele ser un buen punto de partida para la mayoría de los casos.
Consideraciones para Ajustar el Tamaño del Buffer
Tamaño del Archivo: Si los archivos CSV son muy grandes, un tamaño de buffer más grande puede ayudar a leer los datos más rápidamente.
Memoria Disponible: Asegúrate de que el tamaño del buffer no sea tan grande que consuma demasiada memoria y cause problemas de rendimiento.
Pruebas y Ajustes: Realiza pruebas con diferentes tamaños de buffer para encontrar el valor que ofrezca el mejor rendimiento en tu entorno específico.
Tamaños de Buffer Comunes
64 KB: Un tamaño de buffer comúnmente utilizado que ofrece un buen equilibrio entre rendimiento y uso de memoria.
128 KB: Puede ser útil si los archivos son muy grandes y tienes suficiente memoria disponible.
32 KB: Puede ser útil si tienes limitaciones de memoria.

---

En el script actual, la función loadCSV está leyendo las líneas de cada archivo CSV de una en una y procesándolas secuencialmente. Esto es adecuado para manejar archivos grandes y evitar problemas de memoria, pero puede no ser la opción más rápida si tienes muchos archivos CSV que procesar.
Procesamiento en Paralelo
Para mejorar el rendimiento, puedes procesar múltiples archivos CSV en paralelo. Esto se puede lograr utilizando Promise.all para manejar múltiples promesas de manera eficiente. Sin embargo, dentro de cada archivo CSV, seguirás leyendo y procesando las líneas de manera secuencial para evitar problemas de memoria.

---

1. Manejo de Backpressure
Concepto de Backpressure: El manejo de backpressure (presión de retroceso) es un concepto importante en el procesamiento de flujos de datos. Ocurre cuando la velocidad de producción de datos es mayor que la velocidad de consumo de esos datos. En el contexto de la lectura de archivos y el procesamiento de datos, esto puede llevar a problemas de memoria si no se maneja adecuadamente.
Pausar y Reanudar el Flujo de Lectura: Para manejar la presión de retroceso, puedes pausar y reanudar el flujo de lectura. Esto asegura que no se lean más datos de los que se pueden procesar en un momento dado, evitando así la sobrecarga de memoria.
Ejemplo en el Código: En el código, se utiliza readStream.pause() y readStream.resume() para manejar la presión de retroceso. Cuando el lote de datos alcanza un tamaño definido (BATCH_SIZE), se pausa la lectura del archivo (readStream.pause()) hasta que los datos del lote se hayan insertado en la base de datos. Una vez que se completa la inserción, se reanuda la lectura del archivo (readStream.resume()).

2. Lectura y Creación de Modelos en Paralelo vs. Secuencial
Lectura y Creación de Modelos en Paralelo: La idea de procesar cada línea de los CSV en paralelo puede parecer que mejoraría la velocidad del script. Sin embargo, hay varias razones por las que esto no es necesariamente una buena idea:
Problemas de Memoria:
Procesar muchas líneas en paralelo puede llevar a un uso excesivo de memoria, ya que cada línea procesada consume recursos. Esto puede resultar en problemas de memoria y posibles bloqueos del sistema.
Manejo de Concurrencia:
Manejar la concurrencia de manera segura y eficiente es complejo. Puede llevar a condiciones de carrera y otros problemas de sincronización que son difíciles de depurar.
Backpressure:
Procesar las líneas en paralelo puede generar más datos de los que se pueden insertar en la base de datos a la vez, lo que lleva a problemas de backpressure. Pausar y reanudar el flujo de lectura ayuda a manejar esto de manera más eficiente.
Inserciones en Lotes:
Insertar datos en lotes es más eficiente que insertar cada documento individualmente. Procesar las líneas secuencialmente permite agrupar los datos en lotes y realizar inserciones en la base de datos de manera más eficiente.
Ejemplo de Lectura Secuencial: En el código actual, las líneas se procesan secuencialmente y se agrupan en lotes antes de insertarlas en la base de datos. Esto asegura un uso eficiente de la memoria y un manejo adecuado de la presión de retroceso.

---

El tamaño del lote (BATCH_SIZE) puede variar dependiendo del contexto y de los requisitos específicos de tu aplicación. Sin embargo, hay algunos valores comunes que se utilizan frecuentemente y que pueden servir como punto de partida:
Valores Comunes de BATCH_SIZE
1000: Este es un valor comúnmente utilizado que ofrece un buen equilibrio entre rendimiento y uso de memoria. Es lo suficientemente grande como para reducir la sobrecarga de las operaciones de inserción individuales, pero no tan grande como para causar problemas de memoria.
500: Si tienes limitaciones de memoria o si los documentos son muy grandes, un tamaño de lote más pequeño como 500 puede ser más adecuado.
2000: Si tienes suficiente memoria disponible y necesitas maximizar el rendimiento, un tamaño de lote más grande como 2000 puede ser beneficioso.
Consideraciones para Elegir el BATCH_SIZE
Tamaño de los Documentos: Si los documentos son grandes, un tamaño de lote más pequeño puede ser más adecuado para evitar problemas de memoria.
Memoria Disponible: Asegúrate de que el tamaño del lote no consuma demasiada memoria y cause problemas de rendimiento.
Pruebas y Ajustes: Realiza pruebas con diferentes tamaños de lote para encontrar el valor que ofrezca el mejor rendimiento en tu entorno específico.

En general, un BATCH_SIZE más grande puede ser beneficioso para documentos grandes, ya que reduce la sobrecarga de las operaciones de inserción individuales. Sin embargo, hay algunas consideraciones importantes a tener en cuenta:
Memoria Disponible: Un BATCH_SIZE más grande consume más memoria. Asegúrate de que tu sistema tenga suficiente memoria disponible para manejar el tamaño del lote.
Rendimiento de la Base de Datos: Un BATCH_SIZE más grande puede mejorar el rendimiento de la inserción en la base de datos, pero también puede aumentar la latencia si la base de datos no puede manejar grandes volúmenes de datos de una sola vez.
Pruebas y Ajustes: Realiza pruebas con diferentes tamaños de lote para encontrar el valor que ofrezca el mejor rendimiento en tu entorno específico.
Ajuste del BATCH_SIZE para Documentos Grandes
Aquí tienes un ejemplo de cómo ajustar el BATCH_SIZE para documentos grandes:
Resumen
Ajuste del BATCH_SIZE: Un BATCH_SIZE más grande puede ser beneficioso para documentos grandes, pero asegúrate de que tu sistema tenga suficiente memoria disponible.
Pruebas y Ajustes: Realiza pruebas con diferentes tamaños de lote para encontrar el valor que ofrezca el mejor rendimiento en tu entorno específico.
Con estas consideraciones, puedes ajustar el BATCH_SIZE para encontrar el valor que ofrezca el mejor rendimiento en tu entorno específico.

---

El tamaño del buffer de lectura (BUFFER_SIZE) puede tener un impacto significativo en el rendimiento de la lectura de archivos grandes. Aquí hay algunas consideraciones sobre cómo un BUFFER_SIZE más grande o más pequeño puede afectar el rendimiento:
BUFFER_SIZE Más Grande (128 KB)
Mayor Rendimiento de Lectura:
Un tamaño de buffer más grande puede mejorar el rendimiento de lectura, ya que se leen más datos en cada operación de lectura. Esto puede reducir la cantidad de operaciones de E/S necesarias y, por lo tanto, mejorar la velocidad de lectura.
Mayor Uso de Memoria:
Un tamaño de buffer más grande consume más memoria. Si tienes muchos archivos grandes o si tu sistema tiene limitaciones de memoria, esto podría llevar a problemas de memoria.
Menos Operaciones de Pausa/Reanudación:
Con un tamaño de buffer más grande, es menos probable que necesites pausar y reanudar el flujo de lectura con tanta frecuencia, lo que puede simplificar el manejo de la presión de retroceso (backpressure).
BUFFER_SIZE Más Pequeño (64 KB)
Menor Uso de Memoria:
Un tamaño de buffer más pequeño consume menos memoria, lo que puede ser beneficioso si tienes limitaciones de memoria o si estás procesando muchos archivos grandes simultáneamente.
Más Operaciones de E/S:
Un tamaño de buffer más pequeño puede resultar en más operaciones de E/S, ya que se leen menos datos en cada operación de lectura. Esto puede reducir el rendimiento de lectura en comparación con un tamaño de buffer más grande.
Más Operaciones de Pausa/Reanudación:
Con un tamaño de buffer más pequeño, es más probable que necesites pausar y reanudar el flujo de lectura con más frecuencia, lo que puede aumentar la complejidad del manejo de la presión de retroceso (backpressure).

---

Dado que todos los archivos CSV en la carpeta Aire tienen un tamaño mínimo de 700 KB, ajustar el BUFFER_SIZE y el BATCH_SIZE puede ayudar a optimizar el rendimiento de la lectura y la inserción de datos en MongoDB.
Ajuste del BUFFER_SIZE
Para archivos de este tamaño, un BUFFER_SIZE de 128 KB debería ser adecuado, ya que permite leer una cantidad significativa de datos en cada operación de lectura sin consumir demasiada memoria.
Ajuste del BATCH_SIZE
Un BATCH_SIZE de 1000 es un buen punto de partida, pero dado que los archivos son relativamente grandes, podrías considerar aumentar el BATCH_SIZE a 2000 para reducir la sobrecarga de las operaciones de inserción individuales.

---

