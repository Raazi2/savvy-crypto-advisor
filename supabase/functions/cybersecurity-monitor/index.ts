
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Risk assessment algorithms
class SecurityAnalyzer {
  
  calculateRiskScore(action: string, userAgent: string, ipAddress: string, metadata: any): number {
    let riskScore = 0;

    // Base risk scores for different actions
    const actionRisks: { [key: string]: number } = {
      'login': 10,
      'password_change': 30,
      'api_key_change': 40,
      'large_transaction': 50,
      'withdrawal': 60,
      'profile_update': 20,
      'blockchain_transaction': 35,
      'smart_contract_interaction': 45
    };

    riskScore += actionRisks[action] || 10;

    // Suspicious user agent patterns
    if (!userAgent || userAgent.includes('bot') || userAgent.length < 20) {
      riskScore += 20;
    }

    // Transaction amount analysis
    if (metadata?.amount && parseFloat(metadata.amount) > 10000) {
      riskScore += 25;
    }

    // Time-based analysis (night time activities are slightly riskier)
    const hour = new Date().getHours();
    if (hour >= 23 || hour <= 5) {
      riskScore += 10;
    }

    // Cap risk score at 100
    return Math.min(riskScore, 100);
  }

  detectAnomalies(recentActivity: any[]): string[] {
    const anomalies: string[] = [];

    if (recentActivity.length === 0) return anomalies;

    // Check for rapid successive actions
    const rapidActions = recentActivity.filter(activity => {
      const timeDiff = Date.now() - new Date(activity.created_at).getTime();
      return timeDiff < 60000; // Last minute
    });

    if (rapidActions.length > 5) {
      anomalies.push('Rapid successive actions detected');
    }

    // Check for high-risk actions
    const highRiskActions = recentActivity.filter(activity => activity.risk_score > 60);
    if (highRiskActions.length > 0) {
      anomalies.push('High-risk actions detected');
    }

    return anomalies;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { action, auditData } = await req.json()
    const analyzer = new SecurityAnalyzer()

    let result;

    switch (action) {
      case 'log_activity':
        // Log user activity with risk assessment
        const { 
          activity_action, 
          resource_type, 
          resource_id, 
          ip_address, 
          user_agent, 
          details 
        } = auditData

        const riskScore = analyzer.calculateRiskScore(
          activity_action, 
          user_agent, 
          ip_address, 
          details
        )

        const { data: logEntry, error: logError } = await supabaseClient
          .from('audit_log')
          .insert({
            user_id: user.id,
            action: activity_action,
            resource_type: resource_type,
            resource_id: resource_id,
            ip_address: ip_address,
            user_agent: user_agent,
            details: details,
            risk_score: riskScore
          })
          .select()
          .single()

        if (logError) throw logError

        // Check if we need to create a security alert
        if (riskScore > 70) {
          await supabaseClient
            .from('security_alerts')
            .insert({
              user_id: user.id,
              title: 'High-Risk Activity Detected',
              description: `High-risk action "${activity_action}" detected with risk score ${riskScore}`,
              severity: 'high',
              alert_type: 'scam',
              is_read: false
            })
        }

        result = { logEntry, riskScore, message: 'Activity logged successfully' }
        break

      case 'security_analysis':
        // Perform security analysis for user
        
        // Get recent activity (last 24 hours)
        const { data: recentActivity, error: activityError } = await supabaseClient
          .from('audit_log')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })

        if (activityError) throw activityError

        const anomalies = analyzer.detectAnomalies(recentActivity || [])
        const averageRiskScore = recentActivity?.length 
          ? recentActivity.reduce((sum, activity) => sum + (activity.risk_score || 0), 0) / recentActivity.length
          : 0

        // Security recommendations
        const recommendations = []
        if (averageRiskScore > 50) {
          recommendations.push('Consider enabling additional security measures')
        }
        if (anomalies.length > 0) {
          recommendations.push('Review recent unusual activities')
        }

        result = {
          recentActivityCount: recentActivity?.length || 0,
          averageRiskScore: Math.round(averageRiskScore),
          anomalies,
          recommendations,
          securityStatus: averageRiskScore > 60 ? 'high_risk' : averageRiskScore > 30 ? 'medium_risk' : 'low_risk'
        }
        break

      case 'get_audit_logs':
        // Get user's audit logs
        const { data: auditLogs, error: auditError } = await supabaseClient
          .from('audit_log')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100)

        if (auditError) throw auditError

        result = { auditLogs }
        break

      default:
        throw new Error('Invalid action')
    }

    console.log(`Cybersecurity operation completed: ${action}`)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Cybersecurity monitor error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
