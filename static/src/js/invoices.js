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
		    // Changing the url to connect to the proper controller
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
	<li>
		<a href="#" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
			<img src="http://localhost:8069/web/binary/image?model=res.users&field=image_small&id=<%- id %>"/>
			<%- name %>
			<span class=" fa fa-angle-down">
			</span>
		</a>
		<ul class="dropdown-menu dropdown-usermenu pull-right" aria-labelledby="userDropdown">
			<li><a href='#' class='open-1' > Profile </a></li>
			<li><a href='http://localhost:8069/web' > Back to Odoo </a></li>
		</ul>
	</li>
`;

UserView = Backbone.Marionette.ItemView.extend({
	template: _.template(user_tmpl_html),
	tagName: 'ul',
	className: 'nav navbar-nav navbar-right',
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
	<tr class="headings">
		<th class="column-title">Name</th>
		<th class="column-title">Customer</th>
		<th class="column-title">Date</th>
		<th class="column-title">Source</th>
		<th class="column-title">Amount</th>
	</tr>
</thead>
<tbody>
</tbody>
`;

InvoicesView = Backbone.Marionette.CompositeView.extend({
	tagName: "table",
	id: "invoices_id",
	className: "table table-striped jambo_table",
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
	$('body').addClass("nav-md footer_fixed menu_fixed");
});



