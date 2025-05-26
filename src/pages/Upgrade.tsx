
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Upgrade = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (planType: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upgrade your account.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting upgrade process for plan:', planType);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      console.log('Checkout response:', { data, error });

      if (error) {
        console.error('Checkout error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        // Use window.location.href for better compatibility
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Upgrade failed",
        description: error.message || "Unable to start upgrade process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock AI-powered job searches with our premium plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Free</CardTitle>
              <div className="text-3xl font-bold text-gray-900">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>2 AI job searches per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic job recommendations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Profile creation</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Job application links</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Silver Plan */}
          <Card className="border-2 border-gray-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-700 flex items-center justify-center">
                <Star className="h-5 w-5 mr-1" />
                Silver
              </CardTitle>
              <div className="text-3xl font-bold text-gray-700">$5<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">10 AI job searches per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Enhanced job recommendations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Direct application links</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gray-600 hover:bg-gray-700" 
                onClick={() => handleUpgrade('silver')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Processing...
                  </span>
                ) : (
                  'Choose Silver'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Gold Plan */}
          <Card className="border-2 border-yellow-400 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Crown className="h-4 w-4 mr-1" />
                Popular
              </span>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                <Star className="h-5 w-5 mr-1" />
                Gold
              </CardTitle>
              <div className="text-3xl font-bold text-yellow-600">$7.50<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">20 AI job searches per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Premium job recommendations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Direct application links</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced search filters</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-yellow-600 hover:bg-yellow-700" 
                onClick={() => handleUpgrade('gold')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Processing...
                  </span>
                ) : (
                  'Choose Gold'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Platinum Plan */}
          <Card className="border-2 border-purple-500">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-purple-600 flex items-center justify-center">
                <Star className="h-5 w-5 mr-1" />
                Platinum
              </CardTitle>
              <div className="text-3xl font-bold text-purple-600">$15<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">50 AI job searches per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Elite job recommendations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Direct application links</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>24/7 priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced search filters</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Job alert notifications</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Resume optimization</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => handleUpgrade('platinum')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Processing...
                  </span>
                ) : (
                  'Choose Platinum'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Have questions? Contact us at support@wat2do.com
          </p>
          <p className="text-sm text-gray-500">
            Secure payment processing powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
