define([
	'backbone',
	'views/twofa_view',
	'i18n',
	'global',
], function(Backbone, TwoFAView, i18n, Global) {

	'use strict';

	var TwoFAController = Backbone.Controller.extend({

		initialize: function() {

			console.log('---TwoFA Controller--- initialize()');
		},

		start: function(params) {

			this.view = new TwoFAView({});
			this.publishEvent('profileHeader:show');
			//this.publishEvent('verifyUser:show');
			_.bindAll(this, 'start');
			Backbone.Controller.prototype.start.apply(this, arguments);
		}

	});

	return TwoFAController;
});