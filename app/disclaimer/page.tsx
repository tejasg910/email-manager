import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Disclaimer = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-800 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. General Disclaimer</h2>
            <p>Our Email Management Platform is provided "as is" without any warranties or representations, express or implied. Users acknowledge and accept that the service is provided with inherent technological limitations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Service Availability</h2>
            <p>We do not guarantee:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Uninterrupted or error-free service</li>
              <li>Complete elimination of security vulnerabilities</li>
              <li>Permanent data retention</li>
              <li>Absolute prevention of unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p>Users are solely responsible for:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Maintaining account confidentiality</li>
              <li>Ensuring accurate and lawful use of the platform</li>
              <li>Implementing additional security measures</li>
              <li>Protecting their own data and communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
            <p>We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Use or inability to use the platform</li>
              <li>Unauthorized access to user data</li>
              <li>Modification or deletion of user content</li>
              <li>Interruption or cessation of service</li>
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

export default Disclaimer;