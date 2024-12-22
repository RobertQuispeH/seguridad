# instalar
***
## clonar. 
```
$ git clone https://github.com/RobertQuispeH/seguridad.git
cd .\seguridad\
```
## Base de datos.
```
$ cd .\DataBase\
$ docker-compose up -d   
```
Ejecutar el script de data.sql dentro del contenedor de postgres 

Otra terminal
## backend.
```
$ cd .\backend\
$ python -m venv env
$ .\envt\Scripts\activate
$ python -m pip install --upgrade pip
$ flask db init
$ flask db migrate -m "Initial migration"
$ flask db upgrade 
$ flask run 
```
Otra terminal
## Frontend.
```
$ cd .\frontend\
$ npm install 
$ npm run dev
```
