import mongoose from 'mongoose';

const productionRequestSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'liter', 'gram', 'piece', 'packet'],
    default: 'kg'
  },
  dateNeeded: {
    type: Date,
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  notes: {
    type: String,
    trim: true
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const ProductionRequest = mongoose.model('ProductionRequest', productionRequestSchema);

export default ProductionRequest; // Changed from module.exports