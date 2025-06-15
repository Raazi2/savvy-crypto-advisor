
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Settings, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AI_MODELS = [
  { id: 'mistralai/devstral-small:free', name: 'Devstral Small', provider: 'Free', description: '24B params, optimized for coding' },
  { id: 'google/gemma-3n-4b:free', name: 'Gemma 3n 4B', provider: 'Free', description: 'Multimodal, mobile-optimized' },
  { id: 'meta-llama/llama-3.3-8b-instruct:free', name: 'Llama 3.3 8B', provider: 'Free', description: 'Ultra-fast, lightweight' },
  { id: 'nousresearch/deephermes-3-mistral-24b:free', name: 'DeepHermes 3 Mistral 24B', provider: 'Free', description: 'Deep reasoning mode' },
  { id: 'microsoft/phi-4-reasoning-plus:free', name: 'Phi 4 Reasoning Plus', provider: 'Free', description: 'Enhanced math & code reasoning' },
  { id: 'microsoft/phi-4-reasoning:free', name: 'Phi 4 Reasoning', provider: 'Free', description: 'Step-by-step logic' },
  { id: 'opengvlab/internvl3-14b:free', name: 'InternVL3 14B', provider: 'Free', description: 'Multimodal, GUI agents' },
  { id: 'opengvlab/internvl3-2b:free', name: 'InternVL3 2B', provider: 'Free', description: 'Fast inference, multimodal' },
];

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI financial advisor specialized in the Indian market. I can help you with investment strategies, Indian stock analysis, mutual funds, tax planning, and cybersecurity best practices. What would you like to discuss today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('mistralai/devstral-small:free');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: selectedModel
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (data?.error) {
        console.error('AI function returned error:', data.error);
        
        // Handle specific errors
        if (data.error.includes('credits exhausted') || data.error.includes('402')) {
          toast({
            title: "OpenRouter Credits Exhausted",
            description: "Please add credits at OpenRouter or try again later.",
            variant: "destructive",
          });
        } else if (data.error.includes('model') && data.error.includes('not')) {
          toast({
            title: "Model Unavailable", 
            description: "This AI model is not available. Trying a different model...",
            variant: "destructive",
          });
          // Auto-switch to a different model
          const availableModels = AI_MODELS.filter(m => m.id !== selectedModel);
          if (availableModels.length > 0) {
            setSelectedModel(availableModels[0].id);
          }
        } else {
          toast({
            title: "AI Error",
            description: data.error,
            variant: "destructive",
          });
        }
        return;
      }
      
      if (data?.response) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('No response received from AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI service. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Model Selection */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            AI Model Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-80 bg-white/5 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                          {model.provider}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className="bg-green-500/20 text-green-400">
              {AI_MODELS.find(m => m.id === selectedModel)?.name} Active
            </Badge>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <p className="font-medium">Premium Free AI Models</p>
                <p className="text-xs opacity-80 mt-1">
                  These are high-quality models with specialized capabilities like coding, reasoning, and multimodal inputs - all completely free!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div
                    className={`p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/20">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Indian stocks, mutual funds, tax planning..."
                  className="pr-12 bg-white/5 border-white/20 backdrop-blur-sm rounded-full text-base py-6"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "Best mutual funds for SIP in 2024?",
          "How to save tax under Section 80C?", 
          "Should I invest in crypto in India?",
          "Top Indian stocks under ₹500?"
        ].map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => setInput(prompt)}
            className="text-left h-auto p-4 backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10"
            disabled={loading}
          >
            <span className="text-sm">{prompt}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
