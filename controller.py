# -*- coding: utf-8 -*-
import openerp
from openerp import http
from openerp import models

class DemoController(http.Controller):
    @http.route('/bloopark/demo/', auth='user', type='http', website=True)
    def index(self, **kw):
        uid, pool = http.request.uid, http.request.env
        users_obj = pool['res.users']
        user = users_obj.browse(uid)
        
        # Invoices that this user is responsible for
        invoice_obj = pool['account.invoice']
        invoices = invoice_obj.search([('user_id', '=', user.id), ('type', '=', 'in_invoice')])
        
        return http.request.render('odoo_invoices_demo.index', {
            'user': user,
            'invoices': invoices
        })

class LoginController(openerp.addons.web.controllers.main.Home):
    
    @http.route('/web/login', type='http', auth="none")
    def web_login(self, redirect=None, **kw):
        return super(LoginController, self).web_login(redirect='/bloopark/demo')
    