const { ImapFlow } = require("imapflow")

export const getLastEmail = async (user, pass) => {
    debugger
    let client = new ImapFlow({
        host: "ethereal.email",
        port: 993,
        secure: true,
        auth: {
            user: user,
            pass: pass
        }
    })
    await client.connect()
    let message

    let lock = await client.getMailboxLock("INBOX")
    try {
        message = await client.fetchOne(client.mailbox.exists, { source: true })

    } finally {
        await client.messageFlagsAdd({ seen: false }, ["\\Seen"])
        lock.release()
    }
    await client.logout()

    if (!message)
        return message
    else
        return message.source

}
