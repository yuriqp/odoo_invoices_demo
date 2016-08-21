# odoo_invoices_demo
A simple odoo website

A docker image with the app installed is available at:

https://hub.docker.com/r/yuriqp/postgres_bloopark_demo/

https://hub.docker.com/r/yuriqp/odoo_bloopark_demo/ (this is a requirement)

Usage:
sudo docker run -d -e POSTGRES_USER=odoo -e POSTGRES_PASSWORD=odoo --name db postgres_bloopark_demo
sudo docker run -p 8069:8069 --name odoo --link db:db -t odoo_bloopark_demo

You can login with the following credentials:
user: admin@admin
password: admin
