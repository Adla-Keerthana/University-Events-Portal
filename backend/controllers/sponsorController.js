import Sponsor from '../models/Sponsor.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all sponsors
// @route   GET /api/sponsors
// @access  Public
export const getSponsors = asyncHandler(async (req, res) => {
    const sponsors = await Sponsor.find({}).populate('events', 'title date');
    res.json(sponsors);
});

// @desc    Get sponsor by ID
// @route   GET /api/sponsors/:id
// @access  Public
export const getSponsorById = asyncHandler(async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id).populate('events', 'title date venue');
    
    if (sponsor) {
        res.json(sponsor);
    } else {
        res.status(404);
        throw new Error('Sponsor not found');
    }
});

// @desc    Create a new sponsor
// @route   POST /api/sponsors
// @access  Private
export const createSponsor = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        phone,
        company,
        sponsorshipType,
        amount,
        events,
        logo
    } = req.body;

    const sponsor = await Sponsor.create({
        name,
        email,
        phone,
        company,
        sponsorshipType,
        amount,
        events,
        logo
    });

    if (sponsor) {
        // Update events with sponsor
        await Event.updateMany(
            { _id: { $in: events } },
            { $push: { sponsors: sponsor._id } }
        );

        res.status(201).json(sponsor);
    } else {
        res.status(400);
        throw new Error('Invalid sponsor data');
    }
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

    const updatedSponsor = await Sponsor.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
    ).populate('events', 'title date');

    res.json(updatedSponsor);
});

// @desc    Delete sponsor
// @route   DELETE /api/sponsors/:id
// @access  Private/Admin
export const deleteSponsor = asyncHandler(async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
        res.status(404);
        throw new Error('Sponsor not found');
    }

    // Remove sponsor from associated events
    await Event.updateMany(
        { sponsors: sponsor._id },
        { $pull: { sponsors: sponsor._id } }
    );

    await sponsor.remove();
    res.json({ message: 'Sponsor removed' });
});

// @desc    Approve sponsor
// @route   PATCH /api/sponsors/:id/approve
// @access  Private/Admin
export const approveSponsor = asyncHandler(async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
        res.status(404);
        throw new Error('Sponsor not found');
    }

    sponsor.status = 'approved';
    await sponsor.save();

    // Create notifications for event organizers
    const events = await Event.find({ _id: { $in: sponsor.events } });
    const notifications = events.map(event => ({
        recipient: event.organizer,
        event: event._id,
        type: 'sponsorship_approved',
        message: `${sponsor.name} from ${sponsor.company} has been approved as a ${sponsor.sponsorshipType} sponsor for "${event.title}"`
    }));

    await Notification.insertMany(notifications);

    res.json(sponsor);
});

// @desc    Reject sponsor
// @route   PATCH /api/sponsors/:id/reject
// @access  Private/Admin
export const rejectSponsor = asyncHandler(async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
        res.status(404);
        throw new Error('Sponsor not found');
    }

    sponsor.status = 'rejected';
    await sponsor.save();

    // Create notifications for event organizers
    const events = await Event.find({ _id: { $in: sponsor.events } });
    const notifications = events.map(event => ({
        recipient: event.organizer,
        event: event._id,
        type: 'sponsorship_rejected',
        message: `${sponsor.name} from ${sponsor.company}'s sponsorship request for "${event.title}" has been rejected`
    }));

    await Notification.insertMany(notifications);

    res.json(sponsor);
}); 