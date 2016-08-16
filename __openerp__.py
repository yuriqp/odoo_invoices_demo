# -*- coding: utf-8 -*-
{
    'name': 'Bloopark Demo',
    'version': '1.0',
    'author': 'yuriqp',
    'website': '',
    'category': 'Demo',
    'description': """
    Website (on bloopark/demo) which shows information of logged user and
    invoices which it is responsible for.
    """,
    
    'depends': [
        'sale',
        'website'
    ],
    
    'data': [
        'templates.xml'
    ],
    
    'qweb' : [
        'templates.xml',
        'static/src/*.xml'
    ],
            
    'demo': [],
    
    'application': False,
    'sequence': -99,
    'installable': True,
    'active': False,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
