
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Upgrade = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
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
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: 'price_premium_monthly' }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in the current window
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Upgrade failed",
        description: "Unable to start upgrade process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600">
            Unlock unlimited job searches and premium features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Free</CardTitle>
              <div className="text-3xl font-bold text-gray-900">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
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
              <Button variant="outline" className="w-full mt-6" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-indigo-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Crown className="h-4 w-4 mr-1" />
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-indigo-900">Premium</CardTitle>
              <div className="text-3xl font-bold text-indigo-900">$9.99<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">Unlimited AI job searches</span>
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
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced search filters</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Job alert notifications</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700" 
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </span>
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
