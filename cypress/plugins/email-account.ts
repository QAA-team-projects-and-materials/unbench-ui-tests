const adminUser = require('../fixtures/data.json')["signUpUser"];
// used to check the email inbox
const imaps = require('imap-simple')
// used to parse emails from the inbox
const simpleParser = require('mailparser').simpleParser

export const getEmailAccount = async (email?: string, password?: string) => {
  // Connect to existing Ethereal email account
  // If user is undefined, then it defaults to admin
  // TODO - add the ability to choose what email account to work with
  //  (https://docs.cypress.io/guides/guides/environment-variables#Single-test-configuration)
  let testAccount;
  if (email !== 'undefined' && password !== 'undefined'){
    testAccount = {userEmail: email,
      userPassword: password}
  } else {
    testAccount = {userEmail: adminUser.adminUserEMailCredentials.Email,
      userPassword: adminUser.adminUserEMailCredentials.Password}
  }

  const emailConfig = {
    imap: {
      user: testAccount.userEmail,
      password: testAccount.userPassword,
      host: 'ethereal.email',
      port: 993,
      tls: true,
      authTimeout: 10000,
    },
  }
  console.log('TestUser email account %s', testAccount.userEmail)
  console.log('for debugging, the password is %s', testAccount.userPassword)

  return {
    email: testAccount.userEmail,

    /**
     * Utility method for getting the last email
     * for the Ethereal email account created above.
     */
    async getLastEmail(user) {
      // makes debugging very simple
      console.log('getting the last email')
      console.log(emailConfig)

      try {
        const connection = await imaps.connect(emailConfig)

        // grab up to 50 emails from the inbox

        const searchCriteria = ['1:50']
        const fetchOptions = {
          bodies: [''],
        }

        await connection.openBox('INBOX')

        const messages = await connection.search(searchCriteria, fetchOptions)
        // and close the connection to avoid it hanging
        connection.end()

        if (!messages.length) {
          console.log('cannot find any emails')
          return null
        } else {
          console.log('there are (%d) messages', messages.length)
          // grab the last email
          const mail = await simpleParser(
            messages[messages.length - 1].parts[0].body,
          )
          console.log(mail.subject)
          console.log(mail.text)

          // and returns the main fields
          return {
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
          }
        }
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async getLatestEmailBySubject(args:{user, subject: string}) {
      const subject = args.subject
      // makes debugging very simple
      console.log('getting the last email')
      console.log(emailConfig)

      try {
        const connection = await imaps.connect(emailConfig)

        // grab up to 50 emails from the inbox
        await connection.openBox('INBOX')
        const timeNow = new Date()
        const searchCriteria = ['ALL', ['SUBJECT', subject], ['SINCE', timeNow.toISOString().slice(0,10)]]
        const fetchOptions = {
          bodies: [''],
        }
        const messages = await connection.search(searchCriteria, fetchOptions)
        // and close the connection to avoid it hanging
        connection.end()

        if (!messages.length) {
          console.log('cannot find any emails')
          return null
        } else {
          console.log('there are (%d) messages', messages.length)
          // grab the last email
          const mail = await simpleParser(
              messages[messages.length - 1].parts[0].body,
          )
          console.log(mail.subject)
          console.log(mail.text)

          // and returns the main fields
          return {
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
          }
        }
      } catch (e) {
        cy.log(e)
        return null
      }
    },
  }
}
