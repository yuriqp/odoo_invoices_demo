var MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
  userRegion: '#user_container',
  invoicesRegion: '#invoices_container',
  modalRegion: '#modal_container'
});

// Models

User = Backbone.Model.extend({});

Invoice = Backbone.Model.extend({});

Invoices = Backbone.Collection.extend({
  model: Invoice,
});

// Views

var user_tmpl_html = `
<a href='#' class='open-1 bbm-button'> <%= name %> </a>
`;
UserView = Backbone.Marionette.ItemView.extend({
  template: _.template(user_tmpl_html),
  tagName: 'div',
  className: 'user_div',
  events: {
    'click .open-1': 'open_modal'
  },
  open_modal: function(){
    var user_modal_tmpl_html = `
    <div class='bbm-modal__topbar'>
      <h3 class='bbm-modal__title'>User data</h3>
    </div>
    <div class='bbm-modal__section'>
      <p>`+this.model.attributes.name+`</p>
      <p>`+this.model.attributes.position+`</p>
      <p>`+this.model.attributes.email+`</p>
      <p>`+this.model.attributes.phone+`</p>
    </div>
    <div class='bbm-modal__bottombar'>
      <a href='#' class='bbm-button'>Ok</a>
    </div>
    `;
    UserModal = Backbone.Modal.extend({
      submitEl: '.bbm-button',
      template: _.template(user_modal_tmpl_html)
    });
    MyApp.modalRegion.show(new UserModal());
  }
});

var invoice_tmpl_html = `
<td> <%= name %></td>
<td> <%= customer %> </td>
<td> <%= date %> </td>
<td> <%= source %> </td>
<td class='text-right'> <%= currency %> <%= amount %></td>
`;

InvoiceView = Backbone.Marionette.ItemView.extend({
  template: _.template(invoice_tmpl_html),
  tagName: 'tr',
});

var invoices_tmpl_html = `
<thead>
  <tr>
    <th>Name</th>
    <th>Customer</th>
    <th>Date</th>
    <th>Source</th>
    <th>Amount</th>
  </tr>
</thead>
<tbody>
    </tbody>
`;

InvoicesView = Backbone.Marionette.CompositeView.extend({
  tagName: "table",
  id: "invoices_id",
  className: "table table-bordered table-striped",
  template: _.template(invoices_tmpl_html),
  childView: InvoiceView,
});

// Initialization

MyApp.addInitializer(function(options){
  
  var userView = new UserView({
  	model: options.user
  });
  MyApp.userRegion.show(userView);
  
  var invoicesView = new InvoicesView({
    collection: options.invoices
  });
  MyApp.invoicesRegion.show(invoicesView);
});

$(document).ready(function(){
	MyApp.start({user: user, invoices: invoices});
});
