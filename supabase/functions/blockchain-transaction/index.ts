
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Web3 functionality using fetch API (TypeScript compatible)
class Web3Provider {
  private infuraUrl: string;

  constructor(projectId: string) {
    this.infuraUrl = `https://mainnet.infura.io/v3/${projectId}`;
  }

  async sendRpcRequest(method: string, params: any[] = []) {
    const response = await fetch(this.infuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.result;
  }

  async getBlockNumber(): Promise<string> {
    return await this.sendRpcRequest('eth_blockNumber');
  }

  async getTransactionByHash(hash: string) {
    return await this.sendRpcRequest('eth_getTransactionByHash', [hash]);
  }

  async getTransactionReceipt(hash: string) {
    return await this.sendRpcRequest('eth_getTransactionReceipt', [hash]);
  }

  async getBalance(address: string): Promise<string> {
    return await this.sendRpcRequest('eth_getBalance', [address, 'latest']);
  }

  async estimateGas(transaction: any): Promise<string> {
    return await this.sendRpcRequest('eth_estimateGas', [transaction]);
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

    const { action, transactionData } = await req.json()
    
    const infuraProjectId = Deno.env.get('INFURA_PROJECT_ID')
    if (!infuraProjectId) {
      throw new Error('Infura project ID not configured')
    }

    const web3 = new Web3Provider(infuraProjectId)

    let result;

    switch (action) {
      case 'record_transaction':
        // Record a transaction on blockchain for audit trail
        const { type, amount, asset_symbol, metadata } = transactionData

        // Insert into blockchain_transactions table
        const { data: transaction, error: txError } = await supabaseClient
          .from('blockchain_transactions')
          .insert({
            user_id: user.id,
            transaction_type: type,
            amount: amount,
            asset_symbol: asset_symbol,
            blockchain_network: 'ethereum',
            status: 'pending',
            metadata: metadata
          })
          .select()
          .single()

        if (txError) throw txError

        // Log audit trail
        await supabaseClient
          .from('audit_log')
          .insert({
            user_id: user.id,
            action: 'blockchain_transaction_created',
            resource_type: 'blockchain_transaction',
            resource_id: transaction.id,
            details: { transaction_type: type, amount, asset_symbol },
            risk_score: 10
          })

        result = { transaction, message: 'Transaction recorded on blockchain' }
        break

      case 'verify_transaction':
        // Verify a transaction exists on blockchain
        const { hash } = transactionData
        
        const txReceipt = await web3.getTransactionReceipt(hash)
        const blockNumber = parseInt(await web3.getBlockNumber(), 16)

        if (txReceipt) {
          // Update transaction status
          await supabaseClient
            .from('blockchain_transactions')
            .update({
              status: txReceipt.status === '0x1' ? 'confirmed' : 'failed',
              block_number: parseInt(txReceipt.blockNumber, 16),
              gas_fee: parseInt(txReceipt.gasUsed, 16) * parseInt(txReceipt.effectiveGasPrice || '0', 16) / 1e18
            })
            .eq('transaction_hash', hash)
        }

        result = { 
          verified: !!txReceipt, 
          confirmations: txReceipt ? blockNumber - parseInt(txReceipt.blockNumber, 16) : 0,
          receipt: txReceipt 
        }
        break

      case 'get_balance':
        // Get ETH balance for an address
        const { address } = transactionData
        const balance = await web3.getBalance(address)
        const balanceInEth = parseInt(balance, 16) / 1e18

        result = { balance: balanceInEth, wei: balance }
        break

      case 'estimate_gas':
        // Estimate gas for a transaction
        const gasEstimate = await web3.estimateGas(transactionData.transaction)
        
        result = { 
          gasEstimate: parseInt(gasEstimate, 16),
          estimatedCostEth: parseInt(gasEstimate, 16) * 20e9 / 1e18 // Assuming 20 gwei gas price
        }
        break

      default:
        throw new Error('Invalid action')
    }

    console.log(`Blockchain operation completed: ${action}`)

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
    console.error('Blockchain transaction error:', error)
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
