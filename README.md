![Logo Corpus2Wiki](corpus2wiki/logo.png)

# Corpus2Wiki

Corpus2Wiki is based on MediaWiki and allows the vizualisation of word-, sentence-, paragraph- and text-information. It provides tooltips for all the information, supports graphical hilighting of word-based information, shows a histogram of POS-frequency and a map of the locations mentioned in the text.

![Screenshot](images/screenshot.png)

The text analysis is made by the TextImager service provided by the Text Technology Lab (University of Frankfurt). Corpus2Wiki currently supports POS, MORPH, DDC, Lemma and NE information in German and English texts.

An import form is provided for simple and automated document analysis and import.

## Installation:

1. Install [docker](https://www.docker.com/get-started) and [docker-compose](https://docs.docker.com/compose/install/)
2. Download this repo
3. Run installation, configuration and start containers by running `./corpus2wiki.sh` from the corpus2wiki directory (or alternatively `docker-compose -f stack.yml up`, if you want a newly compiled Corpus2Wiki container, add --build)

Corpus2Wiki is now set up on port 8080 (default) with the following parameters:

```
- MW_ADMIN_USER=admin
- MW_ADMIN_PASS=password
- MW_DB_NAME=wikidb
- MW_DB_USER=mediawiki
- MW_DB_PASS=wikidbpw
- MW_DB_INSTALLDB_USER=root
- MW_DB_INSTALLDB_PASS=wikiexporterpw
- MW_SCRIPT_PATH=
- MW_SERVER_NAME=http://localhost:8080
```

These parameters can be changed by editing the stack.yml file.

## Start Corpus2Wiki:
Start containers by running `./corpus2wiki.sh` (or alternatively `docker-compose -f stack.yml up`) from the corpus2wiki directory.

## Add Files to Wikitition:

<img align="right" src="images/import.png" alt="upload form" width="170">

1. Make sure the containers are running, then open your browser and go to localhost:8080/import (if accessing from remote, replace localhost with the appropiate ip-address/url)
2. Select all the files you want to be analized and added to the Corpus2Wiki and select the appropriate settings
3. Pressing the "Upload & Process"-Button will start the import procedure. Please keep the browser open until the process is finished.

## Access Results
Go to localhost:8080 (or ip-address/url if accessing from remote).

Visit "localhost/index.php/Special:AllPages" to see a list of links to your files - click on any of them to access the analyzed text and visualizations.

## Known Bugs
We are aware that sometimes when setting up a wiki for the first time, the connection with the MariaDB Container reporst connection
issues and is not setup up properly.After the initial docker compose up it is also only possible to setup the credentials by hand.

This Bug actually stems from the first time the MariaDB and Wiki-Container are initialised.In this process it seaams the
timezone configuration delays the inital setup and if the user is impationed and aborts the setup,everything has to be set by hand.
However the solution to this problem is very easy,just wait.At some point the DB seams to notice the error and fixes it by itself 
depending on the machine 10 - 15 min.But this only works in the inital up, after that the containers are "configured" and load that as 
default.After that the rest of the setup is done without an human intervention as usual.

This Bug atleast exists on win 10 pro 1909,Debian 10 and Ubuntu 18.10. 

## Given Config
A small note on the configuration regarding the internal network of the setup.
The used inter network driver is the bridge driver,however other drivers should also be possible.
Given that we desire to give as many people as possible access to the software we will stick to the bridge driver for compability 
reasons,atleast for now.


## Legal
(c)2018 [Text Technology Lab](https://www.texttechnologylab.org), Goethe University Frankfurt

Authors: Alex Hunziker, Hasanagha Mammadov, Eleanor Rutherford

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
