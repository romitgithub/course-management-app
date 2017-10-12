#!/bin/sh
DIR=`date +%m%d%y`
DEST=~/db_backups/$DIR
mkdir $DEST
mongodump -h localhost:27017 -d shareiitk -o $DEST