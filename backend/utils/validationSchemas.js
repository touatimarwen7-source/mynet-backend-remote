/**
 * Centralized Validation Schemas
 * Using Joi for comprehensive type and data validation
 */

const Joi = require('joi');

// Base schemas
const idSchema = Joi.number().integer().positive().required();
const uuidSchema = Joi.string().uuid().required();
const emailSchema = Joi.string().email().lowercase().required();
const dateSchema = Joi.date().iso().required();
const optionalDateSchema = Joi.date().iso().allow(null);

// Tender Schemas
const createTenderSchema = Joi.object({
  consultation_number: Joi.string().max(100).allow(null).allow(''),
  title: Joi.string().max(255).required(),
  description: Joi.string().max(5000).required(),
  category: Joi.string().max(100).required(),
  quantity_required: Joi.number().integer().positive().allow(null).allow(''),
  unit: Joi.string().max(50).allow(null).allow(''),
  publication_date: Joi.date().iso().allow(null).allow('').or(Joi.string()),
  deadline: Joi.date().iso().allow(null).allow('').or(Joi.string()),
  opening_date: Joi.date().iso().allow(null).allow('').or(Joi.string()),
  queries_start_date: Joi.date().iso().allow(null).allow('').or(Joi.string()),
  queries_end_date: Joi.date().iso().allow(null).allow('').or(Joi.string()),
  offer_validity_days: Joi.number().integer().positive().allow(null).allow(''),
  alert_type: Joi.string().max(100).allow(null).allow(''),
  is_public: Joi.boolean().allow(null),
  lots: Joi.array().allow(null),
  awardLevel: Joi.string().max(100).allow(null).allow(''),
  participation_eligibility: Joi.string().max(1000).allow(null).allow(''),
  mandatory_documents: Joi.array().allow(null),
  disqualification_criteria: Joi.string().max(1000).allow(null).allow(''),
  submission_method: Joi.string().max(100).allow(null).allow(''),
  sealed_envelope_requirements: Joi.string().max(1000).allow(null).allow(''),
  contact_person: Joi.string().max(255).allow(null).allow(''),
  contact_email: Joi.string().email().allow(null).allow(''),
  contact_phone: Joi.string().max(20).allow(null).allow(''),
  technical_specifications: Joi.string().max(5000).allow(null).allow(''),
  requirements: Joi.array().allow(null),
  attachments: Joi.array().allow(null),
  specification_documents: Joi.array().allow(null),
  evaluation_criteria: Joi.object().allow(null),
  budget_min: Joi.number().allow(null).allow(''),
  budget_max: Joi.number().allow(null).allow('')
}).unknown(true);

const updateTenderSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().max(5000),
  category: Joi.string().max(100),
  budget: Joi.number().positive(),
  currency: Joi.string().length(3).uppercase(),
  opening_date: dateSchema,
  closing_date: dateSchema,
  opening_location: Joi.string().max(500).allow(null),
  is_public: Joi.boolean()
});

// Offer Schemas
const createOfferSchema = Joi.object({
  tender_id: idSchema,
  supplier_id: idSchema,
  technical_proposal: Joi.string().max(5000).required(),
  financial_proposal: Joi.number().positive().required(),
  delivery_date: dateSchema,
  warranty_period: Joi.number().integer().min(0).allow(null),
  payment_terms: Joi.string().max(500).allow(null),
  currency: Joi.string().length(3).uppercase().required()
});

const evaluateOfferSchema = Joi.object({
  offer_id: idSchema,
  technical_score: Joi.number().min(0).max(100).required(),
  financial_score: Joi.number().min(0).max(100).required(),
  notes: Joi.string().max(1000).allow(null)
});

// Invoice Schemas
const createInvoiceSchema = Joi.object({
  po_id: idSchema,
  supplier_id: idSchema,
  amount: Joi.number().positive().required(),
  tax_amount: Joi.number().min(0).required(),
  invoice_number: Joi.string().max(50).required(),
  invoice_date: dateSchema,
  due_date: dateSchema
});

const markInvoiceAsPaidSchema = Joi.object({
  invoice_id: idSchema,
  payment_date: dateSchema,
  payment_method: Joi.string().max(50).allow(null)
});

// User Schemas
const userIdSchema = Joi.object({
  userId: idSchema
});

const updateUserRoleSchema = Joi.object({
  user_id: idSchema,
  role: Joi.string().valid('admin', 'super_admin', 'buyer', 'supplier', 'user').required()
});

const blockUserSchema = Joi.object({
  user_id: idSchema,
  reason: Joi.string().max(500).allow(null)
});

// Search Schemas
const searchSchema = Joi.object({
  query: Joi.string().max(255).required(),
  filters: Joi.object().allow(null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// Pagination Schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// Review Schemas
const createReviewSchema = Joi.object({
  target_id: idSchema,
  target_type: Joi.string().valid('supplier', 'buyer', 'tender').required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow(null),
  reviewer_id: idSchema
});

// Notification Schemas
const createNotificationSchema = Joi.object({
  user_id: idSchema,
  type: Joi.string().max(50).required(),
  title: Joi.string().max(255).required(),
  message: Joi.string().max(1000).required(),
  entity_type: Joi.string().max(50).allow(null),
  entity_id: idSchema.allow(null)
});

// Message Schemas
const createMessageSchema = Joi.object({
  sender_id: idSchema,
  recipient_id: idSchema,
  subject: Joi.string().max(255).required(),
  content: Joi.string().max(5000).required(),
  entity_type: Joi.string().max(50).allow(null),
  entity_id: idSchema.allow(null)
});

// Validation helper function
const validateSchema = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const details = error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message,
      type: d.type
    }));
    
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = details;
    throw err;
  }

  return value;
};

module.exports = {
  // Tender
  createTenderSchema,
  updateTenderSchema,
  
  // Offer
  createOfferSchema,
  evaluateOfferSchema,
  
  // Invoice
  createInvoiceSchema,
  markInvoiceAsPaidSchema,
  
  // User
  userIdSchema,
  updateUserRoleSchema,
  blockUserSchema,
  
  // Search & Pagination
  searchSchema,
  paginationSchema,
  
  // Review
  createReviewSchema,
  
  // Notification
  createNotificationSchema,
  
  // Message
  createMessageSchema,
  
  // Base schemas
  idSchema,
  uuidSchema,
  emailSchema,
  dateSchema,
  
  // Helper
  validateSchema
};
