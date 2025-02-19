const cuid = require('cuid');
const db = require('./db');

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product',
    index: true,
    required: true
  }],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
});

/**
 * List orders
 * @param {Object} options
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options;

  const productQuery = productId ? { products: productId } : {};
  const statusQuery = status ? { status: status } : {};

  const query = { ...productQuery, ...statusQuery };

  return await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit);
}

/**
 * Get an order
 * @param {String} _id
 * @returns {Promise<Object>}
 */
async function get(_id) {
  return await Order.findById(_id).populate('products').exec();
}

/**
 * Create an order
 * @param {Object} fields
 * @returns {Promise<Object>}
 */
async function create(fields) {
  const order = await new Order(fields).save();
  await order.populate('products');
  return order;
}

/**
 * Update an order
 * @param {String} _id
 * @param {Object} fields
 * @returns {Promise<Object>}
 */
async function update(_id, fields) {
  return await Order.findByIdAndUpdate(_id, fields, { new: true }).populate('products');
}

/**
 * Delete an order
 * @param {String} _id
 * @returns {Promise<Object>}
 */
async function edit(_id, change) {
    return await Order.findByIdAndUpdate(_id, change, { new: true }).populate('products');
  }
  
  /**
   * Delete an order
   * @param {String} _id
   * @returns {Promise<Object>}
   */
  /**
 * Destroy an order
 * @param {String} _id
 */
async function destroy(_id) {
    await Order.findByIdAndDelete(_id);
}
  
  module.exports = { list, get, create, update, edit, destroy };