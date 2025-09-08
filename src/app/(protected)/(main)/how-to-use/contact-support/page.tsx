"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageCircle, Phone, Clock, ExternalLink, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get detailed help via email",
    contact: "support@quizzicallabz.qzz.io",
    responseTime: "Within 24 hours",
    action: "mailto:support@quizzicallabz.qzz.io",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Chat",
    description: "Quick chat support",
    contact: "+923297642797",
    responseTime: "Within 2 hours",
    action: "https://wa.me/923297642797",
    color: "bg-green-500/10 text-green-600"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Direct phone assistance",
    contact: "+92 21 1234 5678",
    responseTime: "Mon-Fri, 9 AM - 6 PM",
    action: "tel:+922112345678",
    color: "bg-purple-500/10 text-purple-600"
  }
];

export default function ContactSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', category: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Contact Support" description="Get help with Quizzicallabs AI" />

      <div className="grid md:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => (
          <motion.div key={method.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className={`w-12 h-12 rounded-full ${method.color} flex items-center justify-center mx-auto mb-4`}>
                  <method.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <p className="font-medium">{method.contact}</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {method.responseTime}
                  </p>
                </div>
                <Button asChild className="w-full">
                  <a href={method.action} target="_blank" rel="noopener noreferrer">
                    Contact Now <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing & Subscription</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="content">Content Issue</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input id="subject" value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea id="message" rows={5} value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} placeholder="Please describe your issue or question in detail..." required />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}