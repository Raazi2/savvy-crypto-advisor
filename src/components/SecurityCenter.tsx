
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, ExternalLink, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecurityTip {
  id: string;
  title: string;
  description: string;
  category: 'wallet' | 'phishing' | 'social' | 'general';
  severity: 'low' | 'medium' | 'high';
}

interface ScamAlert {
  id: string;
  title: string;
  description: string;
  date: string;
  source: string;
}

const SECURITY_TIPS: SecurityTip[] = [
  {
    id: '1',
    title: 'Never Share Private Keys',
    description: 'Your private key is like your bank account password. Never share it with anyone, including customer support.',
    category: 'wallet',
    severity: 'high'
  },
  {
    id: '2',
    title: 'Enable 2FA Everywhere',
    description: 'Use two-factor authentication on all crypto exchanges and financial accounts.',
    category: 'general',
    severity: 'high'
  },
  {
    id: '3',
    title: 'Verify URLs Carefully',
    description: 'Always double-check website URLs. Scammers create fake sites that look identical to real ones.',
    category: 'phishing',
    severity: 'medium'
  },
  {
    id: '4',
    title: 'Be Wary of Social Media DMs',
    description: 'Legitimate companies never contact you first about investment opportunities via DM.',
    category: 'social',
    severity: 'high'
  },
  {
    id: '5',
    title: 'Use Hardware Wallets',
    description: 'For large amounts, store crypto in hardware wallets offline.',
    category: 'wallet',
    severity: 'medium'
  }
];

const RECENT_SCAMS: ScamAlert[] = [
  {
    id: '1',
    title: 'Fake Ethereum Upgrade Phishing',
    description: 'Scammers are sending emails about a fake "Ethereum 3.0 upgrade" requiring wallet validation.',
    date: '2024-01-15',
    source: 'CryptoScamDB'
  },
  {
    id: '2',
    title: 'AI Investment Bot Ponzi',
    description: 'Multiple reports of fake AI trading bots promising 50% weekly returns.',
    date: '2024-01-14',
    source: 'Community Reports'
  },
  {
    id: '3',
    title: 'Telegram Support Impersonation',
    description: 'Fake customer support accounts on Telegram asking for seed phrases.',
    date: '2024-01-13',
    source: 'Security Advisory'
  }
];

export const SecurityCenter = () => {
  const [scamCheckText, setScamCheckText] = useState('');
  const [scamCheckResult, setScamCheckResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleScamCheck = async () => {
    if (!scamCheckText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = analyzeForScam(scamCheckText);
      setScamCheckResult(result);
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Error",
        description: "Failed to analyze text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeForScam = (text: string): string => {
    const lowerText = text.toLowerCase();
    const scamKeywords = [
      'guaranteed returns', 'investment opportunity', 'crypto giveaway',
      'validate wallet', 'urgent action required', 'limited time offer',
      'double your crypto', 'exclusive deal', 'free tokens'
    ];

    const suspiciousPatterns = scamKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );

    if (suspiciousPatterns.length >= 3) {
      return `🚨 HIGH RISK: This message contains multiple scam indicators: ${suspiciousPatterns.join(', ')}. Do not respond or click any links.`;
    } else if (suspiciousPatterns.length >= 1) {
      return `⚠️ MEDIUM RISK: This message contains potential scam indicators: ${suspiciousPatterns.join(', ')}. Exercise extreme caution.`;
    } else {
      return `✅ LOW RISK: No obvious scam indicators detected, but always remain cautious with unsolicited messages.`;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wallet': return '🔐';
      case 'phishing': return '🎣';
      case 'social': return '💬';
      default: return '🛡️';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Cybersecurity Center
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Stay protected with real-time scam alerts, security tips, and AI-powered threat analysis.
        </p>
      </div>

      {/* Scam Checker */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            AI Scam Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste suspicious messages, emails, or DMs here for AI analysis..."
            value={scamCheckText}
            onChange={(e) => setScamCheckText(e.target.value)}
            className="min-h-32 bg-white/5 border-white/20"
          />
          
          <Button 
            onClick={handleScamCheck}
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
          >
            {loading ? 'Analyzing...' : 'Check for Scams'}
          </Button>

          {scamCheckResult && (
            <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
              <CardContent className="p-4">
                <h4 className="font-bold mb-2">Analysis Result:</h4>
                <p className="text-sm leading-relaxed">{scamCheckResult}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECURITY_TIPS.map((tip) => (
              <Card key={tip.id} className="backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getCategoryIcon(tip.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{tip.title}</h4>
                        <Badge className={getSeverityColor(tip.severity)}>
                          {tip.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm opacity-80">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Scam Alerts */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent Scam Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_SCAMS.map((scam) => (
              <Card key={scam.id} className="backdrop-blur-sm bg-red-500/5 border border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-red-400">{scam.title}</h4>
                        <Badge variant="destructive">Alert</Badge>
                      </div>
                      <p className="text-sm opacity-80 mb-2">{scam.description}</p>
                      <div className="flex items-center gap-4 text-xs opacity-60">
                        <span>📅 {scam.date}</span>
                        <span>📍 {scam.source}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Security Checklist */}
      <Card className="backdrop-blur-xl bg-green-500/10 border border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Security Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Use unique passwords for all accounts',
              'Enable 2FA on all financial platforms',
              'Keep software and browsers updated',
              'Never share private keys or seed phrases',
              'Verify website URLs before logging in',
              'Be skeptical of unsolicited investment offers'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
