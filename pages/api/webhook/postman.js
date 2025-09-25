import { handleWebhook } from '../../../scripts/postman-webhook-handler.js';

/**
 * API endpoint to receive Postman webhooks
 * This triggers automatic MCP tool generation when the collection is updated
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Received Postman webhook at:', new Date().toISOString());
  console.log('Webhook payload:', JSON.stringify(req.body, null, 2));

  try {
    // Verify webhook signature if provided
    const signature = req.headers['x-postman-signature'];
    if (signature && process.env.POSTMAN_WEBHOOK_SECRET) {
      // TODO: Implement signature verification
      console.log('Webhook signature:', signature);
    }

    // Process webhook asynchronously (don't wait for completion)
    handleWebhook(req.body)
      .then(result => {
        console.log('✅ Webhook processed successfully:', result);
      })
      .catch(error => {
        console.error('❌ Webhook processing failed:', error);
      });

    // Respond immediately to Postman
    res.status(200).json({
      received: true,
      timestamp: new Date().toISOString(),
      message: 'Webhook received and processing started'
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}