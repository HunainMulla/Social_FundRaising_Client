import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { API_BASE_URL } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Heart, Upload, X, Calendar, DollarSign, MapPin, User } from "lucide-react";

interface CampaignFormData {
  title: string;
  description: string;
  goal: number;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
}

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<any>(null);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');

  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    goal: 0,
    category: "",
    location: "",
    startDate: "",
    endDate: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const categories = [
    "Community",
    "Education", 
    "Healthcare",
    "Environment",
    "Animal Welfare",
    "Arts & Culture",
    "Technology",
    "Sports",
    "Other"
  ];

  const uploadImage = async () => {
    if (!image) return alert("Please select an image");

    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'unsigned_upload'); // replace with your preset
    data.append('cloud_name', 'dgbzv4qbb');    // replace with your cloud name

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dgbzv4qbb/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );

      const json = await res.json();
      setUrl(json.secure_url);
    } catch (err) {
      console.error('Upload error:', err);
      alert("Upload failed!");
    } 
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Campaign title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.goal || formData.goal <= 0) {
      newErrors.goal = "Goal amount must be greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else {
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      if (endDate < today) {
        newErrors.endDate = "End date cannot be in the past";
      }
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CampaignFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = url;

      // If an image is selected but not uploaded yet, upload it first
      if (image && !url) {
        try {
          const data = new FormData();
          data.append('file', image);
          data.append('upload_preset', 'unsigned_upload');
          data.append('cloud_name', 'dgbzv4qbb');

          const res = await fetch(
            'https://api.cloudinary.com/v1_1/dgbzv4qbb/image/upload',
            {
              method: 'POST',
              body: data,
            }
          );

          const json = await res.json();
          imageUrl = json.secure_url;
          setUrl(imageUrl);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setError("Failed to upload image. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      // Create campaign data matching userModel.js structure
      const campaignData = {
        name: formData.title,
        description: formData.description,
        amount: formData.goal,
        currentAmount: 0, // Default to 0 as per model
        image: imageUrl || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        category: formData.category,
        location: formData.location
      };

      // Add campaign to user's campaigns array
      const response = await fetch(`${API_BASE_URL}/auth/add-campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(campaignData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Campaign created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setError(data.message || "Failed to create campaign");
      }
    } catch (error: any) {
      console.error("Campaign creation error:", error);
      setError("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-[-10px] md:space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl">
              <Heart className="h-8 w-8 " />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Campaign
            </span>
          </div>
          <p className="text-gray-600">Share your vision and inspire your community to make a difference</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success/Error Messages */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600">{success}</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* Campaign Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a compelling title for your campaign"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell your story. What problem are you solving? How will the funds be used?"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                  disabled={isLoading}
                  rows={6}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Goal Amount */}
              <div className="space-y-2">
                <Label htmlFor="goal">Funding Goal ($) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="goal"
                    type="number"
                    placeholder="Enter your funding goal"
                    value={formData.goal || ''}
                    onChange={(e) => handleInputChange('goal', parseFloat(e.target.value) || 0)}
                    className={`pl-10 ${errors.goal ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    min="1"
                  />
                </div>
                {errors.goal && (
                  <p className="text-red-500 text-sm">{errors.goal}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="City, State or specific location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>

              {/* Campaign Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-red-500 text-sm">{errors.startDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={`pl-10 ${errors.endDate ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-red-500 text-sm">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Campaign Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Campaign Image <sup>*</sup></Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                
                  <button 
                    type="button" 
                    className="bg-blue-500 text-white p-2 rounded-md mr-2" 
                    onClick={uploadImage}
                  >
                    Upload
                  </button>
                  <button 
                    type="button" 
                    className="bg-blue-500 text-white p-2 rounded-md" 
                    onClick={() => { setImage(null); setUrl('') }}
                  >
                    Clear
                  </button>
                </div>
                <p className="text-gray-500 text-xs">Leave empty to use a default campaign image</p>
                {url && <img src={url} alt="Campaign Image" className="w-full h-48 object-cover rounded-md" />}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Campaign..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaign; 