import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, Star, ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { post } from '../services/ApiService';

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleUpgradeFree = async (planType: 'FREE' | 'STARTER') => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    try {
      const res = await post('payments/free-upgrade', { planType });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showNotification('success', `Plan upgraded to ${planType === 'STARTER' ? 'Starter' : 'Free'} successfully!`);
        setTimeout(() => navigate('/templates'), 1200);
      } else {
        showNotification('error', res.data.message || 'Upgrade failed.');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Upgrade failed to process.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    try {
      // 1. Create order on backend
      const orderRes = await post('payments/create-order', {});
      const orderData = orderRes.data;
      if (!orderData.success) {
        showNotification('error', 'Failed to initiate checkout order.');
        setIsLoading(false);
        return;
      }

      // 2. If it's a mock payment (no Razorpay credentials in backend .env)
      if (orderData.isMock) {
        showNotification('success', 'Simulating safe offline payment verification...');
        setTimeout(async () => {
          try {
            const verifyRes = await post('payments/verify', {
              razorpay_order_id: orderData.orderId,
              razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
              razorpay_signature: 'mock_signature',
            });
            if (verifyRes.data.success) {
              login(verifyRes.data.token, verifyRes.data.user);
              showNotification('success', 'Mock payment verified! Welcome to PRO.');
              setTimeout(() => navigate('/templates'), 1500);
            } else {
              showNotification('error', 'Mock verification failed.');
            }
          } catch (err: any) {
            showNotification('error', 'Mock verification error.');
          } finally {
            setIsLoading(false);
          }
        }, 1200);
        return;
      }

      // 3. Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        showNotification('error', 'Razorpay SDK failed to load. Check your internet connection.');
        setIsLoading(false);
        return;
      }

      // 4. Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ProfilIO',
        description: 'PRO Plan Upgrade',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            setIsLoading(true);
            const verifyRes = await post('payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              login(verifyRes.data.token, verifyRes.data.user);
              showNotification('success', 'Payment successful! Welcome to PRO.');
              setTimeout(() => navigate('/templates'), 1500);
            } else {
              showNotification('error', 'Signature verification failed.');
            }
          } catch (err: any) {
            showNotification('error', 'Payment verification failed.');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: user.fullName || '',
          email: user.email || '',
        },
        theme: {
          color: '#6D5DF6',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      showNotification('error', 'Error launching checkout.');
      setIsLoading(false);
    } 
  };

  const tiers = [
    {
      id: 'FREE',
      name: 'Free',
      price: 0,
      priceLabel: 'Free',
      description: 'Perfect for testing the waters and creating your first resume.',
      features: ['1 Resume Download / week', 'Unlimited AI Improvements', 'Basic Templates'],
      popular: false,
      buttonVariant: 'outline',
      action: () => handleUpgradeFree('FREE'),
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: 299,
      priceLabel: '₹299',
      description: 'For serious job seekers who want the absolute best results.',
      features: ['2 Resume Downloads / week', 'Unlimited AI Improvements', 'Premium Templates', 'Priority Support'],
      popular: true,
      buttonVariant: 'purple',
      action: handleProCheckout,
    },
  ].map((tier) => ({
    ...tier,
    buttonText: user?.planType === tier.id ? 'Current Plan' : `Select ${tier.name}`,
    disabled: user?.planType === tier.id,
  }));

  return (
    <main className="min-h-screen bg-slate-50 font-sans pt-28 pb-20 overflow-hidden relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl border backdrop-blur-md pointer-events-auto max-w-md
              ${notification.type === 'success'
                ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                : 'bg-red-50/90 text-red-800 border-red-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span className="text-xs font-semibold">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6D5DF6]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-[#ec4899]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#6D5DF6]/20 shadow-sm mb-4"
          >
            <Star className="w-4 h-4 text-[#6D5DF6]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D5DF6]">Friendly Pricing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="liquid-heading-lg font-black font-display text-[#0F172A]"
          >
            Build your future, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5DF6] to-[#ec4899]">not monthly bills.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-500 font-light max-w-2xl mx-auto"
          >
            Flexible plans for students and job seekers. Get premium resume tools without committing to expensive monthly subscriptions.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto items-stretch justify-items-center px-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`relative rounded-[2.5rem] liquid-card w-full max-w-[400px] flex flex-col justify-between ${tier.popular
                ? 'bg-white text-[#0F172A] shadow-2xl shadow-[#6D5DF6]/20 border-2 border-[#6D5DF6]/50 md:scale-[1.02]'
                : 'bg-white text-[#0F172A] shadow-sm border border-slate-200'
                }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-[#6D5DF6]/30 animate-pulse">
                    <Zap className="w-3.5 h-3.5 fill-current" /> Most Popular
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-6 text-left">
                    <h3 className="text-xl font-bold font-display mb-2 text-[#0F172A]">{tier.name}</h3>
                    <p className="text-sm h-10 text-slate-500">{tier.description}</p>
                  </div>

                  {tier.id === 'PRO' && user?.role !== 'ADMIN' ? (
                    <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-[#6D5DF6]/5 to-[#8B7CF8]/10 border border-[#6D5DF6]/20 text-center relative overflow-hidden shadow-xs">
                      <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping m-3" />
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#6D5DF6]/15 text-[#6D5DF6] text-[10px] font-extrabold uppercase tracking-wider mb-2">
                        Coming Soon
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">Pro Plan Available Soon</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        We are adding final touches to advanced custom features. Get ready to supercharge your resumes!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="mb-6 flex items-baseline gap-1 text-left">
                        <span className="text-3xl font-bold text-[#0F172A]">₹</span>
                        <span className="text-5xl lg:text-6xl font-black font-display tracking-tight text-[#0F172A]">{tier.price}</span>
                        <span className="text-sm font-medium text-slate-400">/ week</span>
                      </div>

                      <Button
                        variant={tier.buttonVariant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "purple"}
                        className={`w-full h-12 rounded-xl text-sm font-bold mb-8 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${tier.buttonVariant === 'outline'
                            ? 'border-slate-200 text-[#0F172A] hover:bg-slate-50'
                            : tier.buttonVariant === 'default'
                              ? 'bg-[#0F172A] hover:bg-[#1E293B] text-white'
                              : 'bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] text-white border-0 hover:opacity-90'
                          }`}
                        onClick={tier.action}
                        disabled={tier.disabled || isLoading}
                      >
                        {tier.buttonText}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 text-left border-t border-slate-100 pt-6 mt-auto">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">What's included</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#6D5DF6]" />
                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 flex flex-col items-center justify-center gap-4 border-t border-slate-200 pt-10"
        >
          <div className="flex items-center gap-6 opacity-60 grayscale flex-wrap justify-center">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-5 h-5" /> Secure Payments
            </span>
            <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
            <span className="font-bold text-slate-800">UPI</span>
            <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
            <span className="font-bold text-slate-800">Cards</span>
            <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
            <span className="font-bold text-slate-800">Net Banking</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">100% Secure Checkout powered by Razorpay</p>
        </motion.div>
      </div>
    </main>
  );
};

export default Pricing;
