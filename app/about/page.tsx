import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">About Our Email Management Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-gray-800">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Company Journey</h2>
              <p className="mb-4">
                Founded in the digital transformation era, our email management platform emerged from a critical need to streamline communication processes for businesses and individuals alike. We recognized the increasing complexity of digital communication and the challenges organizations face in managing email workflows efficiently and securely.
              </p>
              <p className="mb-4">
                Our founding team comprises experienced software engineers, cybersecurity experts, and communication technology specialists who shared a collective vision: to create an intuitive, robust email management solution that addresses the multifaceted challenges of modern digital communication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission and Vision</h2>
              <p className="mb-4">
                Our mission transcends mere email management. We aim to revolutionize how individuals and organizations communicate, process, and secure their digital correspondence. We envision a world where email communication is seamless, intelligent, and protected by cutting-edge security technologies.
              </p>
              <p className="mb-4">
                We believe that effective communication is the cornerstone of success in both personal and professional domains. Our platform is designed to eliminate communication barriers, reduce administrative overhead, and provide users with powerful tools to manage their digital interactions efficiently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Core Values</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold">Innovation</h3>
                  <p>We continuously push technological boundaries, developing innovative solutions that anticipate and solve emerging communication challenges.</p>
                </div>
                <div>
                  <h3 className="font-bold">Security</h3>
                  <p>Protecting user data is our highest priority. We implement state-of-the-art encryption and security protocols to ensure comprehensive digital protection.</p>
                </div>
                <div>
                  <h3 className="font-bold">User-Centricity</h3>
                  <p>Every feature we develop is meticulously crafted with our users' needs and experiences at the forefront of our design philosophy.</p>
                </div>
                <div>
                  <h3 className="font-bold">Transparency</h3>
                  <p>We maintain complete transparency in our operations, data handling, and communication with our users.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
              <p className="mb-4">
                Our email management platform leverages advanced technologies including artificial intelligence, machine learning, and sophisticated encryption algorithms. We've developed a robust infrastructure that ensures high performance, scalability, and uncompromising security.
              </p>
              <p className="mb-4">
                By integrating cutting-edge technologies, we provide features like intelligent email sorting, automated workflow management, advanced spam filtering, and comprehensive analytics that give users unprecedented control and insights into their communication processes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <p>
                We are committed to continuous improvement, listening to our users, and adapting our platform to meet the evolving landscape of digital communication. Our team works tirelessly to ensure that our email management solution remains at the forefront of technological innovation.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUs;