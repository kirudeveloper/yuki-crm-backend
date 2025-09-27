const { body, validationResult } = require('express-validator');
const EventSupabase = require('../models/EventSupabase');

class EventController {
  constructor() {
    this.getEventModel = () => EventSupabase;
  }

  // Get all events (filtered by company)
  async getAllEvents(req, res) {
    try {
      // Get company_id from authenticated user
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      console.log('🔍 Fetching events for company:', companyId);

      const Event = this.getEventModel();
      const events = await Event.findByCompanyId(companyId);

      res.json({
        success: true,
        message: 'Events retrieved successfully',
        data: events,
        count: events.length
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get event by ID (with company security)
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const Event = this.getEventModel();
      const event = await Event.findByIdAndCompany(id, companyId);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Event retrieved successfully',
        data: event
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Create new event
  async createEvent(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const companyId = req.user?.company_id;
      const userId = req.user?.id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const eventData = {
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        allDay: req.body.allDay || false,
        location: req.body.location,
        eventType: req.body.eventType || 'meeting',
        status: req.body.status || 'scheduled',
        priority: req.body.priority || 'medium',
        customerId: req.body.customerId,
        opportunityId: req.body.opportunityId,
        caseId: req.body.caseId,
        assignedTo: req.body.assignedTo,
        participants: req.body.participants || [],
        reminderMinutes: req.body.reminderMinutes || 15,
        notes: req.body.notes,
        company_id: companyId,
        created_by: userId
      };

      console.log('🔍 Creating event with data:', eventData);

      const Event = this.getEventModel();
      const newEvent = await Event.create(eventData);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: newEvent
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Update event (with company security)
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        allDay: req.body.allDay,
        location: req.body.location,
        eventType: req.body.eventType,
        status: req.body.status,
        priority: req.body.priority,
        customerId: req.body.customerId,
        opportunityId: req.body.opportunityId,
        caseId: req.body.caseId,
        assignedTo: req.body.assignedTo,
        participants: req.body.participants,
        reminderMinutes: req.body.reminderMinutes,
        notes: req.body.notes
      };

      const Event = this.getEventModel();
      const updatedEvent = await Event.updateByIdAndCompany(id, companyId, updateData);

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          message: 'Event not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent
      });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Delete event (with company security)
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const Event = this.getEventModel();
      const deleted = await Event.deleteByIdAndCompany(id, companyId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Event not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Search events (with company security)
  async searchEvents(req, res) {
    try {
      const { query } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const Event = this.getEventModel();
      const events = await Event.searchByCompany(companyId, query);

      res.json({
        success: true,
        message: 'Events search completed',
        data: events,
        count: events.length
      });
    } catch (error) {
      console.error('Error searching events:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new EventController();
