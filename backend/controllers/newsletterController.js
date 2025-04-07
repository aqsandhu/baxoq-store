const Newsletter = require('../models/newsletterModel');
const { validationResult } = require('express-validator');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeToNewsletter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, preferences } = req.body;

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });

    if (existingSubscription) {
      // If already subscribed, update preferences
      if (existingSubscription.isSubscribed) {
        existingSubscription.preferences = {
          ...existingSubscription.preferences,
          ...preferences,
        };
        await existingSubscription.save();
        return res.status(200).json({ 
          message: 'Subscription preferences updated',
          subscription: existingSubscription
        });
      } 
      // If previously unsubscribed, resubscribe
      else {
        existingSubscription.isSubscribed = true;
        existingSubscription.subscribedAt = Date.now();
        existingSubscription.unsubscribedAt = null;
        existingSubscription.preferences = {
          ...existingSubscription.preferences,
          ...preferences,
        };
        await existingSubscription.save();
        return res.status(200).json({ 
          message: 'Successfully resubscribed to newsletter',
          subscription: existingSubscription
        });
      }
    }

    // Create new subscription
    const subscription = new Newsletter({
      email,
      preferences: preferences || {
        swords: true,
        knives: true,
        accessories: true,
        promotions: true,
      },
    });

    const savedSubscription = await subscription.save();
    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
      subscription: savedSubscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Unsubscribe from newsletter
// @route   PUT /api/newsletter/unsubscribe
// @access  Public
const unsubscribeFromNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const subscription = await Newsletter.findOne({ email });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.isSubscribed = false;
    subscription.unsubscribedAt = Date.now();

    await subscription.save();
    res.status(200).json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all newsletter subscriptions
// @route   GET /api/newsletter
// @access  Private/Admin
const getNewsletterSubscriptions = async (req, res) => {
  try {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;
    
    const count = await Newsletter.countDocuments({});
    const subscriptions = await Newsletter.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ subscribedAt: -1 });
    
    res.json({
      subscriptions,
      page,
      pages: Math.ceil(count / pageSize),
      totalSubscriptions: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete newsletter subscription
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
const deleteNewsletterSubscription = async (req, res) => {
  try {
    const subscription = await Newsletter.findById(req.params.id);

    if (subscription) {
      await subscription.deleteOne();
      res.json({ message: 'Subscription removed' });
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterSubscriptions,
  deleteNewsletterSubscription,
};
