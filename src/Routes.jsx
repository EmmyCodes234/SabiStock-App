import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import DashboardOverview from "pages/dashboard-overview";
import AddEditProduct from "pages/add-edit-product";
import ProductManagement from "pages/product-management";
import PointOfSalePOS from "pages/point-of-sale-pos";
import SalesHistory from "pages/sales-history";
import UserOnboardingFlow from "pages/user-onboarding-flow";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/add-edit-product" element={<AddEditProduct />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/point-of-sale-pos" element={<PointOfSalePOS />} />
        <Route path="/sales-history" element={<SalesHistory />} />
        <Route path="/user-onboarding-flow" element={<UserOnboardingFlow />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;