'use client';

import { useState } from 'react';
import { RouletteWheel } from '@/components/RouletteWheel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { placeBet, spinWheel, getBet } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function PlayPage() {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [betNumber, setBetNumber] = useState<number>(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  const handlePlaceBet = async () => {
    try {
      setLoading(true);
      const betId = `bet-${Date.now()}`;
      
      await placeBet({
        betId,
        player: 'f7ab37ac45651c19cd73fba93b1b1a2b5fe18e3e',
        betType: 'number',
        betNumber,
        betAmount,
      });

      setSpinning(true);
      
      await spinWheel({
        betId,
        playerSeed: Math.floor(Math.random() * 100),
      });

      const betResult = await getBet({ betId });
      setResult(betResult.winningNumber);
      setSpinning(false);

      if (betResult.winningNumber === betNumber) {
        toast.success('Congratulations! You won!');
      } else {
        toast.error('Better luck next time!');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setSpinning(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Kalp Roulette</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <RouletteWheel spinning={spinning} number={result} />
          </div>
          
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
            <h2 className="text-2xl font-semibold mb-6">Place Your Bet</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bet Amount (KALP)</label>
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min={1}
                  className="bg-white/5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Choose Number (0-36)</label>
                <Input
                  type="number"
                  value={betNumber}
                  onChange={(e) => setBetNumber(Number(e.target.value))}
                  min={0}
                  max={36}
                  className="bg-white/5"
                />
              </div>
              
              <Button
                onClick={handlePlaceBet}
                disabled={loading || spinning}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Bet & Spin'
                )}
              </Button>
            </div>
            
            {result !== undefined && (
              <div className="mt-6 text-center">
                <p className="text-lg">
                  Result: <span className="font-bold text-2xl">{result}</span>
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}