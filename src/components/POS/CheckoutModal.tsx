import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';
import { generateReceipt } from '../../utils/receipt';
import { CustomerSearchInput, CustomerDetails } from './CustomerSearch';
import type { Customer } from '../../types/customer';
import type { Transaction } from '../../types';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { cart, getCartTotal, addTransaction, clearCart } = usePOSStore();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cardVoucher, setCardVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getCartTotal();
  const finalTotal = total - discount;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (paymentMethod === 'card' && !cardVoucher.trim()) {
      newErrors.cardVoucher = 'Card payment voucher number is required';
    }

    if (discount < 0 || discount > total) {
      newErrors.discount = 'Invalid discount amount';
    }

    if (cart.length === 0) {
      newErrors.cart = 'Cart is empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm() || isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      const payment = {
        method: paymentMethod,
        ...(paymentMethod === 'card' && { cardVoucher }),
      };

      const receiptDelivery = selectedCustomer ? {
        ...(selectedCustomer.email && { email: selectedCustomer.email }),
        ...(selectedCustomer.whatsappPhone && { whatsapp: selectedCustomer.whatsappPhone }),
      } : undefined;

      const transactionData: Omit<Transaction, 'id' | 'receiptNumber'> = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          isService: item.isService,
          serviceLiters: item.serviceLiters,
          subtotal: item.price * item.quantity,
        })),
        total,
        discount,
        finalTotal,
        payment,
        status: 'completed',
        customerId: selectedCustomer?.id,
        date: new Date().toISOString(),
      };

      const transaction = await addTransaction(transactionData);

      if (!transaction) {
        throw new Error('Failed to create transaction');
      }

      await generateReceipt(transaction, receiptDelivery);
      clearCart();
      toast.success('Transaction completed successfully');
      onClose();
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to complete transaction. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Checkout</h3>
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Customer Selection */}
          {selectedCustomer ? (
            <CustomerDetails 
              customer={selectedCustomer} 
              onClear={() => setSelectedCustomer(null)} 
            />
          ) : (
            <CustomerSearchInput onSelect={setSelectedCustomer} />
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isProcessing}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>

          {paymentMethod === 'card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Payment Voucher Number *
              </label>
              <input
                type="text"
                value={cardVoucher}
                onChange={(e) => setCardVoucher(e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.cardVoucher ? 'border-red-500' : ''
                }`}
                disabled={isProcessing}
                required
              />
              {errors.cardVoucher && (
                <p className="mt-1 text-sm text-red-600">{errors.cardVoucher}</p>
              )}
            </div>
          )}

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min="0"
              max={total}
              step="0.01"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.discount ? 'border-red-500' : ''
              }`}
              disabled={isProcessing}
            />
            {errors.discount && (
              <p className="mt-1 text-sm text-red-600">{errors.discount}</p>
            )}
          </div>

          {/* Digital Receipt Options */}
          {selectedCustomer && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Digital Receipt</p>
              {selectedCustomer.email && (
                <p className="text-sm text-gray-600">
                  ✓ Will be sent to {selectedCustomer.email}
                </p>
              )}
              {selectedCustomer.whatsappPhone && (
                <p className="text-sm text-gray-600">
                  ✓ Will be sent via WhatsApp to {selectedCustomer.whatsappPhone}
                </p>
              )}
            </div>
          )}

          {/* Totals */}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium mt-2">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}