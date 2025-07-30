import React from 'react';
import Icon from '../../../components/AppIcon';

const Receipt = React.forwardRef(({ transactionData, businessProfile }, ref) => {
    if (!transactionData || !businessProfile) return null;

    const { items, total, paymentMethod, timestamp } = transactionData;
    const { business_name, location, phone } = businessProfile;

    return (
        <div ref={ref} className="p-8 font-mono text-sm text-black bg-white">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Icon name="Package" size={24} />
                    <h1 className="text-2xl font-bold uppercase">{business_name || 'SabiStock Store'}</h1>
                </div>
                <p>{location || 'Lagos, Nigeria'}</p>
                <p>{phone || '+234-XXX-XXXX-XXX'}</p>
            </div>

            <div className="mb-6">
                <p><strong>Transaction ID:</strong> {`TXN-${timestamp.getTime().toString().slice(-8)}`}</p>
                <p><strong>Date:</strong> {new Date(timestamp).toLocaleString()}</p>
            </div>

            <table className="w-full mb-6">
                <thead>
                    <tr className="border-b-2 border-dashed border-black">
                        <th className="text-left pb-2">ITEM</th>
                        <th className="text-center pb-2">QTY</th>
                        <th className="text-right pb-2">PRICE</th>
                        <th className="text-right pb-2">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} className="border-b border-dashed border-gray-400">
                            <td className="py-2">{item.name}</td>
                            <td className="text-center py-2">{item.cartQuantity}</td>
                            <td className="text-right py-2">₦{item.selling_price.toLocaleString()}</td>
                            <td className="text-right py-2">₦{(item.selling_price * item.cartQuantity).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mb-8">
                <div className="w-1/2">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₦{total.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between font-bold text-lg border-t border-black mt-2 pt-2">
                        <span>TOTAL:</span>
                        <span>₦{total.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between text-xs mt-1">
                        <span>Payment Method:</span>
                        <span className="capitalize">{paymentMethod}</span>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="font-bold">Thank you for your patronage!</p>
                <p className="text-xs">Powered by SabiStock</p>
            </div>
        </div>
    );
});

export default Receipt;