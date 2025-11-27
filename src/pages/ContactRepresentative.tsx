import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageCircle, User, MapPin, ArrowLeft } from 'lucide-react';

const ContactRepresentative = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Contact Your Representative</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized support from your dedicated account representative
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">Account Representative</CardTitle>
                <CardDescription className="text-base">Your dedicated support contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Dipa Singh</div>
                <div className="text-sm text-muted-foreground">Sales Manager</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                  Online
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">+91 9147711694</div>
                  <div className="text-xs text-muted-foreground">Direct line</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">dipa@phoenixtravelopedia.com</div>
                  <div className="text-xs text-muted-foreground">Email support</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">WhatsApp Support</div>
                  <div className="text-xs text-muted-foreground">+91 9147711694</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Kolkata Office</div>
                  <div className="text-xs text-muted-foreground">East Region</div>
                </div>
              </div>
            </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button className="w-full h-11">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href="tel:9147711694"> 
                    Call Now
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full h-11">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <a href="https://wa.me/9147711694" target="_blank">WhatsApp</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">Support Hours</CardTitle>
                <CardDescription className="text-base">When you can reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="font-medium text-primary">24 Hours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Saturday</span>
                    <span className="font-medium text-primary">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Sunday</span>
                    <span className="font-medium text-primary">10:00 AM - 4:00 PM</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="font-medium mb-3">Emergency Support</div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      For urgent travel-related issues outside business hours:
                    </div>
                    <div className="font-semibold text-red-700">+91 9147711694</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="font-medium mb-3">Response Time</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="font-medium text-sm">Phone/WhatsApp</div>
                      <div className="text-xs text-muted-foreground mt-1">Immediate</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="font-medium text-sm">Email</div>
                      <div className="text-xs text-muted-foreground mt-1">Within 2 hours</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Support Topics */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Common Support Topics</CardTitle>
              <CardDescription className="text-base">Quick help for frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 text-left justify-start hover:shadow-md transition-all duration-200">
                  <div>
                    <div className="font-medium">Booking Assistance</div>
                    <div className="text-xs text-muted-foreground mt-1">Help with creating bookings</div>
                  </div>
                </Button>
                
                {/* <Button variant="outline" className="h-auto p-4 text-left justify-start hover:shadow-md transition-all duration-200">
                  <div>
                    <div className="font-medium">Commission Queries</div>
                    <div className="text-xs text-muted-foreground mt-1">Payment and commission issues</div>
                  </div>
                </Button> */}

                <Button variant="outline" className="h-auto p-4 text-left justify-start hover:shadow-md transition-all duration-200">
                  <div>
                    <div className="font-medium">Training & Resources</div>
                    <div className="text-xs text-muted-foreground mt-1">Learning materials and guides</div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4 text-left justify-start hover:shadow-md transition-all duration-200">
                  <div>
                    <div className="font-medium">Technical Support</div>
                    <div className="text-xs text-muted-foreground mt-1">Platform and system issues</div>
                  </div>
                </Button>

                {/* <Button variant="outline" className="h-auto p-4 text-left justify-start hover:shadow-md transition-all duration-200">
                  <div>
                    <div className="font-medium">Account Setup</div>
                    <div className="text-xs text-muted-foreground mt-1">Profile and settings help</div>
                  </div>
                </Button> */}

                {/* <Button variant="outline" className="h-auto p-4 text-left justify-start hover:shadow-md transition-all duration-200">
                  <div>
                    <div className="font-medium">Partnership Opportunities</div>
                    <div className="text-xs text-muted-foreground mt-1">Business development</div>
                  </div>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactRepresentative;
