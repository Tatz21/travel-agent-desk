import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Plane, Users, Clock, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useAgent } from '@/hooks/useAgent';
import { toast } from 'sonner';
import logo from '@/assets/logo.gif';

const FlightBooking = () => {
  const { agent } = useAgent();
  const [loading, setLoading] = useState(false);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [childrenDOB, setChildrenDOB] = useState<(Date | undefined)[]>([]);
  const [infantsDOB, setInfantsDOB] = useState<(Date | undefined)[]>([]);
  const [flightClass, setFlightClass] = useState('economy');
  const [mealPreference, setMealPreference] = useState('standard');
  const [extraBaggage, setExtraBaggage] = useState('none');
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'from') setFrom(value);
    if (id === 'to') setTo(value);
    if (id === 'passengerName') setPassengerName(value);
    if (id === 'email') setEmail(value);
    if (id === 'phone') setPhone(value);
    if (id === 'specialRequests') setSpecialRequests(value);
  };

  const handleSelectChange = (value: string) => {
    setFlightClass(value);
  };

  const handleBooking = async () => {
    if (!agent) {
      toast.error("Agent profile not found");
      return;
    }

    if (!from || !to || !departureDate || !passengerName || !email || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Generate booking reference
      const { data: bookingRef } = await supabase.rpc('generate_booking_reference');
      
      // Calculate total amount based on adults and children
      const basePrice = flightClass === 'economy' ? 5000 : 
                       flightClass === 'premium-economy' ? 8000 :
                       flightClass === 'business' ? 15000 : 25000;
      
      // Calculate total with infants, meal and baggage
      const infantPrice = basePrice * 0.1; // Infants are 10% of adult price
      const mealPrice = mealPreference === 'vegetarian' ? 500 : mealPreference === 'special' ? 800 : 0;
      const baggagePrice = extraBaggage === '15kg' ? 1500 : extraBaggage === '25kg' ? 2500 : 0;
      
      const totalAmount = (basePrice * adults) + (basePrice * 0.75 * children) + (infantPrice * infants) + 
                          (mealPrice * (adults + children)) + (baggagePrice * (adults + children));
      const commissionAmount = totalAmount * (agent.commission_rate / 100);

      const bookingData = {
        agent_id: agent.id,
        booking_reference: bookingRef,
        booking_type: 'flight' as const,
        passenger_name: passengerName,
        passenger_email: email,
        passenger_phone: phone,
        from_location: from,
        to_location: to,
        departure_date: departureDate.toISOString().split('T')[0],
        return_date: returnDate ? returnDate.toISOString().split('T')[0] : null,
        adult_count: adults,
        child_count: children,
        total_amount: totalAmount,
        commission_amount: commissionAmount,
        booking_details: {
          trip_type: tripType,
          class: flightClass,
          infant_count: infants,
          children_dob: childrenDOB.map(d => d?.toISOString()),
          infants_dob: infantsDOB.map(d => d?.toISOString()),
          meal_preference: mealPreference,
          extra_baggage: extraBaggage,
          special_requests: specialRequests,
          departure_date: departureDate?.toISOString(),
          return_date: returnDate?.toISOString()
        }
      };

      const { error } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (error) {
        throw error;
      }

      toast.success(`Flight booking created successfully! Reference: ${bookingRef}`);

      // Reset form
      setFrom('');
      setTo('');
      setDepartureDate(undefined);
      setReturnDate(undefined);
      setAdults(1);
      setChildren(0);
      setInfants(0);
      setChildrenDOB([]);
      setInfantsDOB([]);
      setFlightClass('economy');
      setMealPreference('standard');
      setExtraBaggage('none');
      setPassengerName('');
      setEmail('');
      setPhone('');
      setSpecialRequests('');
      setTripType('one-way');
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center">
          <img src={logo} alt="Travelopedia" className="h-40 w-40 object-contain" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Book Your Flight
          </h1>
          <p className="text-muted-foreground mt-2">Find and book the perfect flight for your journey</p>
        </div>
      </div>

      {/* Trip Type Selection */}
      <Card className="shadow-card border-0 bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-6">
          <RadioGroup
            value={tripType}
            onValueChange={(value) => setTripType(value as 'one-way' | 'round-trip')}
            className="flex gap-8 justify-center"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="one-way" id="one-way" className="text-primary border-primary" />
              <Label htmlFor="one-way" className="text-base font-medium cursor-pointer">One Way</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="round-trip" id="round-trip" className="text-primary border-primary" />
              <Label htmlFor="round-trip" className="text-base font-medium cursor-pointer">Round Trip</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Flight Search Form */}
      <Card className="shadow-card border-0 bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-8 space-y-8">
          {/* Route Selection */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">FROM</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="from"
                  value={from}
                  onChange={handleInputChange}
                  placeholder="Departure city"
                  className="pl-10 h-12 text-base border-0 shadow-sm bg-muted/30 focus:bg-background"
                />
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <div className="bg-primary/10 p-2 rounded-full">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">TO</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="to"
                  value={to}
                  onChange={handleInputChange}
                  placeholder="Destination city"
                  className="pl-10 h-12 text-base border-0 shadow-sm bg-muted/30 focus:bg-background"
                />
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">DEPARTURE</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal border-0 shadow-sm bg-muted/30 hover:bg-background"
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span className="text-base">
                      {departureDate ? format(departureDate, "EEE, MMM dd") : "Select date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={(date) => setDepartureDate(date || new Date())}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {tripType === 'round-trip' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">RETURN</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 justify-start text-left font-normal border-0 shadow-sm bg-muted/30 hover:bg-background"
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                      <span className="text-base">
                        {returnDate ? format(returnDate, "EEE, MMM dd") : "Select date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={(date) => setReturnDate(date || new Date())}
                      disabled={(date) => date < (departureDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">ADULTS (12+ yrs)</Label>
              <Select value={adults.toString()} onValueChange={(value) => setAdults(Number(value))}>
                <SelectTrigger className="h-12 border-0 shadow-sm bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Adult{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">CHILDREN (2-12 yrs)</Label>
              <Select value={children.toString()} onValueChange={(value) => {
                const newCount = Number(value);
                setChildren(newCount);
                setChildrenDOB(Array(newCount).fill(undefined));
              }}>
                <SelectTrigger className="h-12 border-0 shadow-sm bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Child{num !== 1 ? 'ren' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">INFANTS (0-2 yrs)</Label>
              <Select value={infants.toString()} onValueChange={(value) => {
                const newCount = Number(value);
                setInfants(newCount);
                setInfantsDOB(Array(newCount).fill(undefined));
              }}>
                <SelectTrigger className="h-12 border-0 shadow-sm bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Infant{num !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">CLASS</Label>
              <Select value={flightClass} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-12 border-0 shadow-sm bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date of Birth for Children */}
          {children > 0 && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <Label className="text-sm font-medium">DATE OF BIRTH - CHILDREN</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: children }).map((_, index) => (
                  <div key={`child-${index}`} className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Child {index + 1}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-10 justify-start text-left font-normal border-0 shadow-sm bg-background"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {childrenDOB[index] ? format(childrenDOB[index]!, "PP") : "Select DOB"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={childrenDOB[index]}
                          onSelect={(date) => {
                            const newDOBs = [...childrenDOB];
                            newDOBs[index] = date;
                            setChildrenDOB(newDOBs);
                          }}
                          disabled={(date) => date > new Date() || date < new Date('2012-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date of Birth for Infants */}
          {infants > 0 && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <Label className="text-sm font-medium">DATE OF BIRTH - INFANTS</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: infants }).map((_, index) => (
                  <div key={`infant-${index}`} className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Infant {index + 1}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-10 justify-start text-left font-normal border-0 shadow-sm bg-background"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {infantsDOB[index] ? format(infantsDOB[index]!, "PP") : "Select DOB"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={infantsDOB[index]}
                          onSelect={(date) => {
                            const newDOBs = [...infantsDOB];
                            newDOBs[index] = date;
                            setInfantsDOB(newDOBs);
                          }}
                          disabled={(date) => date > new Date() || date < new Date('2022-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food and Baggage Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">MEAL PREFERENCE</Label>
              <Select value={mealPreference} onValueChange={setMealPreference}>
                <SelectTrigger className="h-12 border-0 shadow-sm bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Meal (Included)</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian (+₹500/person)</SelectItem>
                  <SelectItem value="special">Special Dietary (+₹800/person)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">EXTRA BAGGAGE</Label>
              <Select value={extraBaggage} onValueChange={setExtraBaggage}>
                <SelectTrigger className="h-12 border-0 shadow-sm bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Standard (15kg Included)</SelectItem>
                  <SelectItem value="15kg">+15kg Extra (+₹1,500/person)</SelectItem>
                  <SelectItem value="25kg">+25kg Extra (+₹2,500/person)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passenger Information */}
      <Card className="shadow-card border-0 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-5 w-5 text-primary" />
            Passenger Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">FULL NAME</Label>
              <Input
                id="passengerName"
                value={passengerName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="h-12 text-base border-0 shadow-sm bg-muted/30 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">EMAIL</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="h-12 text-base border-0 shadow-sm bg-muted/30 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">PHONE</Label>
              <Input
                id="phone"
                value={phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="h-12 text-base border-0 shadow-sm bg-muted/30 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">SPECIAL REQUESTS</Label>
              <Input
                id="specialRequests"
                value={specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requirements"
                className="h-12 text-base border-0 shadow-sm bg-muted/30 focus:bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Book Button */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleBooking} 
          disabled={loading}
          className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-elegant transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          {loading ? (
            <>
              <Clock className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plane className="mr-2 h-5 w-5" />
              Book Flight
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FlightBooking;