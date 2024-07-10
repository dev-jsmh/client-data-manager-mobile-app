# Importante

Anteriormente realize un commit en el cual la aplicación no estaba terminada y tenia algunos errores. Actualmente, logre corregir muchos de ellos y terminar la aplicación, lo que me permitio compilar el código fuente del proyecto y generar el .apk deseado. Este archivo lo podra encontrar en la ruta "apk_proyecto/app-debug.apk" listo para ser instalado en su teléfono movil y probado.


# About 

This app has been developed using hibryd modile technologies like ionic + capacitor. This allowed me to use html and css to create the user interface and native code from android to create a local data base using sqlite and perform operations on existing tables. 

### Methods from the data base service

* getAllClients
* getById
* create
* update
* delete

### Avilable views: 

* Home: 

Here the application will list all the register clients in the data base and render a table so you can check rapidly all clients.

* Add: 

This is a form where you can add information of a new client.

* Details

In this view you can watch all the information about a specific client. also it has two buttons. one is for delete the client and the other takes you to a view that contains a form where you can update information of the client.

* Update

This view has a form for updating information.

Note: you will find a compiled version of the app ready to test directly on your phone in the next directory: android/app/build/outputs/apk/debug/app-debug.apk
