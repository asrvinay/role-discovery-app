
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (user && sessionId) {
      updateSubscriptionStatus();
    }
  }, [user, sessionId]);

  const updateSubscriptionStatus = async () => {
    if (!user) return;

    try {
      // Update user's subscription status in the database
      const { error } = await supabase
        .from('user_search_limits')
        .update({
          subscription_active: true,
          subscription_type: 'premium',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating subscription status:', error);
      } else {
        toast({
          title: "Welcome to Premium!",
          description: "Your subscription has been activated. Enjoy unlimited job searches!",
        });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-2 border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </CardTitle>
            <p className="text-lg text-gray-600">
              Welcome to Wat2do Premium
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
              <Crown className="h-8 w-8 mx-auto mb-2" />
              <h3 className="text-xl font-bold mb-2">Premium Activated</h3>
              <p className="text-indigo-100">
                You now have unlimited access to AI-powered job searches with direct application links.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-gray-900">Unlimited Searches</div>
                <div className="text-gray-600">No more search limits</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-gray-900">Premium Support</div>
                <div className="text-gray-600">Priority assistance</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/job-recommendations')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Start Your Unlimited Job Search
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')} 
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Your subscription will renew automatically each month. You can cancel anytime from your account settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;
