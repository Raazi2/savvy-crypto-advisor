
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wallet, Search, ExternalLink, Copy, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  gas: string;
}

interface WalletData {
  address: string;
  balance: string;
  transactions: Transaction[];
}

export const WalletViewer = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const { toast } = useToast();

  const handleWalletLookup = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid wallet address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call (replace with actual Etherscan API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock wallet data
      const mockData: WalletData = {
        address: walletAddress,
        balance: "2.45",
        transactions: [
          {
            hash: "0x1234...abcd",
            from: "0x742d35Cc6AbC...",
            to: walletAddress,
            value: "0.5",
            timestamp: "2024-01-15 14:30:22",
            gas: "21000"
          },
          {
            hash: "0x5678...efgh",
            from: walletAddress,
            to: "0x8ba1f109551b...",
            value: "1.2",
            timestamp: "2024-01-14 09:15:18",
            gas: "21000"
          },
          {
            hash: "0x9abc...ijkl",
            from: "0xd8dA6BF26964...",
            to: walletAddress,
            value: "3.0",
            timestamp: "2024-01-13 16:45:30",
            gas: "21000"
          }
        ]
      };

      setWalletData(mockData);
      toast({
        title: "Success",
        description: "Wallet data loaded successfully",
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wallet Input */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter Ethereum wallet address (0x...)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-white/5 border-white/20"
            />
            <Button 
              onClick={handleWalletLookup}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : 'Lookup'}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWalletAddress('0x742d35Cc6AbC6054D23F7E4B0B5Cf4b2AA9D4f8B')}
              className="border-white/20 hover:bg-white/10"
            >
              Demo Wallet 1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWalletAddress('0x8ba1f109551bD432803012645Hac136c1c25E6d')}
              className="border-white/20 hover:bg-white/10"
            >
              Demo Wallet 2
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Data */}
      {walletData && (
        <>
          {/* Balance Card */}
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle>Wallet Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-60">Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white/10 px-2 py-1 rounded">
                      {formatAddress(walletData.address)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullAddress(!showFullAddress)}
                    >
                      {showFullAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(walletData.address)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm opacity-60">ETH Balance</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {walletData.balance} ETH
                  </p>
                  <p className="text-sm opacity-60">
                    ≈ ${(parseFloat(walletData.balance) * 2500).toLocaleString()} USD
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm opacity-60">Network</p>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    Ethereum Mainnet
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {walletData.transactions.map((tx, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm bg-white/10 px-2 py-1 rounded">
                          {tx.hash}
                        </code>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-80">
                        <div>
                          <span className="text-xs opacity-60">From: </span>
                          <code>{formatAddress(tx.from)}</code>
                        </div>
                        <div>
                          <span className="text-xs opacity-60">To: </span>
                          <code>{formatAddress(tx.to)}</code>
                        </div>
                      </div>
                      <p className="text-xs opacity-60 mt-2">{tx.timestamp}</p>
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="font-bold text-lg">
                        {tx.from.toLowerCase() === walletData.address.toLowerCase() ? '-' : '+'}
                        {tx.value} ETH
                      </p>
                      <p className="text-xs opacity-60">Gas: {tx.gas}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Security Notice */}
      <Card className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-black text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">Security Notice</h3>
              <p className="text-sm opacity-80">
                This tool provides read-only access to public blockchain data. We never request or store private keys. 
                Always verify addresses and never share sensitive wallet information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
