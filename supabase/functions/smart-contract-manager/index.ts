
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Smart Contract ABI encoder/decoder utilities
class SmartContractManager {
  private infuraUrl: string;

  constructor(projectId: string) {
    this.infuraUrl = `https://mainnet.infura.io/v3/${projectId}`;
  }

  async callContract(contractAddress: string, data: string) {
    const response = await fetch(this.infuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: contractAddress,
            data: data
          },
          'latest'
        ],
        id: 1,
      }),
    });

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.result;
  }

  // Simple function selector encoder (first 4 bytes of keccak256 hash)
  encodeFunctionCall(functionName: string, params: string[] = []): string {
    // This is a simplified version - in production, use a proper ABI encoder
    const signature = `${functionName}(${params.join(',')})`;
    return '0x' + this.keccak256(signature).substring(0, 8);
  }

  // Simple keccak256 implementation for function signatures
  private keccak256(data: string): string {
    // This is a placeholder - in production, use a proper keccak256 implementation
    // For now, we'll use a simple hash for demonstration
    return this.simpleHash(data);
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
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

    const { action, contractData } = await req.json()
    
    const infuraProjectId = Deno.env.get('INFURA_PROJECT_ID')
    if (!infuraProjectId) {
      throw new Error('Infura project ID not configured')
    }

    const contractManager = new SmartContractManager(infuraProjectId)
    let result;

    switch (action) {
      case 'deploy_contract':
        // Register a new smart contract
        const { address, name, type, abi } = contractData

        const { data: contract, error: contractError } = await supabaseClient
          .from('smart_contracts')
          .insert({
            contract_address: address,
            contract_name: name,
            contract_type: type,
            abi: abi,
            network: 'ethereum'
          })
          .select()
          .single()

        if (contractError) throw contractError

        // Log audit trail
        await supabaseClient
          .from('audit_log')
          .insert({
            user_id: user.id,
            action: 'smart_contract_deployed',
            resource_type: 'smart_contract',
            resource_id: contract.id,
            details: { contract_address: address, contract_type: type },
            risk_score: 20
          })

        result = { contract, message: 'Smart contract registered successfully' }
        break

      case 'call_contract':
        // Call a smart contract function
        const { contractAddress, functionName, parameters } = contractData

        // Get contract details from database
        const { data: contractInfo, error: infoError } = await supabaseClient
          .from('smart_contracts')
          .select('*')
          .eq('contract_address', contractAddress)
          .eq('is_active', true)
          .single()

        if (infoError || !contractInfo) {
          throw new Error('Contract not found or inactive')
        }

        // Encode function call (simplified)
        const functionData = contractManager.encodeFunctionCall(functionName, parameters)
        
        // Call the contract
        const callResult = await contractManager.callContract(contractAddress, functionData)

        // Log the contract call
        await supabaseClient
          .from('audit_log')
          .insert({
            user_id: user.id,
            action: 'smart_contract_called',
            resource_type: 'smart_contract',
            resource_id: contractInfo.id,
            details: { 
              function_name: functionName, 
              parameters,
              result: callResult 
            },
            risk_score: 15
          })

        result = { 
          contractInfo, 
          callResult,
          message: 'Smart contract function called successfully' 
        }
        break

      case 'get_contracts':
        // Get all active smart contracts
        const { data: contracts, error: contractsError } = await supabaseClient
          .from('smart_contracts')
          .select('*')
          .eq('is_active', true)
          .order('deployed_at', { ascending: false })

        if (contractsError) throw contractsError

        result = { contracts }
        break

      default:
        throw new Error('Invalid action')
    }

    console.log(`Smart contract operation completed: ${action}`)

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
    console.error('Smart contract error:', error)
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
