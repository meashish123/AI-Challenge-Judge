# AI Challenge Judge

An online platform in which there is a two-player game and contestant has to write code for a bot that will play that game against other bots.  
The bot has to adhere to the rules of the game.  
Judge declares the winner, by the overall winner of the tournament.

## How does it look like!
The platform looks like this.  
![Home](https://raw.githubusercontent.com/meashish123/AI-Challenge-Judge/master/screenshots/1.PNG)
The problem description contains problem statement, input/output format and sample i/o.  
![Problem Description](https://raw.githubusercontent.com/meashish123/AI-Challenge-Judge/master/screenshots/2.PNG)
You can write code in the code Editor.
![Code Editor](https://raw.githubusercontent.com/meashish123/AI-Challenge-Judge/master/screenshots/3.PNG)
You can also view all your submissions anytime
![Submissions](https://raw.githubusercontent.com/meashish123/AI-Challenge-Judge/master/screenshots/4.PNG)
You can also see the whole game progress.
![Game Progress](https://raw.githubusercontent.com/meashish123/AI-Challenge-Judge/master/screenshots/5.PNG)

## Getting Started

### Prerequisities

What things you need to install

* Install **Nodejs** from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)   
* Install **Mongodb** from [https://www.mongodb.com/download-center](https://www.mongodb.com/download-center)  
* Setup and install **CompileBox** from [https://github.com/remoteinterview/compilebox](https://github.com/remoteinterview/compilebox)

### Installing and Running

* Install all prerequisites.
* Setup and install **CompileBox** from [https://github.com/remoteinterview/compilebox](https://github.com/remoteinterview/compilebox).
* Setup Mongodb Database (two alternatives):  
    1. Start from Scratch - Use [this](https://github.com/meashish123/AI-Challenge-Judge/raw/master/database-dumps/dump-scratch.zip) mongodb database dump.   
    2. Use temporary database - Use [another](https://github.com/meashish123/AI-Challenge-Judge/raw/master/database-dumps/dump-temp.zip) mongodb database dump.   
* Unzip dump-*.zip, and restore using following command
    ```
        mongorestore --db test path_to_bson_file
    ```
* Clone this repo 
    ```
        git clone https://github.com/meashish123/AI-Challenge-Judge.git
    ```
* Run the server from directory /AI-Challange-Judge, using following command
    ```
        sudo node bin/www
    ```
* Run the server at
    ```
        https://localhost:3000
    ```

* Setup contest date and time at
    ```
        https://localhost:3000/init
    ```
Now the judge successfully installed and running.. :)

## Built With

* Nodejs
* Mongodb
* Jetbrains Webstorm

## Contributing

Introduce changes, add features, [fix bugs](https://github.com/meashish123/AI-Challenge-Judge/issues) and send a [pull request](https://github.com/meashish123/AI-Challenge-Judge/pulls) to contribute.


## Authors

* **Ashish Chauhan**

See also the list of [contributors](https://github.com/meashish123/AI-Challenge-Judge/graphs/contributors) who participated in this project.

## Acknowledgments

* [Remoteinterview](https://github.com/remoteinterview/compilebox), for using docker with node.js to compile code.
