
import { Calendar, Users, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const FeaturedCampaign = () => {
  const progress = 100;
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="p-6">
            <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              ⭐ Featured Campaign
            </div>
            
            <h2 className="text-2xl font-bold mb-3">
              New Playground Equipment for Lincoln Elementary
            </h2>
            
            <p className="text-gray-600 mb-6">
              Help us create a safe and fun playground for over 400 local children. Our current equipment is 20+ years old and needs replacement.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{progress}% funded</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Target className="h-4 w-4 mr-1 text-blue-600" />
                  </div>
                  <div className="font-bold">$34,250</div>
                  <div className="text-xs text-gray-500">Raised</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 mr-1 text-green-600" />
                  </div>
                  <div className="font-bold">127</div>
                  <div className="text-xs text-gray-500">Backers</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-4 w-4 mr-1 text-purple-600" />
                  </div>
                  <div className="font-bold">12</div>
                  <div className="text-xs text-gray-500">Days Left</div>
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3" disabled={true}>
              Goal Achieved
            </Button>
          </div>
          
          <div className="p-6">
            <img 
              src="https://img.freepik.com/premium-photo/group-happy-playful-indian-children-running-outdoors-park-asian-kids-playing-garden_979520-4959.jpg"
              alt="Children playing on playground"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedCampaign;
