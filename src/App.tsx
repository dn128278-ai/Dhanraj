import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PhoneLoginScreen } from './components/PhoneLoginScreen';
import { ProfileSetupScreen } from './components/ProfileSetupScreen';
import { CreateMpinScreen } from './components/CreateMpinScreen';
import { MpinLoginScreen } from './components/MpinLoginScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { HistoryHub } from './components/HistoryHub';
import { PassbookScreen } from './components/PassbookScreen';
import { FundsHub } from './components/funds/FundsHub';
import { SupportScreen } from './components/SupportScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { FlutterCodeCenterModal } from './components/FlutterCodeCenterModal';
import { GameCenterScreen } from './components/bidding/GameCenterScreen';
import { SingleDigitBidScreen } from './components/bidding/SingleDigitBidScreen';
import { JodiDigitBidScreen } from './components/bidding/JodiDigitBidScreen';
import { PanaBidScreen } from './components/bidding/PanaBidScreen';
import { TriplePanaBidScreen } from './components/bidding/TriplePanaBidScreen';
import { MotorBidScreen } from './components/bidding/MotorBidScreen';
import { Smartphone, Monitor, Code2 } from 'lucide-react';
import { GameModeType } from './types';

const AppContent: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    isAuthenticated,
    selectedMarketForBid,
    setSelectedMarketForBid,
    selectedGameMode,
    setSelectedGameMode,
    markets,
  } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [flutterModalOpen, setFlutterModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Active market fallback to Kalyan or Sridevi Night if not set
  const currentMarket = selectedMarketForBid || markets.find((m) => m.name === 'SRIDEVI NIGHT') || markets[11];

  // Determine which main view to render
  const renderScreen = () => {
    switch (activeScreen) {
      case 'phone_login':
        return <PhoneLoginScreen />;
      case 'profile_setup':
        return <ProfileSetupScreen />;
      case 'create_mpin':
        return <CreateMpinScreen />;
      case 'mpin_login':
        return <MpinLoginScreen />;
      case 'home':
        return (
          <HomeDashboard
            onOpenDrawer={() => setDrawerOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
          />
        );
      case 'game_center':
        return (
          <GameCenterScreen
            market={currentMarket}
            onBack={() => setActiveScreen('home')}
            onSelectGame={(game: GameModeType) => {
              setSelectedGameMode(game);
              setActiveScreen('bidding_screen');
            }}
          />
        );
      case 'bidding_screen':
        if (!selectedGameMode) {
          return (
            <GameCenterScreen
              market={currentMarket}
              onBack={() => setActiveScreen('home')}
              onSelectGame={(game: GameModeType) => {
                setSelectedGameMode(game);
                setActiveScreen('bidding_screen');
              }}
            />
          );
        }

        if (selectedGameMode === 'Single Digit') {
          return (
            <SingleDigitBidScreen
              market={currentMarket}
              isBulk={false}
              onBack={() => setActiveScreen('game_center')}
            />
          );
        }
        if (selectedGameMode === 'Single Digit Bulk') {
          return (
            <SingleDigitBidScreen
              market={currentMarket}
              isBulk={true}
              onBack={() => setActiveScreen('game_center')}
            />
          );
        }
        if (selectedGameMode === 'Jodi Digit') {
          return (
            <JodiDigitBidScreen
              market={currentMarket}
              isBulk={false}
              onBack={() => setActiveScreen('game_center')}
            />
          );
        }
        if (selectedGameMode === 'Jodi Digit Bulk') {
          return (
            <JodiDigitBidScreen
              market={currentMarket}
              isBulk={true}
              onBack={() => setActiveScreen('game_center')}
            />
          );
        }
        if (
          selectedGameMode === 'Single Pana' ||
          selectedGameMode === 'Single Pana Bulk' ||
          selectedGameMode === 'Double Pana' ||
          selectedGameMode === 'Double Pana Bulk'
        ) {
          return (
            <PanaBidScreen
              market={currentMarket}
              gameType={selectedGameMode}
              onBack={() => setActiveScreen('game_center')}
            />
          );
        }
        if (selectedGameMode === 'Triple Pana') {
          return (
            <TriplePanaBidScreen
              market={currentMarket}
              onBack={() => setActiveScreen('game_center')}
            />
          );
        }
        // Other special game modes: SP Motor, DP Motor, Red Bracket, Group Jodi, SP DP TP
        return (
          <MotorBidScreen
            market={currentMarket}
            gameType={selectedGameMode}
            onBack={() => setActiveScreen('game_center')}
          />
        );

      case 'history':
      case 'bid_history':
      case 'result_history':
        return (
          <HistoryHub
            onOpenDrawer={() => setDrawerOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
          />
        );
      case 'passbook':
        return <PassbookScreen />;
      case 'funds':
      case 'add_fund':
      case 'withdraw_fund':
      case 'bank_details':
      case 'deposit_history':
      case 'withdrawal_history':
        return (
          <FundsHub
            onOpenDrawer={() => setDrawerOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
          />
        );
      case 'support':
        return <SupportScreen />;
      default:
        return (
          <HomeDashboard
            onOpenDrawer={() => setDrawerOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
          />
        );
    }
  };

  const showBottomNav =
    isAuthenticated &&
    ['home', 'history', 'passbook', 'funds', 'support'].includes(activeScreen);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-0 md:p-4 text-neutral-100">
      {/* Top Floating Control Bar for Desktop / Code View (Hidden on mobile to keep app view clean and edge-to-edge) */}
      <header className="w-full max-w-md md:max-w-xl mx-auto py-2 px-4 hidden sm:flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white tracking-wide">Dhan Raj Games</span>
          <span className="bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded-full text-[10px] font-semibold">
            v1.0.0
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Device Frame */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hidden md:flex items-center gap-1.5 transition"
            title="Toggle Device Frame"
          >
            {isMobileFrame ? <Monitor size={14} /> : <Smartphone size={14} />}
            <span>{isMobileFrame ? 'Full Width' : 'Phone Frame'}</span>
          </button>

          {/* Flutter & Backend Source Code Button */}
          <button
            onClick={() => setFlutterModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold hover:brightness-110 active:scale-95 transition shadow-sm"
          >
            <Code2 size={15} />
            <span>Flutter & APK Code</span>
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Device Frame - Clean Edge-to-Edge with NO simulated status bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[420px] h-[100dvh] md:h-[844px] md:rounded-[44px] shadow-2xl md:ring-8 md:ring-neutral-800'
            : 'max-w-2xl h-[100dvh] md:h-[90vh] md:rounded-3xl shadow-2xl'
        } bg-white text-neutral-900 flex flex-col overflow-hidden relative`}
      >
        {/* Dynamic Screen View */}
        <div
          className={`flex-1 ${
            activeScreen === 'home' ? 'overflow-hidden' : 'overflow-y-auto'
          } flex flex-col relative bg-neutral-100 min-h-0`}
        >
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNavBar />}

        {/* Sidebar Drawer */}
        <SidebarDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpenCodeCenter={() => setFlutterModalOpen(true)}
        />

        {/* Notifications Modal */}
        <NotificationsModal
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </div>

      {/* Flutter & Backend Source Code Modal */}
      <FlutterCodeCenterModal
        isOpen={flutterModalOpen}
        onClose={() => setFlutterModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
