# -*- coding: utf-8 -*-
from openerp import http
from openerp import models

class DemoController(http.Controller):
    @http.route('/bloopark/demo/', auth='user')
    def index(self, **kw):
        cr, uid, context, pool = http.request.cr, http.request.uid, http.request.context, http.request.registry
        users_obj = pool['res.users']
        user = users_obj.browse(cr, uid, uid, context=context)
        
        invoice_obj = pool['account.invoice']
        invoices_ids = invoice_obj.search(cr, uid, [('user_id', '=', user.id)])
        
        return "Hello, {}! \n You have {} invoices".format(user.name, len(invoices_ids))

#     @http.route('/academy/academy/objects/', auth='public')
#     def list(self, **kw):