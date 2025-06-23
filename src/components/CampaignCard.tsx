import { Heart, Share2, MessageCircle, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  daysLeft: number;
  location: string;
  category: string;
  backers: number;
  creator?: {
    email: string;
  };
  onClick?: () => void;
}

const CampaignCard = ({ 
  id,
  title, 
  description, 
  image, 
  raised, 
  goal, 
  daysLeft, 
  location, 
  category, 
  backers,
  creator,
  onClick
}: CampaignCardProps) => {
  const navigate = useNavigate();
  const progress = (raised / goal) * 100;
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80";
          }}
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 hover:bg-white">
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          {location}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Raised</span>
              <span className="text-gray-600">{Math.round(progress)}% of goal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">${raised.toLocaleString()}</div>
              <div className="text-sm text-gray-500">of ${goal.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {daysLeft} days left
              </div>
              <div className="text-sm text-gray-500">{backers} backers</div>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={(e) => {
                e.stopPropagation();
                if (creator?.email) {
                  navigate(`/payment/${id}?creator=${encodeURIComponent(creator.email)}`);
                } else {
                  alert('Creator information not available');
                }
              }}
            >
              Back This Project
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle like action
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle share action
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
