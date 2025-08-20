import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageCircle, Clock, User, MapPin } from 'lucide-react';

const ContactRepresentative = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Your Representative</h1>
        <p className="text-muted-foreground">Get in touch with your dedicated account representative</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Representative
            </CardTitle>
            <CardDescription>Your dedicated support contact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Rajesh Kumar</div>
                <div className="text-sm text-muted-foreground">Senior Account Manager</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                  Online
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">+91 98765 43210</div>
                  <div className="text-xs text-muted-foreground">Direct line</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">rajesh.kumar@travelopedia.com</div>
                  <div className="text-xs text-muted-foreground">Email support</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">WhatsApp Support</div>
                  <div className="text-xs text-muted-foreground">+91 98765 43210</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Mumbai Office</div>
                  <div className="text-xs text-muted-foreground">Western Region</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button size="sm" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Support Hours
            </CardTitle>
            <CardDescription>When you can reach us</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Monday - Friday</span>
                <span className="text-sm">9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Saturday</span>
                <span className="text-sm">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Sunday</span>
                <span className="text-sm">10:00 AM - 4:00 PM</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-sm font-medium mb-2">Emergency Support</div>
              <div className="text-sm text-muted-foreground">
                For urgent travel-related issues outside business hours, call our 24/7 emergency line:
                <span className="font-medium text-foreground"> +91 1800 123 456</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-sm font-medium mb-2">Response Time</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-medium">Phone/WhatsApp</div>
                  <div className="text-muted-foreground">Immediate</div>
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-muted-foreground">Within 2 hours</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Common Support Topics</CardTitle>
          <CardDescription>Quick help for frequently asked questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 text-left justify-start">
              <div>
                <div className="font-medium">Booking Assistance</div>
                <div className="text-xs text-muted-foreground">Help with creating bookings</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left justify-start">
              <div>
                <div className="font-medium">Commission Queries</div>
                <div className="text-xs text-muted-foreground">Payment and commission issues</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 text-left justify-start">
              <div>
                <div className="font-medium">Technical Support</div>
                <div className="text-xs text-muted-foreground">Platform and system issues</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 text-left justify-start">
              <div>
                <div className="font-medium">Account Setup</div>
                <div className="text-xs text-muted-foreground">Profile and settings help</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 text-left justify-start">
              <div>
                <div className="font-medium">Training & Resources</div>
                <div className="text-xs text-muted-foreground">Learning materials and guides</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 text-left justify-start">
              <div>
                <div className="font-medium">Partnership Opportunities</div>
                <div className="text-xs text-muted-foreground">Business development</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactRepresentative;