
package TwoFA.util;

import java.util.Properties;

import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import java.util.concurrent.Callable;

import com.sun.mail.util.MailSSLSocketFactory;

public class MailUtil implements Callable<Boolean>{
	
	//private static final Logger logger = LoggerFactory.getLogger(Http4ClientUtil.class);

	private String email;
	private String code;
	private boolean flag;

	public MailUtil(String email, String code) {
		this.email = email;
		this.code = code;
	}

	// start a new thread when sending email 
	public Boolean call() {
		// properties
		Properties prop = new Properties();
		
		// set server host: gmail
		prop.put("mail.smtp.host", "smtp.gmail.com");
		// set protocal
		prop.put("mail.transport.protocol", "smtp");
		// auth or not 
		prop.put("mail.smtp.auth", true);
		// set timeout
		prop.put("mail.smtp.timeout", "5000");    
		prop.put("mail.smtp.connectiontimeout", "5000"); 
		
		for(int i = 0; i < 3; i++){
			try {
				// SSL
				MailSSLSocketFactory sf = null;
		    	sf = new MailSSLSocketFactory();
		    	// trust all hosts
		   		sf.setTrustAllHosts(true);
		    	prop.put("mail.smtp.ssl.enable", "true");
		    	prop.put("mail.smtp.ssl.socketFactory", sf);

		    	// session
		    	Session session = Session.getDefaultInstance(prop, new Authenticator() {
		      	// auth info，
		      		public PasswordAuthentication getPasswordAuthentication() {      			
		      		// 
		        		return new PasswordAuthentication("username", "password");
		        	}
				});

		    	session.setDebug(true);

			    // create a message		    
			    Message message = new MimeMessage(session);
			    // sendor
			    message.setFrom(new InternetAddress("username@gmail.com"));
			    // receiver
			    message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
			    // 
			    message.setSubject("Stubconnect Verification Code");
			    String content = "<html><head></head><body><h2>The verification code is: " + code +"</h2></body></html>";

			    message.setContent(content, "text/html;charset=UTF-8");

			    // send email
			    Transport transport = session.getTransport();
			    transport.connect();
			    transport.sendMessage(message, message.getAllRecipients());
			    transport.close();
				System.out.println(i);
			    flag = true;
			    break;
			} catch(Exception e) {
				e.printStackTrace();
				flag = false;
				//continue;
				//Date date = new Date();
				//logger.info("Domain=Stubconnect method=sendEmail message=send email failed at {}", date.toString());

			}

		}
		return flag;
		
/*		try {
			// SSL
			MailSSLSocketFactory sf = null;
	    	sf = new MailSSLSocketFactory();
	    	// trust all hosts
	   		sf.setTrustAllHosts(true);
	    	prop.put("mail.smtp.ssl.enable", "true");
	    	prop.put("mail.smtp.ssl.socketFactory", sf);

	    	// session
	    	Session session = Session.getDefaultInstance(prop, new Authenticator() {
	      	// auth info，
	      		public PasswordAuthentication getPasswordAuthentication() {      			
	      		// 
	        		return new PasswordAuthentication("stubhubconnect", "ice_19941024");
	        	}
			});

	    	session.setDebug(true);

		    // create a message		    
		    Message message = new MimeMessage(session);
		    // sendor
		    message.setFrom(new InternetAddress("stubhubconnect@gmail.com"));
		    // receiver
		    message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
		    // 
		    message.setSubject("Stubconnect Verification Code");
		    String content = "<html><head></head><body><h2>The verification code is: " + code +"</h2></body></html>";

		    message.setContent(content, "text/html;charset=UTF-8");

		    // send email
		    Transport transport = session.getTransport();
		    transport.connect();
		    transport.sendMessage(message, message.getAllRecipients());
		    transport.close();
		    flag = true;

		} catch(Exception e) {
			e.printStackTrace();
			flag = false;
			//Date date = new Date();
			//logger.info("Domain=Stubconnect method=sendEmail message=send email failed at {}", date.toString());

		}
*/
	}

}
