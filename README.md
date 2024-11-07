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