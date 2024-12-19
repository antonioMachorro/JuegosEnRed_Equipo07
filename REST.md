# 

    

*REST DOCUMENT*

**Hotline Miauami**

**Grupo 07:**

Adrián Espínola Gumiel 	[a.espinola.2022@alumnos.urjc.es](mailto:a.espinola.2022@alumnos.urjc.es) 		idarkar3000  
Antonio Machorro Herrera	[a.machorro.2024@alumnos.urjc.es](mailto:a.machorro.2024@alumnos.urjc.es) 		antonioMachorro  
Laura Manso Herrero 		[l.manso.2022@alumnos.urjc.es](mailto:l.manso.2022@alumnos.urjc.es)		laurimans  
David Antonio Paz Gullón	[da.paz.2022@alumnos.urjc.es](mailto:da.paz.2022@alumnos.urjc.es)		DavidPazUni  
Alvaro Rosa Pedraza 		[a.rosa.2022@alumnos.urjc.es](mailto:a.rosa.2022@alumnos.urjc.es)		alvaroRosa23

**Índice**

**[1\. Introducción	](#introducción)**

**[2\. Gestión de Usuarios	](#gestión-de-usuarios)**

[Endpoints Disponibles	](#endpoints-disponibles)

[Lógica	](#lógica)

**[3\. Gestión del Estado de Conexión	](#gestión-del-estado-de-conexión)**

[Endpoints Disponibles	](#endpoints-disponibles-1)

**[Lógica	](#lógica-1)**

**[4\. Gestión de Mensajes (Chat)	](#gestión-de-mensajes-\(chat\))**

[Endpoints Disponibles	](#endpoints-disponibles-2)

**[5\. Comunicación en Tiempo Real (WebSockets)	](#comunicación-en-tiempo-real-\(websockets\))**

[Implementación	](#implementación)

**[6\. Configuración General	](#configuración-general)

# ** 1. Introducción** 

El proyecto desarrollado implementa una API REST que permite gestionar usuarios, autenticación, mensajería y estado de conexión en tiempo real. Este sistema utiliza Spring Boot para la configuración y ejecución del servidor.

# **2. Gestión de Usuarios** 

Esta funcionalidad tiene como objetivo principal el manejo del ciclo de vida de los usuarios en el sistema. La API permite la creación, recuperación, actualización y eliminación (GET, POST, PUT y DELETE) de usuarios, además de incluir métodos para autenticación.

### **Endpoints Disponibles** 

* **GET /api/users/{username}**  
  Recupera la información de un usuario específico. Devuelve un objeto UserDTO con los detalles del usuario si existe o un estado HTTP 404 Not Found en caso contrario.  
* **POST /api/users/**  
  Permite crear un nuevo usuario en el sistema. Valida los datos recibidos y verifica si el usuario ya existe. En caso de éxito, devuelve un estado HTTP 204 No Content. Si el usuario ya existe, retorna un estado HTTP 409 Conflict.  
* **PUT /api/users/{username}**  
  Actualiza atributos específicos de un usuario, como contraseña y volumen. Valida que los datos sean correctos y retorna el estado HTTP adecuado según el resultado de la operación.  
* **DELETE /api/users/{username}**  
  Elimina un usuario específico del sistema. Si el usuario no existe, devuelve un estado HTTP 404 Not Found.  
* **GET /api/users/**  
  Recupera una lista de todos los usuarios registrados.  
* **POST /api/users/login**  
  Autentica a un usuario verificando sus credenciales enviadas en un objeto LoginDTO. Devuelve un mensaje de éxito con el estado HTTP 200 OK o un error con el estado 401 Unauthorized si las credenciales son incorrectas.  
* **POST /api/users/logout**  
  Cierra la sesión del usuario especificado en el objeto LogoutDTO, eliminando su información de actividad reciente.

### 

### **Lógica** 

La lógica principal está encapsulada en la clase UserService, que utiliza:

* **Encriptación de Contraseñas:** Uso de BCryptPasswordEncoder para proteger las contraseñas almacenadas.  
* **Persistencia:** Gestión de datos mediante la clase UserDAO, que almacena y recupera información de usuarios en archivos JSON.

# **3. Gestión del Estado de Conexión** 

Esta funcionalidad se encarga de rastrear la actividad reciente de los usuarios para determinar quiénes se encuentran conectados al sistema.

### **Endpoints Disponibles** {#endpoints-disponibles-1}

* **GET /api/status/connection**  
  Verifica la conectividad con el servidor devolviendo un mensaje de confirmación.  
* **GET /api/status/connected-users**  
  Devuelve el número de usuarios conectados dentro de un umbral de tiempo definido (configurable mediante el bean threshold).  
* **POST /api/status/activity**  
  Actualiza la última actividad de un usuario. Requiere un objeto ActivityDTO con el nombre de usuario.

### **Lógica** 

La funcionalidad está soportada por la clase ApiStatusService, que utiliza un mapa concurrente (ConcurrentHashMap) para almacenar los registros de actividad. Los métodos principales incluyen:

* Actualización del estado de conexión mediante hasSeen().  
* Cálculo de usuarios conectados con métodos como isConnected() y numberOfUsersConnected().

# **4. Gestión de Mensajes (Chat)** 

Esta funcionalidad implementa un sistema de mensajería donde los usuarios pueden publicar, consultar y eliminar mensajes.

### **Endpoints Disponibles** 

* **POST /api/chat**  
  Permite publicar un mensaje. Valida que el mensaje y el usuario no estén vacíos antes de almacenarlo en una lista concurrente.  
* **GET /api/chat**  
  Recupera todos los mensajes publicados después de un ID específico (since).


# **5. Comunicación en Tiempo Real (WebSockets)** 

El proyecto incluye soporte para WebSockets, lo que permite comunicación bidireccional en tiempo real.

### **Implementación** 

* **WebSocketEchoHandler**  
  Gestiona los mensajes recibidos a través de WebSockets, devolviendo un eco al cliente. Esta funcionalidad está registrada bajo el endpoint /echo.

# **6. Configuración General** 

La clase principal HotlinemiauamiApplication configura los aspectos principales del proyecto:

* **Habilitación de WebSockets:** Mediante la anotación @EnableWebSocket.  
* **Umbral de Conexión:** Configuración del tiempo máximo de inactividad permitido para considerar a un usuario como conectado (threshold).  
* **Seguridad:** Deshabilitación de autenticación en los endpoints REST para simplificar las pruebas del sistema.

