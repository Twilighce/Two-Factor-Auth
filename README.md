# Two-Factor-Auth

>***Multi-factor authentication (MFA)*** is a method of computer access control in which a user is granted access only after successfully presenting several separate pieces of evidence to an authentication mechanism – typically at least two of the following categories: knowledge (something they know), possession (something they have), and inherence (something they are).

>***Two-factor authentication (also known as 2FA)*** is a method of confirming a user's claimed identity by utilizing a combination of two different components. Two-factor authentication is a type of multi-factor authentication.


在我的项目中，TwoFA 需求如下：

- 用户登录时，若该用户已保存过邮箱，则直接向用户邮箱发送验证码，用户填写验证码完成注册：

![TwoFA_2](http://oimbmvqt3.bkt.clouddn.com/TWOFA_2.PNG)

- 若该用户未保存过邮箱，先提示用户保存邮箱，保存后发送验证码邮件，最后填写验证码完成注册：

![twofa](http://oimbmvqt3.bkt.clouddn.com/TWOFA_1.PNG)
