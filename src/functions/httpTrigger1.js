const { app } = require("@azure/functions");
const Handlebars = require("handlebars");
const { EmailClient } = require("@azure/communication-email");
const fs = require("fs");
const path = require("path");
const connectionString = "endpoint=https://emailqa1.unitedstates.communication.azure.com/;accesskey=F4V0jpWiQC58hQlzOuXLnPX3WVEMXyEX1gzO0pSYQi47SJuMXUEcJQQJ99AHACULyCps5mg0AAAAAZCSsff0";
const client = new EmailClient(connectionString);
app.http("httpTrigger1", {
  methods: ["POST"],
  handler: async (request, context) => {
    const requestData = await request.json();
    const subject = requestData.subject;
    const templateName = requestData.templateName;
    const dataTemplate = requestData.dataTemplate;
    const to = requestData.to;
    const templatePath = path.join(__dirname, templateName);
    const source = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(source);
    const html = template({ name: dataTemplate.name });
    const emailMessage = {
      senderAddress: "DoNotReply@3b43e784-477d-4977-8395-f851ec425bb5.azurecomm.net",
      content: {
        subject: subject,
        html: html,
      },
      recipients: {
        to: [{ address: to }],
      },
    };
    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    return { body: `email sent successfully` };
  },
});
