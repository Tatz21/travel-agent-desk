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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useAgent } from '@/hooks/useAgent';
import { toast } from 'sonner';
import logo from '@/assets/logo.gif';

const FlightBooking = () => {
  const { agent } = useAgent();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sectors, setSectors] = useState<any[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
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

  // Load available sectors on mount
  React.useEffect(() => {
    loadSectors();
  }, []);

  const loadSectors = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('flight-api', {
        body: { action: 'sectors' }
      });

      if (error) throw error;
      
      if (data?.data) {
        setSectors(data.data);
      }
    } catch (error: any) {
      console.error('Failed to load sectors:', error);
    }
  };

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

  const handleSearchFlights = async () => {
    if (!from || !to || !departureDate) {
      toast.error("Please select origin, destination and departure date");
      return;
    }

    setSearching(true);
    setSearchResults([]);
    setAvailableDates([]);

    try {
      // First, check availability to get available dates
      const { data: availData, error: availError } = await supabase.functions.invoke('flight-api', {
        body: {
          action: 'availability',
          origin: from,
          destination: to,
          departureDate: format(departureDate, 'yyyy-MM-dd'),
          returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : null,
          adultCount: adults,
          childCount: children,
          infantCount: infants,
          class: flightClass.charAt(0).toUpperCase() + flightClass.slice(1).replace('-', ' '),
        }
      });

      if (availError) throw availError;

      // Check if there are available dates
      if (availData?.data && Array.isArray(availData.data) && availData.data.length > 0) {
        setAvailableDates(availData.data);
        
        // Check if user's selected date is available
        const userSelectedDate = format(departureDate, 'dd-MMM-yyyy');
        const isDateAvailable = availData.data.includes(userSelectedDate);
        
        let searchDate;
        if (isDateAvailable) {
          searchDate = userSelectedDate;
          toast.success(`Flight available on your selected date: ${userSelectedDate}`);
        } else {
          // Use the first available date if user's date is not available
          searchDate = availData.data[0];
          toast.info(`Selected date not available. Showing flights for: ${searchDate}. Available dates: ${availData.data.join(', ')}`);
        }
        
        // Now search for actual flight details
        const { data: searchData, error: searchError } = await supabase.functions.invoke('flight-api', {
          body: {
            action: 'search',
            searchData: {
              origin: from,
              destination: to,
              departure_date: searchDate, // Use the available date from API
              return_date: returnDate ? format(returnDate, 'yyyy-MM-dd') : '',
              adult: adults,
              child: children,
              infant: infants,
              class: flightClass.charAt(0).toUpperCase() + flightClass.slice(1).replace('-', ' '),
            }
          }
        });

        if (searchError) throw searchError;

        // Check if search returned actual flight data
        if (searchData?.data && Array.isArray(searchData.data) && searchData.data.length > 0) {
          setSearchResults(searchData.data);
          toast.success(`Found ${searchData.data.length} flights on ${searchDate}`);
        } else if (searchData?.message === "Data not found") {
          // Show available dates if no flights found
          toast.info(`No flights found. Available dates: ${availData.data.join(', ')}`);
        } else {
          toast.info(`Flights available on these dates: ${availData.data.join(', ')}`);
        }
      } else {
        toast.error("No flights available for selected route");
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.message || "Failed to search flights");
    } finally {
      setSearching(false);
    }
  };

  const handleBooking = async () => {
    if (!agent) {
      toast.error("Agent profile not found");
      return;
    }

    if (!selectedFlight) {
      toast.error("Please select a flight first");
      return;
    }

    if (!passengerName || !email || !phone) {
      toast.error("Please fill in all passenger details");
      return;
    }

    setLoading(true);

    try {
      // Generate booking reference
      const { data: bookingRef } = await supabase.rpc('generate_booking_reference');
      
      // Get price from selected flight
      const totalAmount = selectedFlight.TotalFare || selectedFlight.Fare || 0;
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
          return_date: returnDate?.toISOString(),
          flight_details: selectedFlight
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
      setSearchResults([]);
      setSelectedFlight(null);
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
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Book Your Flight
        </h1>
        <p className="text-muted-foreground mt-2">Find and book the perfect flight for your journey</p>
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
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="h-12 border-0 shadow-sm bg-muted/30">
                  <SelectValue placeholder="Select departure city">
                    {from && sectors.find(s => s.Origin === from)?.Sector.split('//')[0].trim()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(sectors.map(s => s.Origin))).sort().map((origin) => {
                    const sector = sectors.find(s => s.Origin === origin);
                    return (
                      <SelectItem key={origin} value={origin}>
                        {sector?.Sector.split('//')[0].trim()} ({origin})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-center items-center">
              <div className="bg-primary/10 p-2 rounded-full">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">TO</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="h-12 border-0 shadow-sm bg-muted/30">
                  <SelectValue placeholder={from ? "Select destination city" : "Select origin first"}>
                    {to && sectors.find(s => s.Destination === to)?.Sector.split('//')[1].trim()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {from && Array.from(new Set(sectors.filter(s => s.Origin === from).map(s => s.Destination))).sort().map((dest) => {
                    const sector = sectors.find(s => s.Origin === from && s.Destination === dest);
                    return (
                      <SelectItem key={dest} value={dest}>
                        {sector?.Sector.split('//')[1].trim()} ({dest})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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

      {/* Search Button */}
      <Card className="shadow-card border-0 bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-6">
          <Button 
            onClick={handleSearchFlights} 
            disabled={searching}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all"
          >
            <Plane className="h-5 w-5 mr-2" />
            {searching ? 'Searching Flights...' : 'Search Flights'}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="shadow-card border-0 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle>Available Flights ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchResults.map((flight: any, index: number) => (
              <Card 
                key={index}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedFlight === flight && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedFlight(flight)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Airline and Flight Number */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Plane className="h-5 w-5 text-primary" />
                          <p className="font-bold text-lg">
                            {flight.airline}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Flight {flight.flight_number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {flight.flight_route}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          ₹{flight.price}
                        </p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                    </div>

                    {/* Flight Times and Route */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {flight.departure_time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.origin}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {flight.departure_date}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                        <p className="text-xs font-medium text-muted-foreground">
                          {(() => {
                            if (flight.departure_time && flight.arival_time) {
                              const [depHours, depMins] = flight.departure_time.split(':').map(Number);
                              const [arrHours, arrMins] = flight.arival_time.split(':').map(Number);
                              const depMinutes = depHours * 60 + depMins;
                              const arrMinutes = arrHours * 60 + arrMins;
                              const durationMins = arrMinutes - depMinutes;
                              const hours = Math.floor(durationMins / 60);
                              const mins = durationMins % 60;
                              return `${hours}h ${mins}m`;
                            }
                            return 'N/A';
                          })()}
                        </p>
                        <div className="w-full h-px bg-border my-2" />
                        <p className="text-xs text-muted-foreground">
                          {flight.flight_route}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {flight.arival_time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.destination}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {flight.arival_date}
                        </p>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2 border-t">
                      <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">Cabin Baggage</span>
                        <span className="font-semibold">✈️ {flight.cabin_baggage}</span>
                      </div>
                      <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">Hand Luggage</span>
                        <span className="font-semibold">👜 {flight.hand_luggage}</span>
                      </div>
                      {flight.infant_price && (
                        <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded">
                          <span className="text-muted-foreground">Infant Price</span>
                          <span className="font-semibold">👶 ₹{flight.infant_price}</span>
                        </div>
                      )}
                      {flight.pax && (
                        <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded">
                          <span className="text-muted-foreground">Available Seats</span>
                          <span className="font-semibold">💺 {flight.pax} seats</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">Flight Type</span>
                        <span className="font-semibold">
                          {flight.isinternational ? '🌍 International' : '🇮🇳 Domestic'}
                        </span>
                      </div>
                      {flight.inventory_type && (
                        <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded">
                          <span className="text-muted-foreground">Inventory Type</span>
                          <span className="font-semibold">{flight.inventory_type}</span>
                        </div>
                      )}
                    </div>

                    {/* Ticket ID - Hidden but useful for booking */}
                    {flight.ticket_id && (
                      <p className="text-xs text-muted-foreground pt-2">
                        Ticket ID: {flight.ticket_id.substring(0, 40)}...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Passenger Details & Booking - Only show if flight selected */}
      {selectedFlight && (
        <Card className="shadow-card border-0 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Passenger Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">FULL NAME *</Label>
                <Input
                  id="passengerName"
                  value={passengerName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="h-12 border-0 shadow-sm bg-muted/30 focus:bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">EMAIL *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="h-12 border-0 shadow-sm bg-muted/30 focus:bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">PHONE *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handleInputChange}
                  placeholder="+91 00000 00000"
                  className="h-12 border-0 shadow-sm bg-muted/30 focus:bg-background"
                />
              </div>
            </div>

            <Button 
              onClick={handleBooking} 
              disabled={loading}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-600/90 hover:to-emerald-600/90 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Processing Booking...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlightBooking;