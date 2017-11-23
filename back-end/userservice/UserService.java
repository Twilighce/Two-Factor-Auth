// save email
public boolean updateUser(CreateUserRequest createUser, String sessionid) {

	......
			
	return true;
}

// Send email
public boolean sendEmail(CreateUserRequest createUser, String sessionid) {
		
	boolean flag;
	tUser updateUser=UserMgt.getUserByLoginName(createUser.getUserName());
	if(updateUser==null){
		flag = false;
	}
	String email = updateUser.getEmail();
	if(email==null){
		flag = false;
	}				
	logger.info("Domain=xx method=sendEmail message=\"send Email to User={} ",email);		
	flag = UserMgt.sendEmail(email, sessionid);
    return flag;
}
	
// twoFA	
public boolean twoFA(String inputeCode, String sessionid) {
	return UserMgt.twoFA(inputeCode, sessionid);
}