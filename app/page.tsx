import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, BookTemplate, Send, Zap } from "lucide-react";
import HeroSection from "@/assets/hero.png"
import Image from 'next/image';
import Link from 'next/link';
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800">
            Supercharge Your Email Campaigns
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Create, customize, and send bulk emails effortlessly. Streamline your communication with powerful template management and intelligent sending tools.
          </p>
          <div className="flex space-x-4">
            <Link href="/manage" className="bg-indigo-600 rounded-md text-white px-4 py-2 hover:bg-indigo-700">


              Start For Free

            </Link>
            <Link href={"https://youtu.be/JJl_vUrfEzY"} target='_blank' className=" border px-4 py-2 rounded-md border-indigo-600  text-indigo-600">
              Watch Demo
            </Link>
          </div>
        </div>
        <div className=" mt-10 md:mt-0">
          <Image
            src={HeroSection}
            width={500}
            height={500}
            alt="Email Campaign Visualization"

          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mail className="w-12 h-12 text-indigo-600" />,
                title: "Extract Emails",
                description: "Easily collect and manage email lists from various sources with our intelligent extraction tools."
              },
              {
                icon: <BookTemplate className="w-12 h-12 text-green-600" />,
                title: "Create Templates",
                description: "Design stunning, responsive email templates with our drag-and-drop editor. No coding required."
              },
              {
                icon: <Send className="w-12 h-12 text-orange-600" />,
                title: "Send in Bulk",
                description: "Schedule and send personalized email campaigns to your entire list with just a few clicks."
              }
            ].map((step, index) => (
              <div key={index} className="text-center p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-all">
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10 text-yellow-500" />,
                title: "High Deliverability",
                description: "Advanced algorithms ensure your emails reach the inbox, not spam folders."
              },
              {
                icon: <BookTemplate className="w-10 h-10 text-purple-500" />,
                title: "Unlimited Templates",
                description: "Create and save unlimited email templates for different campaigns and audiences."
              }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-md">
                <div>{benefit.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-700 text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Your Email Campaigns?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of businesses leveraging our platform to communicate more effectively.
        </p>
        <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
          <Link href="/manage">

            Get Started Now
          </Link>
        </Button>
      </section>
    </div>
  );
}