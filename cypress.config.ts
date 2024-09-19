import { defineConfig } from 'cypress';
import {getEmailAccount} from "./cypress/plugins/email-account";

export default defineConfig({
  e2e: {
    async setupNodeEvents(on) {
      let emailAccount
      on('task', {
        // deconstruct the individual properties
        async getUserEmail(user) {
          emailAccount = await getEmailAccount(user.email, user.password)
          return emailAccount.email;
        },

        async getLastEmail(user) {
          emailAccount = await getEmailAccount(user.email, user.password)
          return emailAccount.getLastEmail();
        },

        async getLatestEmailBySubject(arg:{user, subject: string}){
          emailAccount = await getEmailAccount(arg.user.email, arg.user.password);
          return emailAccount.getLatestEmailBySubject({user: arg.user, subject: arg.subject});
        },
      })
    },

    projectId: 'unbench-platform-cypress',
    baseUrl: 'https://test.kitrum.dev',
    defaultCommandTimeout: 10000,
    videoUploadOnPasses: false,
    video: false,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: true,
      json: true,
    },
    supportFile: 'cypress/support/e2e.{js,jsx,ts,tsx}'
  },
});
