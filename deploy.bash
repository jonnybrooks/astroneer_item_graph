#!/usr/bin/env bash

# overwrite remote db
pg_dump -U postgres -Fc astroneer_tree > astro.db
pg_restore -h 144.202.8.63 -p 5432 -U postgres -C astro.db --clean -e
del /Q astro.db

# restart the api service and rebuild the ui
ssh root@144.202.8.63 /bin/bash << EOF
    cd /var/www/astroneer_tree
    git checkout master
    git pull
    npm install
    sudo systemctl restart astroneer_tree_api.service
    npm run build
EOF