import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-800 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using our Email Management Platform, you agree to be bound by these terms and conditions. If you do not agree, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. User Account</h2>
            <p>Rules governing user accounts include:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Providing accurate registration information</li>
              <li>Maintaining account security</li>
              <li>Preventing unauthorized account access</li>
              <li>Immediate reporting of suspected security breaches</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Usage Restrictions</h2>
            <p>Users are prohibited from:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Violating any local, state, national, or international laws</li>
              <li>Transmitting harmful or malicious content</li>
              <li>Attempting unauthorized system access</li>
              <li>Interfering with platform functionality</li>
              <li>Sharing account credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p>All platform content, design, and functionality are our exclusive intellectual property. Users cannot:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Reproduce platform design</li>
              <li>Create derivative works</li>
              <li>Use our trademarks without permission</li>
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

export default TermsAndConditions;