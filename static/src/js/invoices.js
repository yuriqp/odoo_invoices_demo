var MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
	userRegion: '#user_container',
	invoicesRegion: '#invoices_container',
	modalRegion: '#modal_container'
});

// Models

User = Backbone.Model.extend({
	urlRoot: 'http://localhost:8069/bloopark/user',
	sync: function(method, model, options) {
		if (method==='update'){
        options.url = model.urlRoot + '/save/' + model.get('id');
		}
		return Backbone.sync(method, model, options);
  }
});

Invoice = Backbone.Model.extend({});

Invoices = Backbone.Collection.extend({
	model: Invoice,
});

// Views
var modal_info_tmpl_html = `
	<div class='bbm-modal__topbar'>
		<h3 class='bbm-modal__title'>User info</h3>
	</div>
	<div class='bbm-modal__section'>
		<p><%= name %></p>
		<p><%= position %></p>
		<p><%= email %></p>
		<p><%= phone %></p>
	</div>
	<div class='bbm-modal__bottombar'>
		<a href='#' class='bbm-button open-2'>Edit</a>
		<a href='#' class='bbm-button btn-close'>Close</a>
	</div>
`;

UserModal = Backbone.Modal.extend({
	submitEl: '.btn-close',
	template: _.template(modal_info_tmpl_html),
	events: {
		'click .open-2': 'openEdit'
	},
	openEdit: function(e) {
		e.preventDefault();
		MyApp.modalRegion.show(new UserModal2({
			model: this.model
		}));
	}
});

var modal_form_tmpl_html = `
	<div class='bbm-modal__topbar'>
		<h3 class='bbm-modal__title'>Edit User</h3>
	</div>
	<div class='bbm-modal__section'>
		<form>
		<label for="name">Name</label>
		<input id="name" type="text" class="form-control" value="<%= name %>"/>
		<label for="position">Position</label>
		<input id="position" type="text" class="form-control" value="<%= position %>"/>
		<label for="email">Name</label>
		<input id="email" type="text" class="form-control" value="<%= email %>"/>
		<label for="phone">Phone</label>
		<input id="phone" type="text" class="form-control" value="<%= phone %>"/>
		</form>
	</div>
	<div class='bbm-modal__bottombar'>
		<a href='#' class='bbm-button btn-close submit-user'>Save</a>
		<a href='#' class='bbm-button btn-close'>Cancel</a>
	</div>
`;

UserModal2 = Backbone.Modal.extend({
	submitEl: '.btn-close',
	template: _.template(modal_form_tmpl_html),
	events: {
		'click .submit-user': 'submitUser'
	},
	ui: {
		name: '#name',
		position: '#position',
		email: '#email',
		phone: '#phone'
	},
	submitUser: function(){
		this.model.set({
			name: $('#name').val(),
			position: $('#position').val(),
			email: $('#email').val(),
			phone: $('#phone').val()
		});
		this.model.save();
	}
});

var user_tmpl_html = `
<button type="button" class="btn btn-lg btn-info" aria-label="Left Align"
	data-toggle="popover" title="Menu"
	data-content="<a href='#' class='open-1' > Info </a>">
	<span class="glyphicon glyphicon-th-large" aria-hidden="true"></span> <%- name %>
</button>
`;

UserView = Backbone.Marionette.ItemView.extend({
	template: _.template(user_tmpl_html),
	tagName: 'div',
	className: 'user_div',
	modelEvents: {
		'change': 'render',
	},
	events: {
		'click .open-1': 'open_modal'
	},
	open_modal: function(){
		MyApp.modalRegion.show(new UserModal({
			model: this.model
		}));
	},
	onRender: function(){
		$('[data-toggle="popover"]').popover({html: true, trigger: 'focus'});
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
	$('[data-toggle="popover"]').popover({html: true, trigger: 'focus'});
});



