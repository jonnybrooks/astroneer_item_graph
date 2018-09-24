#!/usr/bin/env bash
set -e # exit on error

# overwrite remote db
pg_dump -U postgres -Fc astroneer_item_graph > astro.db
pg_restore -h 144.202.8.63 -p 5432 -U postgres --clean --dbname=postgres -C astro.db
rm astro.db

# restart the api service and rebuild the ui
ssh root@144.202.8.63 /bin/bash << EOF
    cd /var/www/astroneer_item_graph
    git checkout master
    git pull
    npm install
    sudo systemctl restart astroneer_api.service
    npm run build
EOF