'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dice1 as Dice, DollarSign, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Kalp Roulette
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto">
              Experience the thrill of blockchain roulette with instant payouts and provably fair gameplay
            </p>
            <Link href="/play">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6">
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
            <Dice className="w-12 h-12 mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">Provably Fair</h3>
            <p className="text-gray-300">Every spin is verifiable on the blockchain, ensuring complete transparency</p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
            <Zap className="w-12 h-12 mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">Instant Payouts</h3>
            <p className="text-gray-300">Winnings are automatically sent to your wallet within seconds</p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
            <Shield className="w-12 h-12 mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-300">Built on Kalp blockchain with enterprise-grade security</p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
            <DollarSign className="w-12 h-12 mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">Low House Edge</h3>
            <p className="text-gray-300">Competitive odds with one of the lowest house edges in crypto gaming</p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Play?</h2>
          <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Join thousands of players and experience the future of online roulette
          </p>
          <Link href="/play">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6">
              Start Playing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}