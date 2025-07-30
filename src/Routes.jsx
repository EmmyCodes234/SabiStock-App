import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ui/ProtectedRoute";

// Page imports
import DashboardOverview from "pages/dashboard-overview";
import AddEditProduct from "pages/add-edit-product";
import ProductManagement from "pages/product-management";
import PointOfSalePOS from "pages/point-of-sale-pos";
import SalesHistory from "pages/sales-history";
import UserOnboardingFlow from "pages/user-onboarding-flow";
import Login from "pages/auth/Login";
import SignUp from "pages/auth/SignUp";
import Reports from "pages/reports";
import CustomersPage from "pages/customers";
import CustomerDetailsPage from "pages/customers/CustomerDetailsPage";
import SettingsPage from "pages/settings"; // <-- New Import
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* ... (Authentication routes remain the same) ... */}

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/dashboard-overview" element={<DashboardOverview />} />
            <Route path="/add-edit-product" element={<AddEditProduct />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/point-of-sale-pos" element={<PointOfSalePOS />} />
            <Route path="/sales-history" element={<SalesHistory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            <Route path="/settings" element={<SettingsPage />} /> {/* <-- New Route */}
          </Route>

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;