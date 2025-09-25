const express = require('express');
const router = express.Router();

// WhatsApp webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WhatsApp webhook verified successfully!');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// WhatsApp webhook to receive messages
router.post('/webhook', (req, res) => {
  const body = req.body;

  // Check if this is an event from a WhatsApp Business Account
  if (body.object === 'whatsapp_business_account') {
    body.entry.forEach(function(entry) {
      const webhookBody = entry.changes[0];
      
      if (webhookBody.field === 'messages') {
        const value = webhookBody.value;
        
        if (value.messages) {
          value.messages.forEach(function(message) {
            const fromNumber = message.from; // Customer's phone number
            const messageId = message.id;
            const messageType = message.type;
            
            console.log('📱 Received WhatsApp message:', {
              from: fromNumber,
              messageId: messageId,
              type: messageType,
              timestamp: message.timestamp
            });

            // Handle different message types
            if (messageType === 'text') {
              const textMessage = message.text.body;
              console.log('📝 Text message:', textMessage);
              
              // Here you would:
              // 1. Find the customer by phone number
              // 2. Store the message in your database
              // 3. Optionally send a push notification to the CRM user
              
              // Example response (auto-reply)
              // sendWhatsAppMessage(fromNumber, "Thank you for your message. We'll get back to you soon!");
            }
          });
        }
        
        // Mark messages as read
        if (value.statuses) {
          value.statuses.forEach(function(status) {
            console.log('📊 Message status update:', {
              messageId: status.id,
              status: status.status,
              timestamp: status.timestamp
            });
            
            // Update message status in your database
          });
        }
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp Business Account
    res.sendStatus(404);
  }
});

// Send a WhatsApp message
router.post('/send-message', async (req, res) => {
  try {
    const { to, message, type = 'text' } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }

    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      return res.status(500).json({
        success: false,
        error: 'WhatsApp API credentials not configured'
      });
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: type,
      text: {
        body: message
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.ok && data.messages) {
      res.json({
        success: true,
        messageId: data.messages[0].id,
        data: data
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.error?.message || 'Failed to send message',
        details: data
      });
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get WhatsApp phone number info
router.get('/phone-info', async (req, res) => {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      return res.status(500).json({
        success: false,
        error: 'WhatsApp API credentials not configured'
      });
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      res.json({
        success: true,
        data: data
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.error?.message || 'Failed to get phone number info',
        details: data
      });
    }
  } catch (error) {
    console.error('Error getting phone number info:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
