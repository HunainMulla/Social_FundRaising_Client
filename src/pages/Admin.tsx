import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  Search, 
  Users, 
  Heart, 
  Trash2, 
  Eye, 
  Edit, 
  Filter,
  MoreHorizontal,
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  joinedDate: string;
  campaignsCount: number;
  totalRaised: number;
  status: "active" | "suspended" | "pending";
}

interface Campaign {
  id: string;
  title: string;
  creator: {
    name: string;
    email: string;
  };
  category: string;
  raised: number;
  goal: number;
  daysLeft: number;
  backers: number;
  status: "active" | "completed" | "suspended" | "pending";
  createdAt: string;
  location: string;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
      location: "Springfield, IL",
      joinedDate: "March 2023",
      campaignsCount: 3,
      totalRaised: 45600,
      status: "active"
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      location: "Chicago, IL",
      joinedDate: "January 2023",
      campaignsCount: 2,
      totalRaised: 35200,
      status: "active"
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@centralhospital.com",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
      location: "Springfield, IL",
      joinedDate: "June 2022",
      campaignsCount: 1,
      totalRaised: 5720,
      status: "active"
    },
    {
      id: "4",
      name: "David Thompson",
      email: "david.thompson@communitycenter.org",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      location: "Springfield, IL",
      joinedDate: "September 2021",
      campaignsCount: 1,
      totalRaised: 18900,
      status: "suspended"
    }
  ]);

  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Community Garden for Downtown District",
      creator: {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com"
      },
      category: "Community",
      raised: 8450,
      goal: 15000,
      daysLeft: 23,
      backers: 67,
      status: "active",
      createdAt: "January 15, 2024",
      location: "Downtown, Springfield"
    },
    {
      id: "2",
      title: "Mobile Food Pantry for Rural Areas",
      creator: {
        name: "Michael Chen",
        email: "michael.chen@email.com"
      },
      category: "Community",
      raised: 12300,
      goal: 25000,
      daysLeft: 18,
      backers: 89,
      status: "active",
      createdAt: "January 10, 2024",
      location: "Rural County"
    },
    {
      id: "3",
      title: "Art Therapy Program for Local Hospital",
      creator: {
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@centralhospital.com"
      },
      category: "Healthcare",
      raised: 5720,
      goal: 10000,
      daysLeft: 31,
      backers: 43,
      status: "active",
      createdAt: "January 1, 2024",
      location: "Central Hospital"
    },
    {
      id: "4",
      title: "Solar Panels for Community Center",
      creator: {
        name: "David Thompson",
        email: "david.thompson@communitycenter.org"
      },
      category: "Environment",
      raised: 18900,
      goal: 30000,
      daysLeft: 14,
      backers: 142,
      status: "suspended",
      createdAt: "December 20, 2023",
      location: "West Side"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return null;
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      // In a real app, this would make an API call to delete the campaign
      console.log("Deleting campaign:", campaignId);
      alert("Campaign deleted successfully!");
    }
  };

  const handleSuspendUser = (userId: string) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      // In a real app, this would make an API call to suspend the user
      console.log("Suspending user:", userId);
      alert("User suspended successfully!");
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
                         campaign.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
                         user.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users and campaigns across the platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.filter(c => c.status === "active").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Raised</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${campaigns.reduce((sum, c) => sum + c.raised, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Suspended</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.filter(c => c.status === "suspended").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
            <Button
              variant={activeTab === "campaigns" ? "default" : "ghost"}
              onClick={() => setActiveTab("campaigns")}
              className="flex-1"
            >
              Campaigns
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              onClick={() => setActiveTab("users")}
              className="flex-1"
            >
              Users
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
                {activeTab === "campaigns" && <option value="completed">Completed</option>}
              </select>
            </div>
          </div>

          {/* Content */}
          {activeTab === "campaigns" && (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{campaign.title}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{campaign.creator.name}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{campaign.location}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{campaign.daysLeft} days left</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80";
                          }}
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{user.location}</span>
                            <span>•</span>
                            <span>{user.campaignsCount} campaigns</span>
                            <span>•</span>
                            <span>${user.totalRaised.toLocaleString()} raised</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(user.status)}
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Suspend
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage; 