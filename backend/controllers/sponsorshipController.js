import Sponsor from '../models/Sponsor.js';
import SponsorshipAnalytics from '../models/SponsorshipAnalytics.js';
import Event from '../models/Event.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new sponsor
// @route   POST /api/sponsors
// @access  Private/Admin
export const createSponsor = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        phone,
        company,
        sponsorshipType,
        amount,
        logo
    } = req.body;

    const sponsor = await Sponsor.create({
        name,
        email,
        phone,
        company,
        sponsorshipType,
        amount,
        logo
    });

    res.status(201).json(sponsor);
});

// @desc    Update sponsor
// @route   PUT /api/sponsors/:id
// @access  Private/Admin
export const updateSponsor = asyncHandler(async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
        res.status(404);
        throw new Error('Sponsor not found');
    }

    Object.keys(req.body).forEach(key => {
        sponsor[key] = req.body[key];
    });

    const updatedSponsor = await sponsor.save();
    res.json(updatedSponsor);
});

// @desc    Get sponsor analytics
// @route   GET /api/sponsors/:id/analytics
// @access  Private/Admin
export const getSponsorAnalytics = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const query = { sponsor: req.params.id };

    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const analytics = await SponsorshipAnalytics.find(query)
        .populate('event', 'title category')
        .sort({ createdAt: -1 });

    // Calculate summary metrics
    const summary = {
        totalImpressions: analytics.reduce((sum, a) => sum + a.advertisement.impressions, 0),
        totalClicks: analytics.reduce((sum, a) => sum + a.advertisement.clicks, 0),
        totalEngagement: {
            likes: analytics.reduce((sum, a) => sum + a.advertisement.engagement.likes, 0),
            shares: analytics.reduce((sum, a) => sum + a.advertisement.engagement.shares, 0),
            comments: analytics.reduce((sum, a) => sum + a.advertisement.engagement.comments, 0)
        },
        totalReach: analytics.reduce((sum, a) => sum + a.audienceReach.total, 0),
        totalConversions: {
            leads: analytics.reduce((sum, a) => sum + a.conversionMetrics.leads, 0),
            inquiries: analytics.reduce((sum, a) => sum + a.conversionMetrics.inquiries, 0),
            sales: analytics.reduce((sum, a) => sum + a.conversionMetrics.sales, 0)
        }
    };

    res.json({
        analytics,
        summary
    });
});

// @desc    Update advertisement metrics
// @route   PUT /api/sponsors/:id/analytics/:eventId
// @access  Private/Admin
export const updateAdvertisementMetrics = asyncHandler(async (req, res) => {
    const { impressions, clicks, engagement } = req.body;

    const analytics = await SponsorshipAnalytics.findOne({
        sponsor: req.params.id,
        event: req.params.eventId
    });

    if (!analytics) {
        res.status(404);
        throw new Error('Analytics record not found');
    }

    if (impressions) analytics.advertisement.impressions += impressions;
    if (clicks) analytics.advertisement.clicks += clicks;
    if (engagement) {
        analytics.advertisement.engagement.likes += engagement.likes || 0;
        analytics.advertisement.engagement.shares += engagement.shares || 0;
        analytics.advertisement.engagement.comments += engagement.comments || 0;
    }

    const updatedAnalytics = await analytics.save();
    res.json(updatedAnalytics);
});

// @desc    Add sponsor feedback
// @route   POST /api/sponsors/:id/feedback
// @access  Private
export const addSponsorFeedback = asyncHandler(async (req, res) => {
    const { eventId, rating, comment } = req.body;

    const analytics = await SponsorshipAnalytics.findOne({
        sponsor: req.params.id,
        event: eventId
    });

    if (!analytics) {
        res.status(404);
        throw new Error('Analytics record not found');
    }

    analytics.feedback.push({
        user: req.user._id,
        rating,
        comment
    });

    const updatedAnalytics = await analytics.save();
    res.json(updatedAnalytics);
});

// @desc    Get sponsorship tiers
// @route   GET /api/sponsors/tiers
// @access  Public
export const getSponsorshipTiers = asyncHandler(async (req, res) => {
    const tiers = {
        Gold: {
            amount: 50000,
            benefits: [
                'Prime logo placement',
                'Speaking opportunity',
                'Exclusive branding rights',
                'Full page advertisement',
                'Social media mentions'
            ]
        },
        Silver: {
            amount: 25000,
            benefits: [
                'Secondary logo placement',
                'Half page advertisement',
                'Social media mentions',
                'Booth space'
            ]
        },
        Bronze: {
            amount: 10000,
            benefits: [
                'Logo placement',
                'Quarter page advertisement',
                'Social media mention'
            ]
        }
    };

    res.json(tiers);
}); 