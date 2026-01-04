import { useState } from "react";
import { X, MessageSquare, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ratingOptions = ["Excellent", "Good", "Satisfactory", "Poor"];

const FeedbackSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    userFriendliness: "",
    fareCompetitiveness: "",
    communicationSkills: "",
    informationPromptly: "",
    suggestion: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your feedback!",
      description: "We appreciate your valuable input.",
    });
    setIsOpen(false);
    setFormData({
      email: "",
      phone: "",
      userFriendliness: "",
      fareCompetitiveness: "",
      communicationSkills: "",
      informationPromptly: "",
      suggestion: "",
    });
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2 px-2 py-4 rounded-l-lg text-white font-semibold transition-all duration-300 hover:pr-4 shadow-lg"
        style={{ 
          backgroundColor: "#626d84",
          writingMode: "vertical-rl",
          textOrientation: "mixed"
        }}
      >
        <MessageSquare size={20} className="rotate-90" />
        Feedback
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div 
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl animate-scale-in"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: "#626d84" }}
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="p-6 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                We thank you for choosing Phoenix Travelopedia
              </h2>
              <p className="text-gray-600 mt-1">
                and for giving the feedback of your experience with us.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6">
              {/* Contact Fields */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-[#626d84] focus:border-[#626d84] focus:ring-[#626d84] focus-visible:ring-[#626d84]"
                  />
                </div>
                <div className="flex gap-2">
                  <div 
                    className="flex items-center px-3 rounded-l-md border border-r-0 text-sm"
                    style={{ borderColor: "#626d84", color: "#626d84" }}
                  >
                    🇮🇳 +91
                  </div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-l-none border-[#626d84] focus:border-[#626d84] focus:ring-[#626d84] focus-visible:ring-[#626d84]"
                  />
                </div>
              </div>

              {/* Experience Sections */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Website Experience */}
                <div 
                  className="p-4 rounded-lg border"
                  style={{ borderColor: "#626d84" }}
                >
                  <h3 className="font-semibold text-gray-800 mb-4" style={{ color: "#626d84" }}>
                    Website Experience
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">User Friendliness</p>
                      <RadioGroup
                        value={formData.userFriendliness}
                        onValueChange={(value) => setFormData({ ...formData, userFriendliness: value })}
                        className="flex flex-wrap gap-3"
                      >
                        {ratingOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-1">
                            <RadioGroupItem
                              value={option}
                              id={`uf-${option}`}
                              className="border-[#626d84] text-[#626d84]"
                            />
                            <Label htmlFor={`uf-${option}`} className="text-sm text-gray-600 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Fare Competitiveness</p>
                      <RadioGroup
                        value={formData.fareCompetitiveness}
                        onValueChange={(value) => setFormData({ ...formData, fareCompetitiveness: value })}
                        className="flex flex-wrap gap-3"
                      >
                        {ratingOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-1">
                            <RadioGroupItem
                              value={option}
                              id={`fc-${option}`}
                              className="border-[#626d84] text-[#626d84]"
                            />
                            <Label htmlFor={`fc-${option}`} className="text-sm text-gray-600 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Customer Support Experience */}
                <div 
                  className="p-4 rounded-lg border"
                  style={{ borderColor: "#626d84" }}
                >
                  <h3 className="font-semibold mb-4" style={{ color: "#626d84" }}>
                    Customer Support Experience
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Communication Skills</p>
                      <RadioGroup
                        value={formData.communicationSkills}
                        onValueChange={(value) => setFormData({ ...formData, communicationSkills: value })}
                        className="flex flex-wrap gap-3"
                      >
                        {ratingOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-1">
                            <RadioGroupItem
                              value={option}
                              id={`cs-${option}`}
                              className="border-[#626d84] text-[#626d84]"
                            />
                            <Label htmlFor={`cs-${option}`} className="text-sm text-gray-600 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Information Given Promptly</p>
                      <RadioGroup
                        value={formData.informationPromptly}
                        onValueChange={(value) => setFormData({ ...formData, informationPromptly: value })}
                        className="flex flex-wrap gap-3"
                      >
                        {ratingOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-1">
                            <RadioGroupItem
                              value={option}
                              id={`ip-${option}`}
                              className="border-[#626d84] text-[#626d84]"
                            />
                            <Label htmlFor={`ip-${option}`} className="text-sm text-gray-600 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestion */}
              <div className="mb-6">
                <Textarea
                  placeholder="Your Valuable Suggestion for Improvement"
                  value={formData.suggestion}
                  onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                  className="min-h-[100px] border-[#626d84] focus:border-[#626d84] focus:ring-[#626d84] focus-visible:ring-[#626d84]"
                />
              </div>

              {/* File Upload */}
              <div 
                className="mb-6 p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500"
                style={{ borderColor: "#626d84" }}
              >
                <Upload size={32} style={{ color: "#626d84" }} />
                <p className="mt-2 text-sm">Drag and drop file</p>
                <p className="text-xs text-gray-400">OR</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  style={{ borderColor: "#626d84", color: "#626d84" }}
                >
                  Browse Files
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-white font-semibold py-3"
                style={{ backgroundColor: "#626d84" }}
              >
                Submit Feedback
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackSection;
