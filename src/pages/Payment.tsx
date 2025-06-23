import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  Heart,
  DollarSign,
  Calendar,
  Users
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  goal: number;
  raised: number;
  daysLeft: number;
  backers: number;
  creator: {
    name: string;
    avatar: string;
  };
}

interface PaymentForm {
  amount: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  message: string;
}

const PaymentPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<PaymentForm>({
    amount: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch campaign data
    fetchCampaignData();
  }, [campaignId, navigate]);

  const fetchCampaignData = async () => {
    try {
      // In a real app, this would be an API call
      // For demo, using mock data
      const mockCampaign: Campaign = {
        id: campaignId || "1",
        title: "Community Garden Project",
        description: "Help us create a beautiful community garden that will bring neighbors together and provide fresh produce for local families.",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
        category: "Community",
        goal: 15000,
        raised: 8750,
        daysLeft: 23,
        backers: 156,
        creator: {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80"
        }
      };
      setCampaign(mockCampaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Card holder name is required";
    }

    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }

    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      // Prepare payment data
      const paymentData = {
        campaignId: campaignId,
        amount: parseFloat(formData.amount),
        message: formData.message,
        paymentMethod: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardHolder: formData.cardHolder,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        }
      };

      // Simulate API call to payment endpoint
      const response = await fetch('/api/payments/back-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      // For demo purposes, simulate successful payment
      alert('Payment successful! Thank you for backing this campaign.');
      navigate(`/campaign/${campaignId}`);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (campaign.raised / campaign.goal) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaign
          </Button>
          
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Back This Campaign</h1>
          </div>
          <p className="text-gray-600">Support {campaign.creator.name}'s project</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl">Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {campaign.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Goal</span>
                    <span className="font-semibold">${campaign.goal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-semibold text-green-600">
                      ${campaign.raised.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      </div>
                      <p className="text-sm text-gray-600">{campaign.daysLeft} days left</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                      </div>
                      <p className="text-sm text-gray-600">{campaign.backers} backers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Payment Details</CardTitle>
                <p className="text-gray-600">Secure payment powered by Stripe</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Backing Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                        min="1"
                        step="0.01"
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-sm">{errors.amount}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message to Creator (Optional)</Label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Leave a message of support..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Card Details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <h3 className="font-semibold">Card Information</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            e.target.value = formatCardNumber(e.target.value);
                            handleInputChange(e);
                          }}
                          className={errors.cardNumber ? 'border-red-500' : ''}
                          disabled={isLoading}
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">Card Holder Name</Label>
                        <Input
                          id="cardHolder"
                          name="cardHolder"
                          type="text"
                          placeholder="John Doe"
                          value={formData.cardHolder}
                          onChange={handleInputChange}
                          className={errors.cardHolder ? 'border-red-500' : ''}
                          disabled={isLoading}
                        />
                        {errors.cardHolder && (
                          <p className="text-red-500 text-sm">{errors.cardHolder}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            type="text"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => {
                              e.target.value = formatExpiryDate(e.target.value);
                              handleInputChange(e);
                            }}
                            className={errors.expiryDate ? 'border-red-500' : ''}
                            disabled={isLoading}
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-500 text-sm">{errors.expiryDate}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            type="text"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={errors.cvv ? 'border-red-500' : ''}
                            disabled={isLoading}
                            maxLength={4}
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-sm">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Secure Payment</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing Payment...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Complete Payment</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 