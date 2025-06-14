
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, AlertTriangle, Target, RefreshCw, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysis {
  analysis: string;
  riskScore: number;
  diversificationScore: number;
  recommendations: string[];
  predictions: {
    shortTerm: string;
    longTerm: string;
  };
  rebalanceAdvice: string[];
  metrics: {
    assetTypeCount: number;
    concentrationRisk: number;
    holdingsCount: number;
  };
}

export const AIPortfolioInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAIAnalysis = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('ai-portfolio-analysis', {
        body: { userId: user.id, analysisType: 'comprehensive' }
      });

      if (error) throw error;
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI portfolio analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, [user]);

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Portfolio Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Portfolio Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">No portfolio analysis available</p>
          <Button onClick={fetchAIAnalysis} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Portfolio Analysis
            </div>
            <Button onClick={fetchAIAnalysis} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Powered by advanced AI algorithms and market analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 dark:text-gray-300">{analysis.analysis}</p>
          </div>
        </CardContent>
      </Card>

      {/* Risk & Diversification Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Risk Score</span>
                  <span className={`font-bold ${getRiskColor(analysis.riskScore)}`}>
                    {analysis.riskScore}/100
                  </span>
                </div>
                <Progress value={analysis.riskScore} className="h-2" />
                <p className={`text-sm mt-1 ${getRiskColor(analysis.riskScore)}`}>
                  {getRiskLabel(analysis.riskScore)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Holdings</p>
                  <p className="font-bold">{analysis.metrics.holdingsCount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Concentration Risk</p>
                  <p className="font-bold">{analysis.metrics.concentrationRisk.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Diversification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Diversification Score</span>
                  <span className="font-bold text-blue-600">
                    {analysis.diversificationScore}/100
                  </span>
                </div>
                <Progress value={analysis.diversificationScore} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Asset Types</p>
                  <p className="font-bold">{analysis.metrics.assetTypeCount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge variant={analysis.diversificationScore > 70 ? "default" : "secondary"}>
                    {analysis.diversificationScore > 70 ? "Well Diversified" : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            AI Market Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Short-term Outlook (1-3 months)</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis.predictions.shortTerm}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Long-term Outlook (1+ years)</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis.predictions.longTerm}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rebalancing Advice */}
      {analysis.rebalanceAdvice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Rebalancing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.rebalanceAdvice.map((advice, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{advice}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
