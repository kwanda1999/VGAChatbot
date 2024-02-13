const express = require ('express');
const bodyParser = require('body-parser');
const {v4: uuidv4 } = require('uuid');
const { SessionsClient } = require('@google-cloud/dialogflow');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post ('/webhook', async (req, res)=> {
    const {message} = req.body;
    const sessionId = uuidv4 ();

    const response = await sendMessageToDialogflow (sessionId, message);

    res.json ({ fulfillmentText:response});

});

async function sendMessageToDialogflow (sessionId, message) {
    const sessionClient = new SessionsClient ();
    const sessionPath = sessionClient.sessionPath (process.env.PROJECT_ID, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
        text: {
        text: message,
        languageCode: 'en-UK',
        },
        },
    },

    const [response] = await sessionClient .detectIntent (request);
    return response.queryResult.fulfillmentText;
}

app.listen(port, () => {
    console.log('Server is running on portr ${port}');
});

