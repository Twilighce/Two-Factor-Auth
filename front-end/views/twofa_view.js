define([
	'underscore',
	'backbone',
	'views/login-base-view',
	'models/twofa_model',
	'models/checkemail-model',
	'i18n',
	'global_context',
	'helpers/login-helper',
	'models/session-validate-model',
	'models/session-model',
	'shcookie',
	'storage'
], function(_, Backbone, LoginBaseView, TwoFAModel, 
	CheckEmailModel, i18n, gc, LoginHelper, SessionValidateModel, 
	SessionModel, SHCookie, storage) {

	'use strict';

	var TwoFAView = LoginBaseView.extend({

		initialize: function()  {
			console.log('---TwoFA View in initialize()', this);
			this.model = new TwoFAModel();
            this.selectTmpl();
		},

		template: gc.appFolder + '/twofa',

		events: {
			'click #save': 'confirmInput',
			'click #verify': 'twoFA',
			'click #resend': 'sendEmail'
		},

		uiEl: {
			'$email': '#email',
			'$inputCode': '#inputCode'
		},

		// email exists or not 
		selectTmpl: function() {
			var userdata = storage.getItem("userData", "session");
			var session_id=storage.getItem("xxx","session"); 
			var modeldata;

			if (!session_id) {
				var weblink=window.location.href;
                window.location.href=weblink.substring(0,weblink.lastIndexOf("/"));
                console.log(window.location.href);
                return;
			}
			else {
				if (userdata.mailExist == 1) {
					console.log('---email exists---');
					modeldata = {
						emailExists: true,
					};
					this.countTime();
				} else {
					console.log('---email not exists---');
					modeldata = {
						emailExists: false,
					}
				}
				this.model.set(modeldata);
			}
		},

		countTime: function() {
			var _this = this;

			var wait = 120;
			var interval = setInterval(function(){
				var $resend = $("#resend");
				$resend.html("Resend(" + wait + ")");
				if(wait > 0) {
					$resend.addClass('disabled');
					$resend.attr("style", "opacity:0.2");
            		$resend.attr('disabled', true); 
            		//_this.disableSend();
					wait--;
					$resend.html("Resend(" + wait + ")");

				} else{
					clearInterval(interval);
					_this.enableSend();
					$resend.attr("style", "opacity:1");
					return;
				}
			}, 1000);			
		},


		// let user confirm the email address
		confirmInput: function() {
			var email = this.uiEl.$email.val();
			var email_filter = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			var verifyError;
			
			this.clearErrors();

			if(!email_filter.test(email)) {
				verifyError = 'error-email';
				this.processError(verifyError);
			} else {

				this.disableSave();
				if (window.confirm("please confirm your email address is:   " + email)) {     			
	     			console.log("confirm email input: right");
	     			this.saveEmail(email);
	    		} else {
	    			console.log("confirm email input: wrong");
	    			this.enableSave();
	    		}	    		
			}
		},


		// call update user api
		saveEmail: function(email) {
			
			var session_id = storage.getItem("xxx", "session");
			var userdata = storage.getItem("userData", "session");
			var userName = userdata.name.loginName;
			var firstName = userdata.name.firstName;
			var lastName = userdata.name.lastName;
			var accountType = userdata.role;
			var teamInformation = userdata.teamId;
			
			var data = {
						'accountType': accountType,
						'teamInformation': teamInformation,				
						'firstName': firstName,
						'lastName': lastName,
						'email': email,
						'userName': userName,
						};
			var verifyError; 
			//this.sendEmail(email);
				//return true;
			var _this = this;
			_this.disableSave();
			_this.disableSend();
			_this.countTime();

			this.model.sendEmail(data, session_id)
				.done(function(response){
					if(response.response_code == 200) {
						//						
						console.log("successfully sent");
						_this.publishEvent('headerEventHandler:showSuccess', i18n.get('xxx.scripts.views.twofaView.sendSuccess.message'));
					}
					else{
						//
						console.log("send error");
						_this.enableSend();

					}
				})
				.fail(function(xhr, statusText){
					verifyError = 'error-default';
					console.log('send fail', this);
					_this.processError(verifyError);
					_this.enableSend();

				});			
		},


		sendEmail: function() {
			var sessionid = storage.getItem(xxx", "session");
			var userdata = storage.getItem("userData", "session");
			var userName = userdata.name.loginName;
			var firstName = userdata.name.firstName;
			var lastName = userdata.name.lastName;
			var accountType = userdata.role;
			var teamInformation = userdata.teamId;

			var data = {
						'accountType': accountType,
						'teamInformation': teamInformation,				
						'firstName': firstName,
						'lastName': lastName,
						/*'email': email,*/
						'userName': userName,
						};
			
			var _this = this;
			this.countTime();

			this.model.sendEmail(data, sessionid)
				.done(function(response){
					if(response.response_code == 200) {
						console.log("successfully sent");
					}
					else {
						_this.publishEvent('headerEventHandler:showError', i18n.get('xxx.scripts.views.twofaView.sendError.message'));
						console.log("sent error");
						_this.enableSend();
					}
				})
				.fail(function(){
					_this.publishEvent('headerEventHandler:showError', i18n.get('xxx.scripts.views.twofaView.sendError.message'));
					console.log("sent fail");
					_this.enableSend();
				});
		},

		twoFA: function(e) {

			e.preventDefault();
			e.stopPropagation();
			this.clearErrors();

			var _this = this;
			var verifyError;
			var inputCode=this.$el.find('#inputCode').val().trim();
			var code_filter = /[a-zA-Z0-9]{6}/;			
			
			var session_id = storage.getItem("xxx", "session");		
			var verifydata = {
							inputCode: inputCode
							};

			if(!code_filter.test(inputCode)) {
				console.log("code invalid");
				verifyError = 'error-Code';
				this.processError(verifyError);
			}
			else {
				this.model.twoFA(verifydata, session_id)
				.done(function(response){
					if(response.response_code == 200) {
						_this.publishEvent('!router:route', 'search');

						storage.setItem("USER_VERIFIED",1,"session");

					} else {
						//_this.displayError(i18n.get('xxx.commonText.verifyfailure'), 'twofa-error');
						console.log("verify error");
						verifyError = 'error-Code';
						storage.setItem("USER_VERIFIED",0,"session");
						//_this.processError(verifyError);
						_this.publishEvent('headerEventHandler:showError', i18n.get('xxx.scripts.views.twofaView.verifyError.message'));
						_this.enableSend();
					}
				})
				.fail(function(e) {
					verifyError = 'error-default';
					console.log("verify fail");
					storage.setItem("USER_VERIFIED",0,"session");
					_this.publishEvent('headerEventHandler:showError', i18n.get('xxx.scripts.views.twofaView.verifyError.message'));
					_this.enableSend();
				});
			}
		},

		
		
		processError: function(error) {

			switch(error) {
				case 'error-email':
					this.uiEl.$email.addClass('error');
					this.uiEl.$email.next().append(i18n.get('xxx.scripts.views.twofaView.error.email')).removeClass('hidden');
					break;
				case 'error-Code':
					this.uiEl.$inputCode.addClass('error');
					this.uiEl.$inputCode.next().append(i18n.get('xxxt.scripts.views.twofaView.error.code')).removeClass('hidden');
					break;
				case 'error-default':
					this.uiEl.$inputCode.next().append(i18n.get('xxx.scripts.views.twofaView.error.default')).removeClass('hidden');
					break;
				default:
			}
		},

		clearErrors: function() {
			this.uiEl.$email.removeClass('error');
			this.uiEl.$inputCode.removeClass('error');
			this.$el.find('.error-box').empty().addClass('hidden');
		},

		disableSave: function() {
        	var buttonSelectorIn = 'button[id=save]';
            var $saveButton = this.$el.find(buttonSelectorIn);

            $saveButton.data('title', $saveButton.html());
            $saveButton.addClass('disabled');
            $saveButton.attr('disabled', true);
 
            $('#email').attr('disabled',true); 					
		},

		enableSave: function() {
			var buttonSelectorIn = 'button[id=save]';
            var $saveButton = this.$el.find(buttonSelectorIn);

            if ($saveButton.hasClass('disabled')) {
                $saveButton.removeClass('disabled').text($saveButton.data('title'));
            }
            $saveButton.attr('disabled', false);
            $('#email').attr('disabled',false);
		},

		disableSend: function() {
        	var buttonSelectorIn = 'button[id=resend]';
            var $saveButton = this.$el.find(buttonSelectorIn);

            $saveButton.data('title', $saveButton.html());
            $saveButton.addClass('disabled');
            $saveButton.attr('disabled', true); 					
		},

		enableSend: function() {
			var buttonSelectorIn = 'button[id=resend]';
            var $saveButton = this.$el.find(buttonSelectorIn);

            if ($saveButton.hasClass('disabled')) {
                $saveButton.removeClass('disabled').text($saveButton.data('title'));
            }
            $saveButton.attr('disabled', false);
		},

	});

	return TwoFAView;
});
