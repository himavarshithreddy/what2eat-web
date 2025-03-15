import React from "react";

const TermsandConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">
          Welcome to What2Eat! Your privacy is important to us. This Privacy Policy explains
          how we collect, use, and protect your personal data when you use our app and services.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-4">1. Information We Collect</h2>
        <p className="text-gray-600 mb-2">
          We collect the following types of data:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Personal Information (name, email, phone, etc.)</li>
          <li>Scanned product data for analysis</li>
          <li>App usage statistics (for improving the user experience)</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-4">2. How We Use Your Data</h2>
        <p className="text-gray-600 mb-4">
          We use your data to personalize your experience, improve our services, and ensure security.
          We do **not** sell your data to third parties.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-4">3. Data Security</h2>
        <p className="text-gray-600 mb-4">
          We implement security measures such as encryption and secure databases to protect your data.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-4">4. Your Rights</h2>
        <p className="text-gray-600 mb-4">
          You have the right to access, modify, or delete your data. Contact us at 
          <a href="mailto:support@what2eat.com" className="text-blue-600 font-semibold"> support@what2eat.com</a> for requests.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-4">5. Updates to This Policy</h2>
        <p className="text-gray-600 mb-4">
          We may update this Privacy Policy from time to time. Please review this page for any changes.
        </p>

        <p className="text-gray-500 mt-6 text-sm">
          Last updated: March 2025
        </p>
      </div>
    </div>
  );
};

export default TermsandConditions;
