// save email
public void updateUser(User user) {
	UserDao.connectUser(user);		
}

// send email
public boolean sendEmail(String email, String sessionid){
	String verifyCode = CodeUtil.generateVerificationCode();
	Session session = sessionDao.findBySessionGuid(sessionid);
	session.setLastUpdatedBy(verifyCode);
	sessionDao.updateSession(session);		 	
	
	// start a new thread to send email	 	
	MailUtil callable1 = new MailUtil(email, verifyCode);                       
	        
	FutureTask<Boolean> futureTask1 = new FutureTask<Boolean>(callable1);
	ExecutorService executor = Executors.newFixedThreadPool(2);        
	executor.execute(futureTask1);  
	        
	System.out.println("verifyCode is: " + verifyCode);
	boolean flag;
	try {
		flag = futureTask1.get();
	} catch (InterruptedException e) {
	// TODO Auto-generated catch block
		e.printStackTrace();
		flag = false;
	} catch (ExecutionException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		flag = false;
	}
	return flag;
}
	 
// twoFA
public boolean twoFA(String inputeCode, String sessionid) {
	Session session = sessionDao.findBySessionGuid(sessionid);
	String verifyCode = session.getLastUpdatedBy();
	if(inputeCode.equals(verifyCode)) {
		 return true;
	}		 	
	return false;
}