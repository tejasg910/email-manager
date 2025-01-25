import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactUs = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-center">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-700 mb-4">
                We value your feedback and are always ready to assist you.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold">Email Contact</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                tejasgiri910@gmail.com
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mt-6">Communication Guidelines</h3>
              <div className="text-gray-700 space-y-2">
                <p>Response Time: Within 1-2 business days</p>
                <p>Support Hours: Monday to Friday, 9 AM to 5 PM</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mt-6">Communication Channels</h3>
              <div className="text-gray-700 space-y-2">
                <p>Primary Contact: Email</p>
                <p>Additional Support: Through official platform channels</p>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;