// A mock AI service to simulate SabiBot's responses.
// In a real application, this would be replaced with calls to an actual AI API.

import { analyticsService, salesService } from "./apiService"; // <-- Correct import path

export const getSabiBotResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    let responseText = "I'm sorry, I'm not sure how to help with that. Try asking about your sales, products, or inventory.";

    // --- Product & Inventory Queries ---
    if (message.includes('stock') || message.includes('inventory')) {
        const lowStockProducts = await analyticsService.getLowStockProducts(); // Made async
        if (lowStockProducts.length > 0) {
            responseText = `You have ${lowStockProducts.length} item(s) running low on stock. The most critical is "${lowStockProducts[0].name}" with only ${lowStockProducts[0].quantity} left. I recommend checking your inventory soon.`;
        } else {
            responseText = "Great news! None of your products are currently low on stock.";
        }
    }

    // --- Sales Queries ---
    if (message.includes('sales') || message.includes('sell') || message.includes('revenue')) {
        const sales = await salesService.getAll(); // Made async
        const today = new Date().setHours(0, 0, 0, 0);
        const todaysSales = sales.filter(s => new Date(s.date) >= today);
        
        if (todaysSales.length > 0) {
            const totalRevenue = todaysSales.reduce((sum, s) => sum + s.total, 0);
            responseText = `You've made ${todaysSales.length} sale(s) today with a total revenue of ₦${totalRevenue.toLocaleString()}. Keep up the great work!`;
        } else {
            responseText = "You haven't made any sales today. Let's make the first one!";
        }
    }
    
    // --- Navigation Queries ---
    if (message.includes('add product')) {
        responseText = "I can help with that. You can add a new product from the 'Add Product' page.";
    }
    if (message.includes('see all my products')) {
        responseText = "Of course. Head over to the 'Product Management' page to see your full inventory.";
    }

    // --- Greeting ---
    if (message.includes('hello') || message.includes('hi')) {
        responseText = "Hello there! How can I assist you with your business today?";
    }

    return {
        id: Date.now(),
        sender: 'bot',
        text: responseText,
    };
};