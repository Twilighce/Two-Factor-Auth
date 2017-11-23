//send email	 
@RequestMapping(value="/sendEmail", method=RequestMethod.POST)
@ResponseBody 	
public BaseResponse sendEmail(@RequestBody CreateUserRequest user, String sessionid) {
		 
	if(sessionid==null || sessionid.trim().isEmpty()) {
		logger.error("Domain=xx method=twoFA message=\"session is null\"");
		return new BaseResponse(401,"User login session has issue!");

	boolean userFlag=userService.updateUser(user, sessionid);
	if(!userFlag){
		logger.error("Domain=xx, method=sendEmailmessage= no such user with user name={}", user.getUserName());
		return new BaseResponse(400, "No such user with user name "+ user.getUserName());
	}	
		 
	boolean emailFlag = userService.sendEmail(user, sessionid);
	if(!emailFlag){
		logger.error("Domain= xx, method=sendEmail  message=\"email is empty\"");
		return new BaseResponse(400, "send email error!");
	}
	//userService.sendEmail(user, sessionid);	 
	return new BaseResponse(200,"email has been successfully sent!");
}
	 
// verify
@RequestMapping(value = "/twofa",method=RequestMethod.POST)
@ResponseBody
public BaseResponse twoFA(String inputCode, String sessionid){
	if(sessionid==null || sessionid.trim().isEmpty()) {
		logger.error("Domain=xx method=twoFA message=\"session is null\"");
		return new BaseResponse(401,"User login session has issue!");
	}
	
	if(inputCode==null || inputCode.trim().isEmpty()){			 
		logger.error("Domain=xx method=xx twoFA message=\"inputCode is empty\"");
		return new BaseResponse(400,"inputCode is empty!");
	}
		 
	boolean verifyFlag = userService.twoFA(inputCode, sessionid);
	if(!verifyFlag) {
		logger.info("Domain=xx, method= twoFA,  message= input code is invalid for input code={}", inputCode);
		return new BaseResponse(400, "Input code invalid!");
	}
		 
	return new BaseResponse(200, "Successfully verified!");
}