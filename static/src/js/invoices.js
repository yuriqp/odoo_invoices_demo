var MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
	userRegion: '#user_container',
	invoicesRegion: '#invoices_container',
	modalRegion: '#modal_container'
});

// Models

User = Backbone.Model.extend({
	urlRoot: 'http://localhost:8069/bloopark/user',
});

Invoice = Backbone.Model.extend({});

Invoices = Backbone.Collection.extend({
	model: Invoice,
});

// Views

var getUserInfoTemplate = function(user){
	var modal_tmpl_html = `
		<div class='bbm-modal__topbar'>
			<h3 class='bbm-modal__title'>User info</h3>
		</div>
		<div class='bbm-modal__section'>
			<p>`+user.name+`</p>
			<p>`+user.position+`</p>
			<p>`+user.email+`</p>
			<p>`+user.phone+`</p>
		</div>
		<div class='bbm-modal__bottombar'>
			<a href='#' class='bbm-button open-2'>Edit</a>
			<a href='#' class='bbm-button btn-close'>Close</a>
		</div>
	`;
	return modal_tmpl_html
}

var getUserFormTemplate = function(user){
	var modal_tmpl_html = `
		<div class='bbm-modal__topbar'>
			<h3 class='bbm-modal__title'>Edit User</h3>
		</div>
		<div class='bbm-modal__section'>
			<form>
			<label for="name">Name</label>
			<input id="name" type="text" class="form-control" value="`+user.name+`"/>
			<label for="position">Position</label>
			<input id="position" type="text" class="form-control" value="`+user.position+`"/>
			<label for="email">Name</label>
			<input id="email" type="text" class="form-control" value="`+user.email+`"/>
			<label for="phone">Phone</label>
			<input id="phone" type="text" class="form-control" value="`+user.phone+`"/>
			</form>
		</div>
		<div class='bbm-modal__bottombar'>
			<a href='#' class='bbm-button btn-close submit-user'>Save</a>
			<a href='#' class='bbm-button btn-close'>Cancel</a>
		</div>
	`;
	return modal_tmpl_html
}

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
		var user_info_tmpl_html = getUserInfoTemplate(this.model.attributes);
		UserModal = Backbone.Modal.extend({
			submitEl: '.btn-close',
			template: _.template(user_info_tmpl_html),
			user_model: this.model,
			events: {
				'click .open-2': 'openEdit'
			},
			openEdit: function(e) {
				e.preventDefault();
				var user_form_tmpl_html = getUserFormTemplate(this.user_model.attributes);
				UserModal2 = Backbone.Modal.extend({
					submitEl: '.btn-close',
					template: _.template(user_form_tmpl_html),
					user_model: this.user_model,
					events: {
						'click .submit-user': 'submitUser'
					},
					submitUser: function(){
						var vals = {
							name: $('#name').val(),
							position: $('#position').val(),
							email: $('#email').val(),
							phone: $('#phone').val()
						};
						this.user_model.set(vals);
						var oldRoot = this.user_model.urlRoot;
						this.user_model.urlRoot = this.user_model.urlRoot + '/save';
						this.user_model.save();
						this.user_model.urlRoot = oldRoot;
					}
				});
				MyApp.modalRegion.show(new UserModal2());
			}
		});
		MyApp.modalRegion.show(new UserModal());
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



