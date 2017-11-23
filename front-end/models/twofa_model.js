define([
	'backbone',
	'i18n',
	'global_context',
	'global',
	'helpers/login-helper',
	'models/login-base-model'
], function(Backbone, i18n, gc, CONSTANT, LoginHelper, LoginBaseModel) {
	
	'user strict';

	var TwoFAModel = LoginBaseModel.extend({

		initialize: function() {
			console.log('---TwoFA model--- in initialize()', this);
		},


		// save email
		updateUser: function(userdata, sessionid) {
			this.url = CONSTANT.API.USER_UPDATE + "?sessionid=" + sessionid;
			return this.save(userdata, {
				emulateJSON: true,
				type: 'POST',
				data: JSON.stringify(userdata),
				headers: _.extend({}, CONSTANT.url_headers || {}, {
					'Accept': 'application/json',
					'Content-type': 'application/json; charset=UTF-8'
				}),
			})
		},


		// sendEmail after saving email 
		sendEmail: function(user, sessionid) {
			this.url = CONSTANT.API.SEND_EMAIL + "?sessionid=" + sessionid;
			return this.save(user, {
                emulateJSON: true,
                type: 'POST',
                data: JSON.stringify(user),
                headers: _.extend({}, CONSTANT.url_headers || {}, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'				
				}),
			});
		},


		// twoFA
		twoFA: function(inputCode, sessionid) {
			this.url = CONSTANT.API.TWOFA + "?sessionid=" + sessionid;

            return this.save(data, {
                emulateJSON: true,
                type: 'POST',
                data: inputCode,
                headers: _.extend({}, CONSTANT.url_headers || {}, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }),
            });
		},


	});

	return TwoFAModel;
});