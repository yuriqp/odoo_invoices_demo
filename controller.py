# -*- coding: utf-8 -*-
from openerp import http
from openerp import models

class DemoController(http.Controller):
    @http.route('/bloopark/demo/', auth='user', type='http', website=True)
    def index(self, **kw):
        uid, pool = http.request.uid, http.request.env
        users_obj = pool['res.users']
        user = users_obj.browse(uid)
        
        invoice_obj = pool['account.invoice']
        invoices = invoice_obj.search([('user_id', '=', user.id)])
        
        return http.request.render('bloopark_demo.index', {
            'user': user,
            'invoices': invoices
        })

#     @http.route('/academy/academy/objects/', auth='public')
#     def list(self, **kw):