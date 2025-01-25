import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-800 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>Welcome to our Email Management Platform. We are committed to protecting your personal information and maintaining the highest standards of data privacy. This comprehensive privacy policy explains how we collect, use, store, and protect your data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information Collection</h2>
            <p>We collect various types of information to provide and improve our services:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Personal identification information (name, email address, contact details)</li>
              <li>Account credentials</li>
              <li>Usage data and analytics</li>
              <li>Technical information about your device and interactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Usage and Processing</h2>
            <p>We use collected information for multiple purposes:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Providing and maintaining our email management services</li>
              <li>Personalizing user experience</li>
              <li>Improving platform functionality</li>
              <li>Communicating with users about updates and support</li>
              <li>Detecting and preventing fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Protection and Security</h2>
            <p>We implement multiple layers of security to protect your data:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Advanced encryption for data storage and transmission</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Strict access controls for internal personnel</li>
              <li>Multi-factor authentication mechanisms</li>
              <li>Continuous monitoring of potential security threats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Rights</h2>
            <p>As a user, you have several fundamental rights regarding your personal data:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Right to access your personal information</li>
              <li>Right to request data correction</li>
              <li>Right to request data deletion</li>
              <li>Right to restrict data processing</li>
              <li>Right to data portability</li>
            </ul>
          </section>

          <section>
            <p className="mt-4 text-sm text-gray-600">
              Last Updated: January 2025
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;