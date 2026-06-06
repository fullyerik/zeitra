import { Component, OnDestroy, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './timer.html',
  styleUrl: './timer.css',
})
export class TimerComponent implements OnInit, OnDestroy {
  activePage:
    | 'home'
    | 'stopwatch'
    | 'countdown'
    | 'zeitgefuehl'
    | 'reaktion'
    | 'stopclock'
    | 'bpm'
    | 'blindcounter'
    | 'sequence'
    | 'leaderboard'
    | 'profile'
    | 'shop' = 'home';
  gamesOpen = true;
  profileLoaded = false;

  // --- Coins ---
  coins = 0;
  showCoinReward = false;
  coinRewardAmount = 0;
  coinRewardReason = '';

  Math = Math;

  // --- Auth ---
  currentUser: any = null;
  showWelcomePopup = true;
  showAccountPopup = false;
  showLoginForm = false;
  showRegisterForm = false;
  authEmail = '';
  authPassword = '';
  authUsername = '';
  authError = '';
  authLoading = false;

  // --- Profile ---
  profile: any = null;
  editUsername = '';
  editBio = '';
  editAvatarBorder = 'border-blue';
  editAvatarGlow = '';
  editShowEmail = false;
  editLinks: { label: string; url: string }[] = [
    { label: '', url: '' },
    { label: '', url: '' },
    { label: '', url: '' },
  ];
  profileSaving = false;
  profileSaveMsg = '';
  avatarUploading = false;
  bannerUploading = false;

  // --- Profile Search ---
  searchQuery = '';
  searchResults: any[] = [];
  searchLoading = false;
  viewingProfile: any = null;
  showProfilePopup = false;

  avatarBorders = [
    { id: 'border-blue', label: 'Blau', price: 0 },
    { id: 'border-purple', label: 'Lila', price: 100 },
    { id: 'border-green', label: 'Grün', price: 200 },
    { id: 'border-red', label: 'Rot', price: 300 },
    { id: 'border-gold', label: 'Gold', price: 500 },
    { id: 'border-rainbow', label: 'Rainbow', price: 1000 },
  ];

  avatarGlows = [
    { id: '', label: 'Kein Glow', price: 0 },
    { id: 'glow-blue', label: 'Blau', price: 150 },
    { id: 'glow-purple', label: 'Lila', price: 250 },
    { id: 'glow-green', label: 'Grün', price: 400 },
    { id: 'glow-gold', label: 'Gold', price: 600 },
    { id: 'glow-rainbow', label: 'Rainbow', price: 1200 },
  ];

  // --- Shop / Owned ---
  ownedBorders: string[] = ['border-blue'];
  ownedGlows: string[] = [''];
  shopTab: 'borders' | 'glows' | 'titles' | 'usernames' = 'borders';
  purchaseMsg = '';
  purchasing = false;

  // --- Titel ---
  ownedTitles: string[] = ['none'];
  selectedTitle = 'none';
  editSelectedTitle = 'none';

  availableTitles = [
    // gratis default
    { id: 'none', label: '— Kein Titel —', tier: 'none', price: 0 },
    // Common (50-100)
    { id: 'newbie', label: 'Newbie', tier: 'common', price: 50 },
    { id: 'rookie', label: 'Rookie', tier: 'common', price: 50 },
    { id: 'explorer', label: 'Entdecker', tier: 'common', price: 75 },
    { id: 'casual', label: 'Casual Gamer', tier: 'common', price: 75 },
    { id: 'trainee', label: 'Auszubildender', tier: 'common', price: 100 },
    // Rare (200-400)
    { id: 'timekeeper', label: 'Zeitwächter', tier: 'rare', price: 200 },
    { id: 'reflexpro', label: 'Reflex-Profi', tier: 'rare', price: 250 },
    { id: 'beatmaster', label: 'Beat-Meister', tier: 'rare', price: 250 },
    { id: 'patternsolver', label: 'Pattern-Solver', tier: 'rare', price: 300 },
    { id: 'numberninja', label: 'Zahlen-Ninja', tier: 'rare', price: 350 },
    // Epic (500-800)
    { id: 'timewizard', label: 'Zeit-Magier', tier: 'epic', price: 500 },
    { id: 'speeddemon', label: 'Speed Demon', tier: 'epic', price: 600 },
    { id: 'rhythmking', label: 'Rhythm King', tier: 'epic', price: 600 },
    { id: 'mindmaster', label: 'Mind Master', tier: 'epic', price: 700 },
    { id: 'gamechamp', label: 'Game Champion', tier: 'epic', price: 800 },
    // Legendary (1000+)
    { id: 'timegod', label: 'Zeit-Gott', tier: 'legendary', price: 1200 },
    { id: 'reflexlegend', label: 'Reflex-Legende', tier: 'legendary', price: 1500 },
    { id: 'untouchable', label: 'Unantastbar', tier: 'legendary', price: 1800 },
    { id: 'chronos', label: 'Chronos', tier: 'legendary', price: 2000 },
  ];

  // --- Username-Styles ---
  ownedUsernameStyles: string[] = ['default'];
  selectedUsernameStyle = 'default';
  editSelectedUsernameStyle = 'default';

  availableUsernameStyles = [
    // gratis default
    { id: 'default', label: 'Standard', price: 0, category: 'default' },
    // Static Colors (100-200)
    { id: 'gold', label: 'Gold', price: 200, category: 'static' },
    { id: 'silver', label: 'Silber', price: 150, category: 'static' },
    { id: 'bronze', label: 'Bronze', price: 100, category: 'static' },
    { id: 'cyan', label: 'Cyan', price: 150, category: 'static' },
    { id: 'pink', label: 'Pink', price: 150, category: 'static' },
    // Gradients (300-450)
    { id: 'sunset', label: 'Sonnenuntergang', price: 300, category: 'gradient' },
    { id: 'ocean', label: 'Ozean', price: 350, category: 'gradient' },
    { id: 'forest', label: 'Wald', price: 350, category: 'gradient' },
    { id: 'fire', label: 'Feuer', price: 450, category: 'gradient' },
    // Animated (600+)
    { id: 'rainbow', label: 'Rainbow-Flow', price: 700, category: 'animated' },
    { id: 'pulse', label: 'Pulse-Glow', price: 600, category: 'animated' },
    { id: 'sparkle', label: 'Sparkle', price: 800, category: 'animated' },
  ];

  // --- Admin (hidden) ---
  private readonly ADMIN_PW = '2010';
  adminLoginOpen = false;
  adminPanelOpen = false;
  adminPwInput = '';
  adminPwError = '';
  adminTab: 'self' | 'users' | 'cleanup' = 'self';
  adminCoinsInput = 0;
  adminMsg = '';
  adminUsers: any[] = [];
  adminUsersLoading = false;
  adminTargetUser: any = null;
  adminTargetCoinsInput = 0;
  adminCleanupGame = 'zeitgefuehl';
  adminCleanupLevel = 1;
  adminCleanupConfirm = false;

  // --- Clock ---
  currentTime = '';
  clockInterval: any = null;

  // --- Stopwatch ---
  swElapsed = 0;
  swRunning = false;
  swInterval: any = null;

  // --- Countdown ---
  cdInput = 60;
  cdRemaining = 60;
  cdRunning = false;
  cdFinished = false;
  cdInterval: any = null;

  // --- Zeitgefühl ---
  zgPhase: 'select' | 'playing' | 'result' = 'select';
  zgLevel = 1;
  zgTargetSeconds = 10;
  zgElapsed = 0;
  zgStoppedAt = 0;
  zgDiff = 0;
  zgInterval: any = null;
  zgBestScores: { [level: number]: number } = {};
  zgResultIcon = '';
  zgResultText = '';

  // --- Leaderboard ---
  leaderboardData: any[] = [];
  leaderboardLevel: number = 1;
  leaderboardGame: string = 'zeitgefuehl';
  leaderboardLoading = false;
  leaderboardGames = [
    {
      id: 'zeitgefuehl',
      label: '🎯 Zeitgefühl',
      levels: [
        { level: 1, label: 'L1 (3s)' },
        { level: 2, label: 'L2 (5s)' },
        { level: 3, label: 'L3 (7s)' },
        { level: 4, label: 'L4 (10s)' },
        { level: 5, label: 'L5 (15s)' },
        { level: 6, label: 'L6 (20s)' },
        { level: 7, label: 'L7 (30s)' },
        { level: 8, label: 'L8 (45s)' },
        { level: 9, label: 'L9 (60s)' },
        { level: 10, label: 'L10 (90s)' },
      ],
    },
    {
      id: 'reaktion',
      label: '⚡ Reaktionstest',
      levels: [{ level: 0, label: 'Bestzeit' }],
    },
    {
      id: 'stopclock',
      label: '🛑 Stop the Clock',
      levels: [
        { level: 1, label: 'L1 (5s)' },
        { level: 2, label: 'L2 (10s)' },
        { level: 3, label: 'L3 (10s blind)' },
        { level: 4, label: 'L4 (15s blind)' },
        { level: 5, label: 'L5 (20s)' },
      ],
    },
    {
      id: 'bpm',
      label: '🥁 BPM Tap',
      levels: [
        { level: 80, label: '80 BPM' },
        { level: 100, label: '100 BPM' },
        { level: 120, label: '120 BPM' },
        { level: 140, label: '140 BPM' },
      ],
    },
    {
      id: 'blindcounter',
      label: '🔢 Blind Counter',
      levels: [
        { level: 10, label: '10s' },
        { level: 15, label: '15s' },
        { level: 20, label: '20s' },
        { level: 30, label: '30s' },
        { level: 45, label: '45s' },
        { level: 60, label: '60s' },
      ],
    },
    {
      id: 'sequence',
      label: '🧠 Sequence Memory',
      levels: [{ level: 0, label: 'Höchste Runde' }],
    },
  ];

  // --- Reaktionstest ---
  rtPhase: 'idle' | 'waiting' | 'go' | 'result' | 'foul' = 'idle';
  rtReactionMs = 0;
  rtStartTimestamp = 0;
  rtTimeoutId: any = null;
  rtBest = 0;

  // --- Stop the Clock ---
  scPhase: 'select' | 'playing' | 'result' = 'select';
  scTargetMs = 10000;
  scLevel = 1;
  scElapsedMs = 0;
  scStoppedAtMs = 0;
  scDiffMs = 0;
  scInterval: any = null;
  scShowDisplay = true;
  scLevels = [
    { level: 1, target: 5000, hideAfter: 0 },
    { level: 2, target: 10000, hideAfter: 0 },
    { level: 3, target: 10000, hideAfter: 2000 },
    { level: 4, target: 15000, hideAfter: 3000 },
    { level: 5, target: 20000, hideAfter: 0 },
  ];

  // --- BPM Tap ---
  bpmPhase: 'select' | 'demo' | 'tap' | 'result' = 'select';
  bpmTarget = 120;
  bpmTapTimes: number[] = [];
  bpmDemoCount = 4;
  bpmDemoIndex = 0;
  bpmDemoInterval: any = null;
  bpmShowBeat = false;
  bpmAvgDiffMs = 0;
  bpmTapsNeeded = 8;
  bpmOptions = [80, 100, 120, 140];

  // --- Blind Counter ---
  bcPhase: 'select' | 'idle' | 'counting' | 'result' = 'select';
  bcTarget = 60;
  bcStart = 0;
  bcStoppedAt = 0;
  bcDiff = 0;
  bcTargetOptions = [10, 15, 20, 30, 45, 60];

  // --- Sequence Memory ---
  seqPhase: 'idle' | 'showing' | 'input' | 'success' | 'fail' = 'idle';
  seqSequence: number[] = [];
  seqUserInput: number[] = [];
  seqRound = 0;
  seqHighlight = -1;
  seqShowTimer: any = null;
  seqColors = [
    { id: 0, color: '#4a9eff', label: 'Blau' },
    { id: 1, color: '#ff4b7a', label: 'Rot' },
    { id: 2, color: '#4bff9a', label: 'Grün' },
    { id: 3, color: '#ffd700', label: 'Gold' },
  ];

  zgLevels = [
    { level: 1, target: 3 },
    { level: 2, target: 5 },
    { level: 3, target: 7 },
    { level: 4, target: 10 },
    { level: 5, target: 15 },
    { level: 6, target: 20 },
    { level: 7, target: 30 },
    { level: 8, target: 45 },
    { level: 9, target: 60 },
    { level: 10, target: 90 },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private firebase: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

  async ngOnInit() {
    this.route.data.subscribe((data) => {
      this.activePage = data['page'] || 'home';
      if (this.activePage === 'leaderboard') {
        this.loadLeaderboard();
      }
      this.cdr.detectChanges();
    });

    this.updateClock();
    this.clockInterval = setInterval(() => {
      this.updateClock();
      this.cdr.detectChanges();
    }, 1000);

    await new Promise<void>((resolve) => {
      this.firebase.onAuthChange(async (user) => {
        this.currentUser = user;
        if (user) {
          this.showWelcomePopup = false;
          await this.loadProfile(user.uid);
        } else {
          this.profileLoaded = true;
        }
        this.cdr.detectChanges();
        resolve();
      });
    });
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
    this.activePage = page as any;
    if (page === 'leaderboard') this.loadLeaderboard();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    const isFindKey =
      (event.ctrlKey || event.metaKey) && (event.key === 'f' || event.key === 'F');
    if (!isFindKey) return;
    event.preventDefault();
    if (this.adminPanelOpen) {
      this.closeAdmin();
    } else if (this.adminLoginOpen) {
      this.adminLoginOpen = false;
      this.adminPwInput = '';
      this.adminPwError = '';
    } else {
      this.adminLoginOpen = true;
      this.adminPwInput = '';
      this.adminPwError = '';
      setTimeout(() => {
        const input = document.getElementById('admin-pw-input') as HTMLInputElement;
        if (input) input.focus();
      }, 50);
    }
    this.cdr.detectChanges();
  }

  checkAdminPw() {
    if (this.adminPwInput === this.ADMIN_PW) {
      this.adminLoginOpen = false;
      this.adminPanelOpen = true;
      this.adminPwInput = '';
      this.adminPwError = '';
      this.adminCoinsInput = this.coins;
      this.loadAdminUsers();
    } else {
      this.adminPwError = '❌ Falsches Passwort';
      this.adminPwInput = '';
    }
    this.cdr.detectChanges();
  }

  closeAdmin() {
    this.adminPanelOpen = false;
    this.adminMsg = '';
    this.adminTargetUser = null;
    this.adminCleanupConfirm = false;
    this.cdr.detectChanges();
  }

  async loadAdminUsers() {
    this.adminUsersLoading = true;
    this.adminUsers = await this.firebase.listTopUsers(30);
    this.adminUsersLoading = false;
    this.cdr.detectChanges();
  }

  async adminSetOwnCoins() {
    if (!this.currentUser) return;
    const val = Math.max(0, Math.floor(this.adminCoinsInput));
    const result = await this.firebase.setUserCoinsAbsolute(this.currentUser.uid, val);
    if (result !== null) {
      this.coins = result;
      this.adminMsg = `✅ Eigene Münzen auf ${val} gesetzt`;
    } else {
      this.adminMsg = '❌ Fehler beim Setzen';
    }
    this.flashAdminMsg();
  }

  async adminAddOwnCoins(amount: number) {
    if (!this.currentUser) return;
    const newTotal = await this.firebase.addCoins(this.currentUser.uid, amount);
    if (newTotal !== null) {
      this.coins = newTotal;
      this.adminCoinsInput = newTotal;
      this.adminMsg = `✅ ${amount > 0 ? '+' : ''}${amount} Münzen`;
    } else {
      this.adminMsg = '❌ Fehler';
    }
    this.flashAdminMsg();
  }

  async adminUnlockAllItems() {
    if (!this.currentUser) return;
    const allBorders = this.avatarBorders.map((b) => b.id);
    const allGlows = this.avatarGlows.map((g) => g.id);
    const okB = await this.firebase.setUserOwnedItems(this.currentUser.uid, 'border', allBorders);
    const okG = await this.firebase.setUserOwnedItems(this.currentUser.uid, 'glow', allGlows);
    if (okB && okG) {
      this.ownedBorders = allBorders;
      this.ownedGlows = allGlows;
      this.adminMsg = '✅ Alle Items freigeschaltet';
    } else {
      this.adminMsg = '❌ Fehler beim Freischalten';
    }
    this.flashAdminMsg();
  }

  selectAdminUser(u: any) {
    this.adminTargetUser = u;
    this.adminTargetCoinsInput = u['coins'] ?? 0;
  }

  async adminGiveCoinsToTarget(amount: number) {
    if (!this.adminTargetUser) return;
    const newTotal = await this.firebase.addCoins(this.adminTargetUser.uid, amount);
    if (newTotal !== null) {
      this.adminTargetUser.coins = newTotal;
      this.adminTargetCoinsInput = newTotal;
      this.adminMsg = `✅ ${this.adminTargetUser.username}: ${amount > 0 ? '+' : ''}${amount} Münzen`;
      const idx = this.adminUsers.findIndex((u) => u.uid === this.adminTargetUser.uid);
      if (idx >= 0) this.adminUsers[idx].coins = newTotal;
    } else {
      this.adminMsg = '❌ Fehler';
    }
    this.flashAdminMsg();
  }

  async adminSetTargetCoins() {
    if (!this.adminTargetUser) return;
    const val = Math.max(0, Math.floor(this.adminTargetCoinsInput));
    const result = await this.firebase.setUserCoinsAbsolute(this.adminTargetUser.uid, val);
    if (result !== null) {
      this.adminTargetUser.coins = result;
      this.adminMsg = `✅ ${this.adminTargetUser.username} auf ${val} Münzen gesetzt`;
      const idx = this.adminUsers.findIndex((u) => u.uid === this.adminTargetUser.uid);
      if (idx >= 0) this.adminUsers[idx].coins = result;
    } else {
      this.adminMsg = '❌ Fehler';
    }
    this.flashAdminMsg();
  }

  async adminDeleteLeaderboard() {
    if (!this.adminCleanupConfirm) {
      this.adminCleanupConfirm = true;
      return;
    }
    const count = await this.firebase.deleteLeaderboardEntries(
      this.adminCleanupGame,
      Number(this.adminCleanupLevel),
    );
    this.adminMsg = `🗑 ${count} Einträge gelöscht (${this.adminCleanupGame} L${this.adminCleanupLevel})`;
    this.adminCleanupConfirm = false;
    this.flashAdminMsg();
  }

  private flashAdminMsg() {
    this.cdr.detectChanges();
    setTimeout(() => {
      this.adminMsg = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  async loadProfile(uid: string) {
    this.profile = await this.firebase.getUserProfile(uid);
    if (this.profile) {
      this.editUsername = this.profile['username'] || '';
      this.editBio = this.profile['bio'] || '';
      this.editAvatarBorder = this.profile['avatarBorder'] || 'border-blue';
      this.editAvatarGlow = this.profile['avatarGlow'] || '';
      this.editShowEmail = this.profile['showEmail'] || false;
      this.coins = this.profile['coins'] ?? 0;
      this.ownedBorders = this.profile['ownedBorders'] ?? ['border-blue'];
      this.ownedGlows = this.profile['ownedGlows'] ?? [''];
      this.ownedTitles = this.profile['ownedTitles'] ?? ['none'];
      if (!this.ownedTitles.includes('none')) this.ownedTitles = ['none', ...this.ownedTitles];
      this.selectedTitle = this.profile['selectedTitle'] ?? 'none';
      this.editSelectedTitle = this.selectedTitle;

      this.ownedUsernameStyles = this.profile['ownedUsernameStyles'] ?? ['default'];
      if (!this.ownedUsernameStyles.includes('default'))
        this.ownedUsernameStyles = ['default', ...this.ownedUsernameStyles];
      this.selectedUsernameStyle = this.profile['selectedUsernameStyle'] ?? 'default';
      this.editSelectedUsernameStyle = this.selectedUsernameStyle;
      const links = this.profile['links'] || [];
      this.editLinks = [
        links[0] || { label: '', url: '' },
        links[1] || { label: '', url: '' },
        links[2] || { label: '', url: '' },
      ];
    }
    this.profileLoaded = true;
    this.cdr.detectChanges();
  }

  async rewardCoins(amount: number, reason: string) {
    if (amount <= 0) return;
    this.coinRewardAmount = amount;
    this.coinRewardReason = reason;
    this.showCoinReward = true;
    if (this.currentUser) {
      const newTotal = await this.firebase.addCoins(this.currentUser.uid, amount);
      if (newTotal !== null) this.coins = newTotal;
    } else {
      this.coins += amount;
    }
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showCoinReward = false;
      this.cdr.detectChanges();
    }, 2200);
  }

  updateClock() {
    const now = new Date();
    this.currentTime = `${this.pad(now.getHours())}:${this.pad(now.getMinutes())}:${this.pad(now.getSeconds())}`;
  }

  // --- AUTH ---
  async login() {
    this.authError = '';
    this.authLoading = true;
    const { error } = await this.firebase.login(this.authEmail, this.authPassword);
    this.authLoading = false;
    if (error) this.authError = error;
    else {
      this.showWelcomePopup = false;
      this.showLoginForm = false;
    }
    this.cdr.detectChanges();
  }

  async register() {
    this.authError = '';
    this.authLoading = true;
    const { error } = await this.firebase.register(
      this.authEmail,
      this.authPassword,
      this.authUsername,
    );
    this.authLoading = false;
    if (error) this.authError = error;
    else {
      this.showWelcomePopup = false;
      this.showRegisterForm = false;
    }
    this.cdr.detectChanges();
  }

  async logout() {
    await this.firebase.logout();
    this.currentUser = null;
    this.profile = null;
    this.profileLoaded = false;
    this.showAccountPopup = false;
    this.showWelcomePopup = true;
    this.cdr.detectChanges();
  }

  playAsGuest() {
    this.showWelcomePopup = false;
  }
  openLogin() {
    this.showLoginForm = true;
    this.showRegisterForm = false;
    this.authError = '';
  }
  openRegister() {
    this.showRegisterForm = true;
    this.showLoginForm = false;
    this.authError = '';
  }
  closeAuth() {
    this.showLoginForm = false;
    this.showRegisterForm = false;
  }

  get isGamePage(): boolean {
    return (
      this.activePage === 'zeitgefuehl' ||
      this.activePage === 'reaktion' ||
      this.activePage === 'stopclock' ||
      this.activePage === 'bpm' ||
      this.activePage === 'blindcounter' ||
      this.activePage === 'sequence'
    );
  }

  get displayName(): string {
    return (
      this.profile?.['username'] ||
      this.currentUser?.displayName ||
      this.currentUser?.email?.split('@')[0] ||
      'Gast'
    );
  }

  get userInitials(): string {
    return this.displayName.slice(0, 2).toUpperCase();
  }
  get avatarUrl(): string {
    return this.profileLoaded ? this.profile?.['avatarUrl'] || '' : '';
  }
  get bannerUrl(): string {
    return this.profileLoaded ? this.profile?.['bannerUrl'] || '' : '';
  }
  get avatarBorderClass(): string {
    return this.profileLoaded ? this.profile?.['avatarBorder'] || 'border-blue' : 'border-blue';
  }
  get avatarGlowClass(): string {
    return this.profileLoaded ? this.profile?.['avatarGlow'] || '' : '';
  }

  // --- PROFILE SAVE ---
  async saveProfile() {
    if (!this.currentUser) return;
    this.profileSaving = true;
    this.profileSaveMsg = '';
    const error = await this.firebase.updateUserProfile(this.currentUser.uid, {
      username: this.editUsername,
      bio: this.editBio,
      avatarBorder: this.editAvatarBorder,
      avatarGlow: this.editAvatarGlow,
      showEmail: this.editShowEmail,
      links: this.editLinks.filter((l) => l.url.trim() !== ''),
      selectedTitle: this.editSelectedTitle,
      selectedUsernameStyle: this.editSelectedUsernameStyle,
    });
    if (!error) {
      this.selectedTitle = this.editSelectedTitle;
      this.selectedUsernameStyle = this.editSelectedUsernameStyle;
    }
    this.profileSaving = false;
    this.profileSaveMsg = error ? '❌ Fehler' : '✅ Gespeichert!';
    if (!error) await this.loadProfile(this.currentUser.uid);
    setTimeout(() => {
      this.profileSaveMsg = '';
      this.cdr.detectChanges();
    }, 2000);
    this.cdr.detectChanges();
  }

  async onAvatarFileChange(event: any) {
    const file = event.target.files[0];
    if (!file || !this.currentUser) return;
    this.avatarUploading = true;
    this.cdr.detectChanges();
    const url = await this.firebase.uploadAvatar(file);
    if (url) {
      await this.firebase.updateUserProfile(this.currentUser.uid, { avatarUrl: url });
      await this.loadProfile(this.currentUser.uid);
    }
    this.avatarUploading = false;
    this.cdr.detectChanges();
  }

  async onBannerFileChange(event: any) {
    const file = event.target.files[0];
    if (!file || !this.currentUser) return;
    this.bannerUploading = true;
    this.cdr.detectChanges();
    const url = await this.firebase.uploadBanner(file);
    if (url) {
      await this.firebase.updateUserProfile(this.currentUser.uid, { bannerUrl: url });
      await this.loadProfile(this.currentUser.uid);
    }
    this.bannerUploading = false;
    this.cdr.detectChanges();
  }

  // --- PROFILE SEARCH ---
  async searchUsers() {
    if (!this.searchQuery.trim()) return;
    this.searchLoading = true;
    this.searchResults = await this.firebase.searchUserByUsername(this.searchQuery.trim());
    this.searchLoading = false;
    this.cdr.detectChanges();
  }

  async viewProfile(user: any) {
    this.viewingProfile = user;
    this.showProfilePopup = true;
    this.cdr.detectChanges();
  }

  getInitials(name: string): string {
    return (name || '?').slice(0, 2).toUpperCase();
  }

  formatBio(bio: string): SafeHtml {
    if (!bio) return this.sanitizer.bypassSecurityTrustHtml('');
    const linked = bio.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" style="color:#4a9eff;text-decoration:underline;cursor:pointer;">$1</a>',
    );
    return this.sanitizer.bypassSecurityTrustHtml(linked);
  }

  openLink(url: string) {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : 'https://' + url;
    window.open(fullUrl, '_blank');
  }

  // --- LEADERBOARD ---
  async loadLeaderboard(game?: string, level?: number) {
    if (game !== undefined) this.leaderboardGame = game;
    if (level !== undefined) this.leaderboardLevel = level;
    this.leaderboardLoading = true;
    this.leaderboardData = await this.firebase.getLeaderboard(
      this.leaderboardGame,
      this.leaderboardLevel,
    );
    this.leaderboardLoading = false;
    this.cdr.detectChanges();
  }

  selectLeaderboardGame(gameId: string) {
    this.leaderboardGame = gameId;
    const def = this.leaderboardGames.find((g) => g.id === gameId);
    this.leaderboardLevel = def ? def.levels[0].level : 0;
    this.loadLeaderboard();
  }

  get leaderboardGameDef() {
    return this.leaderboardGames.find((g) => g.id === this.leaderboardGame);
  }

  formatScore(diff: number): string {
    switch (this.leaderboardGame) {
      case 'zeitgefuehl':
      case 'blindcounter':
        return '±' + diff.toFixed(2) + 's';
      case 'reaktion':
        return diff.toFixed(0) + ' ms';
      case 'stopclock':
        return '±' + (diff / 1000).toFixed(3) + 's';
      case 'bpm':
        return 'Ø ' + diff.toFixed(0) + ' ms';
      case 'sequence':
        return -diff + ' Runden';
      default:
        return diff.toString();
    }
  }

  // --- STOPWATCH ---
  swStart() {
    if (this.swRunning) return;
    this.swRunning = true;
    const startTime = Date.now() - this.swElapsed;
    this.swInterval = setInterval(() => {
      this.swElapsed = Date.now() - startTime;
      this.cdr.detectChanges();
    }, 10);
  }

  swPause() {
    this.swRunning = false;
    clearInterval(this.swInterval);
  }
  swReset() {
    this.swPause();
    this.swElapsed = 0;
  }

  get swFormatted(): string {
    const ms = this.swElapsed;
    return `${this.pad(Math.floor(ms / 60000))}:${this.pad(Math.floor((ms % 60000) / 1000))}.${this.pad(Math.floor((ms % 1000) / 10))}`;
  }

  // --- COUNTDOWN ---
  cdStart() {
    if (this.cdRunning || this.cdRemaining <= 0) return;
    this.cdFinished = false;
    this.cdRunning = true;
    this.cdInterval = setInterval(() => {
      this.cdRemaining--;
      this.cdr.detectChanges();
      if (this.cdRemaining <= 0) {
        this.cdRemaining = 0;
        this.cdRunning = false;
        this.cdFinished = true;
        clearInterval(this.cdInterval);
      }
    }, 1000);
  }

  cdPause() {
    this.cdRunning = false;
    clearInterval(this.cdInterval);
  }
  cdReset() {
    this.cdPause();
    this.cdFinished = false;
    this.cdRemaining = this.cdInput;
  }

  onInputChange(value: string) {
    this.cdInput = parseInt(value) || 0;
    this.cdRemaining = this.cdInput;
    this.cdFinished = false;
  }

  get cdFormatted(): string {
    return `${this.pad(Math.floor(this.cdRemaining / 60))}:${this.pad(this.cdRemaining % 60)}`;
  }

  // --- ZEITGEFÜHL ---
  zgSelectLevel(l: { level: number; target: number }) {
    this.zgLevel = l.level;
    this.zgTargetSeconds = l.target;
    this.zgElapsed = 0;
    this.zgPhase = 'playing';
    const start = Date.now();
    this.zgInterval = setInterval(() => {
      this.zgElapsed = (Date.now() - start) / 1000;
      this.cdr.detectChanges();
    }, 50);
  }

  async zgStop() {
    clearInterval(this.zgInterval);
    this.zgStoppedAt = this.zgElapsed;
    this.zgDiff = Math.abs(this.zgStoppedAt - this.zgTargetSeconds);

    if (
      this.zgBestScores[this.zgLevel] === undefined ||
      this.zgDiff < this.zgBestScores[this.zgLevel]
    ) {
      this.zgBestScores[this.zgLevel] = this.zgDiff;
    }

    if (this.currentUser) {
      await this.firebase.submitScore(
        this.currentUser.uid,
        this.displayName,
        'zeitgefuehl',
        this.zgLevel,
        this.zgDiff,
      );
    }

    let coinReward = 0;
    if (this.zgDiff < 0.2) {
      this.zgResultIcon = '🏆';
      this.zgResultText = 'Perfekt!';
      coinReward = 30 + this.zgLevel * 3;
    } else if (this.zgDiff < 0.5) {
      this.zgResultIcon = '🥇';
      this.zgResultText = 'Ausgezeichnet!';
      coinReward = 20 + this.zgLevel * 2;
    } else if (this.zgDiff < 1.0) {
      this.zgResultIcon = '🥈';
      this.zgResultText = 'Sehr gut!';
      coinReward = 12 + this.zgLevel;
    } else if (this.zgDiff < 2.0) {
      this.zgResultIcon = '🥉';
      this.zgResultText = 'Gut gemacht!';
      coinReward = 6 + Math.floor(this.zgLevel / 2);
    } else if (this.zgDiff < 4.0) {
      this.zgResultIcon = '😅';
      this.zgResultText = 'Knapp daneben!';
      coinReward = 3;
    } else {
      this.zgResultIcon = '😬';
      this.zgResultText = 'Üb noch etwas!';
      coinReward = 1;
    }

    this.zgPhase = 'result';
    await this.rewardCoins(coinReward, `Zeitgefühl Level ${this.zgLevel}`);
  }

  zgReplay() {
    this.zgElapsed = 0;
    this.zgPhase = 'playing';
    const start = Date.now();
    this.zgInterval = setInterval(() => {
      this.zgElapsed = (Date.now() - start) / 1000;
      this.cdr.detectChanges();
    }, 50);
  }

  get zgElapsedFormatted(): string {
    return this.zgElapsed.toFixed(2) + 's';
  }
  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  // --- REAKTIONSTEST ---
  rtStart() {
    clearTimeout(this.rtTimeoutId);
    this.rtPhase = 'waiting';
    this.rtReactionMs = 0;
    const delay = 1500 + Math.random() * 4500;
    this.rtTimeoutId = setTimeout(() => {
      this.rtPhase = 'go';
      this.rtStartTimestamp = Date.now();
      this.cdr.detectChanges();
    }, delay);
  }

  async rtClick() {
    if (this.rtPhase === 'waiting') {
      clearTimeout(this.rtTimeoutId);
      this.rtPhase = 'foul';
      return;
    }
    if (this.rtPhase === 'go') {
      this.rtReactionMs = Date.now() - this.rtStartTimestamp;
      this.rtPhase = 'result';
      if (this.rtBest === 0 || this.rtReactionMs < this.rtBest) this.rtBest = this.rtReactionMs;
      let reward = 5;
      if (this.rtReactionMs < 180) reward = 50;
      else if (this.rtReactionMs < 250) reward = 30;
      else if (this.rtReactionMs < 350) reward = 15;
      else if (this.rtReactionMs < 500) reward = 8;
      if (this.currentUser) {
        await this.firebase.submitScore(
          this.currentUser.uid,
          this.displayName,
          'reaktion',
          0,
          this.rtReactionMs,
        );
      }
      await this.rewardCoins(reward, 'Reaktionstest');
    } else if (this.rtPhase === 'idle' || this.rtPhase === 'result' || this.rtPhase === 'foul') {
      this.rtStart();
    }
  }

  rtReset() {
    clearTimeout(this.rtTimeoutId);
    this.rtPhase = 'idle';
  }

  // --- STOP THE CLOCK ---
  scSelectLevel(l: { level: number; target: number; hideAfter: number }) {
    this.scLevel = l.level;
    this.scTargetMs = l.target;
    this.scElapsedMs = 0;
    this.scShowDisplay = true;
    this.scPhase = 'playing';
    const start = Date.now();
    this.scInterval = setInterval(() => {
      this.scElapsedMs = Date.now() - start;
      this.cdr.detectChanges();
    }, 10);
    if (l.hideAfter > 0) {
      setTimeout(() => {
        this.scShowDisplay = false;
        this.cdr.detectChanges();
      }, l.hideAfter);
    }
  }

  async scStop() {
    clearInterval(this.scInterval);
    this.scStoppedAtMs = this.scElapsedMs;
    this.scDiffMs = Math.abs(this.scStoppedAtMs - this.scTargetMs);
    this.scPhase = 'result';
    let reward = 3;
    if (this.scDiffMs < 50) reward = 50 + this.scLevel * 5;
    else if (this.scDiffMs < 150) reward = 30 + this.scLevel * 3;
    else if (this.scDiffMs < 400) reward = 15 + this.scLevel;
    else if (this.scDiffMs < 1000) reward = 8;
    if (this.currentUser) {
      await this.firebase.submitScore(
        this.currentUser.uid,
        this.displayName,
        'stopclock',
        this.scLevel,
        this.scDiffMs,
      );
    }
    await this.rewardCoins(reward, `Stop the Clock L${this.scLevel}`);
  }

  scReset() {
    clearInterval(this.scInterval);
    this.scPhase = 'select';
    this.scShowDisplay = true;
  }

  get scElapsedFormatted(): string {
    return (this.scElapsedMs / 1000).toFixed(2) + 's';
  }
  get scTargetFormatted(): string {
    return (this.scTargetMs / 1000).toFixed(2) + 's';
  }
  get scStoppedFormatted(): string {
    return (this.scStoppedAtMs / 1000).toFixed(2) + 's';
  }
  get scDiffFormatted(): string {
    return (this.scDiffMs / 1000).toFixed(3) + 's';
  }

  // --- BPM TAP ---
  bpmSelect(bpm: number) {
    this.bpmTarget = bpm;
    this.bpmTapTimes = [];
    this.bpmDemoIndex = 0;
    this.bpmPhase = 'demo';
    const intervalMs = 60000 / bpm;
    this.bpmShowBeat = true;
    this.cdr.detectChanges();
    this.bpmDemoInterval = setInterval(() => {
      this.bpmDemoIndex++;
      this.bpmShowBeat = !this.bpmShowBeat;
      this.cdr.detectChanges();
      if (this.bpmDemoIndex >= this.bpmDemoCount * 2) {
        clearInterval(this.bpmDemoInterval);
        this.bpmPhase = 'tap';
        this.bpmShowBeat = false;
        this.cdr.detectChanges();
      }
    }, intervalMs / 2);
  }

  async bpmTap() {
    if (this.bpmPhase !== 'tap') return;
    this.bpmTapTimes.push(Date.now());
    this.bpmShowBeat = true;
    setTimeout(() => {
      this.bpmShowBeat = false;
      this.cdr.detectChanges();
    }, 80);
    if (this.bpmTapTimes.length >= this.bpmTapsNeeded) {
      await this.bpmFinish();
    }
  }

  async bpmFinish() {
    const targetInterval = 60000 / this.bpmTarget;
    const diffs: number[] = [];
    for (let i = 1; i < this.bpmTapTimes.length; i++) {
      const actual = this.bpmTapTimes[i] - this.bpmTapTimes[i - 1];
      diffs.push(Math.abs(actual - targetInterval));
    }
    this.bpmAvgDiffMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    this.bpmPhase = 'result';
    let reward = 3;
    if (this.bpmAvgDiffMs < 25) reward = 50;
    else if (this.bpmAvgDiffMs < 50) reward = 30;
    else if (this.bpmAvgDiffMs < 100) reward = 15;
    else if (this.bpmAvgDiffMs < 200) reward = 8;
    if (this.currentUser) {
      await this.firebase.submitScore(
        this.currentUser.uid,
        this.displayName,
        'bpm',
        this.bpmTarget,
        this.bpmAvgDiffMs,
      );
    }
    await this.rewardCoins(reward, `BPM Tap ${this.bpmTarget}`);
  }

  bpmReset() {
    clearInterval(this.bpmDemoInterval);
    this.bpmPhase = 'select';
    this.bpmTapTimes = [];
    this.bpmShowBeat = false;
  }

  // --- BLIND COUNTER ---
  bcSelectTarget(seconds: number) {
    this.bcTarget = seconds;
    this.bcPhase = 'idle';
    this.bcStoppedAt = 0;
    this.bcDiff = 0;
  }

  bcStart_() {
    this.bcStart = Date.now();
    this.bcPhase = 'counting';
  }

  async bcStop() {
    this.bcStoppedAt = (Date.now() - this.bcStart) / 1000;
    this.bcDiff = Math.abs(this.bcStoppedAt - this.bcTarget);
    this.bcPhase = 'result';
    const scaleFactor = this.bcTarget / 60;
    let reward = 3;
    if (this.bcDiff < 0.3 * scaleFactor) reward = 60;
    else if (this.bcDiff < 1 * scaleFactor) reward = 35;
    else if (this.bcDiff < 3 * scaleFactor) reward = 18;
    else if (this.bcDiff < 6 * scaleFactor) reward = 8;
    const bonusForLonger = Math.round((this.bcTarget / 60) * reward * 0.3);
    reward += bonusForLonger;
    if (this.currentUser) {
      await this.firebase.submitScore(
        this.currentUser.uid,
        this.displayName,
        'blindcounter',
        this.bcTarget,
        this.bcDiff,
      );
    }
    await this.rewardCoins(reward, `Blind Counter ${this.bcTarget}s`);
  }

  bcReset() {
    this.bcPhase = 'select';
    this.bcStart = 0;
    this.bcStoppedAt = 0;
    this.bcDiff = 0;
  }

  get bcStoppedFormatted(): string {
    return this.bcStoppedAt.toFixed(2) + 's';
  }
  get bcDiffFormatted(): string {
    return this.bcDiff.toFixed(2) + 's';
  }

  // --- SEQUENCE MEMORY ---
  seqStart() {
    this.seqRound = 0;
    this.seqSequence = [];
    this.seqUserInput = [];
    this.seqNextRound();
  }

  seqNextRound() {
    this.seqRound++;
    this.seqSequence.push(Math.floor(Math.random() * 4));
    this.seqUserInput = [];
    this.seqPhase = 'showing';
    this.seqPlaySequence();
  }

  seqPlaySequence() {
    let i = 0;
    const showNext = () => {
      if (i >= this.seqSequence.length) {
        this.seqHighlight = -1;
        this.seqPhase = 'input';
        this.cdr.detectChanges();
        return;
      }
      this.seqHighlight = this.seqSequence[i];
      this.cdr.detectChanges();
      this.seqShowTimer = setTimeout(() => {
        this.seqHighlight = -1;
        this.cdr.detectChanges();
        this.seqShowTimer = setTimeout(() => {
          i++;
          showNext();
        }, 200);
      }, 500);
    };
    showNext();
  }

  async seqInput(idx: number) {
    if (this.seqPhase !== 'input') return;
    this.seqHighlight = idx;
    setTimeout(() => {
      this.seqHighlight = -1;
      this.cdr.detectChanges();
    }, 200);
    this.seqUserInput.push(idx);
    const pos = this.seqUserInput.length - 1;
    if (this.seqUserInput[pos] !== this.seqSequence[pos]) {
      this.seqPhase = 'fail';
      const completedRounds = this.seqRound - 1;
      const reward = Math.max(1, completedRounds * 8);
      if (this.currentUser && completedRounds > 0) {
        await this.firebase.submitScore(
          this.currentUser.uid,
          this.displayName,
          'sequence',
          0,
          -completedRounds,
        );
      }
      await this.rewardCoins(reward, `Sequence Round ${completedRounds}`);
      return;
    }
    if (this.seqUserInput.length === this.seqSequence.length) {
      this.seqPhase = 'success';
      this.cdr.detectChanges();
      setTimeout(() => this.seqNextRound(), 800);
    }
  }

  seqReset() {
    clearTimeout(this.seqShowTimer);
    this.seqPhase = 'idle';
    this.seqSequence = [];
    this.seqUserInput = [];
    this.seqRound = 0;
    this.seqHighlight = -1;
  }

  // --- SHOP ---
  isOwnedBorder(id: string): boolean {
    return this.ownedBorders.includes(id);
  }
  isOwnedGlow(id: string): boolean {
    return this.ownedGlows.includes(id);
  }
  canAfford(price: number): boolean {
    return this.coins >= price;
  }

  async buyBorder(item: { id: string; label: string; price: number }) {
    if (!this.currentUser || this.purchasing) return;
    if (this.isOwnedBorder(item.id)) return;
    if (!this.canAfford(item.price)) {
      this.purchaseMsg = `❌ Du brauchst ${item.price - this.coins} mehr Münzen`;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.purchaseMsg = '';
        this.cdr.detectChanges();
      }, 2500);
      return;
    }
    this.purchasing = true;
    const res = await this.firebase.purchaseItem(
      this.currentUser.uid,
      'border',
      item.id,
      item.price,
    );
    this.purchasing = false;
    if (res.success) {
      this.coins = res.newCoins ?? this.coins;
      this.ownedBorders = [...this.ownedBorders, item.id];
      this.purchaseMsg = `✅ ${item.label}-Rahmen gekauft!`;
    } else {
      this.purchaseMsg = `❌ ${res.error}`;
    }
    this.cdr.detectChanges();
    setTimeout(() => {
      this.purchaseMsg = '';
      this.cdr.detectChanges();
    }, 2500);
  }

  async buyGlow(item: { id: string; label: string; price: number }) {
    if (!this.currentUser || this.purchasing) return;
    if (this.isOwnedGlow(item.id)) return;
    if (!this.canAfford(item.price)) {
      this.purchaseMsg = `❌ Du brauchst ${item.price - this.coins} mehr Münzen`;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.purchaseMsg = '';
        this.cdr.detectChanges();
      }, 2500);
      return;
    }
    this.purchasing = true;
    const res = await this.firebase.purchaseItem(this.currentUser.uid, 'glow', item.id, item.price);
    this.purchasing = false;
    if (res.success) {
      this.coins = res.newCoins ?? this.coins;
      this.ownedGlows = [...this.ownedGlows, item.id];
      this.purchaseMsg = `✅ ${item.label}-Glow gekauft!`;
    } else {
      this.purchaseMsg = `❌ ${res.error}`;
    }
    this.cdr.detectChanges();
    setTimeout(() => {
      this.purchaseMsg = '';
      this.cdr.detectChanges();
    }, 2500);
  }

  get shopableTitles() {
    return this.availableTitles.filter((t) => t.id !== 'none');
  }

  get shopableUsernameStyles() {
    return this.availableUsernameStyles.filter((s) => s.id !== 'default');
  }

  // --- TITEL ---
  isOwnedTitle(id: string): boolean {
    return this.ownedTitles.includes(id);
  }

  getTitle(id: string) {
    return this.availableTitles.find((t) => t.id === id);
  }

  getTitleLabel(id: string | undefined | null): string {
    if (!id || id === 'none') return '';
    return this.getTitle(id)?.label || '';
  }

  getTitleTier(id: string | undefined | null): string {
    if (!id || id === 'none') return 'none';
    return this.getTitle(id)?.tier || 'none';
  }

  async buyTitle(item: { id: string; label: string; price: number; tier: string }) {
    if (!this.currentUser || this.purchasing) return;
    if (this.ownedTitles.includes(item.id)) return;
    if (!this.canAfford(item.price)) {
      this.flashPurchaseMsg(`❌ Du brauchst ${item.price - this.coins} mehr Münzen`);
      return;
    }
    this.purchasing = true;
    const res = await this.firebase.purchaseItem(this.currentUser.uid, 'title', item.id, item.price);
    this.purchasing = false;
    if (res.success) {
      this.coins = res.newCoins ?? this.coins;
      this.ownedTitles = [...this.ownedTitles, item.id];
      this.flashPurchaseMsg(`✅ Titel "${item.label}" gekauft!`);
    } else {
      this.flashPurchaseMsg(`❌ ${res.error}`);
    }
  }

  // --- USERNAME STYLE ---
  isOwnedUsernameStyle(id: string): boolean {
    return this.ownedUsernameStyles.includes(id);
  }

  getUsernameStyle(id: string) {
    return this.availableUsernameStyles.find((s) => s.id === id);
  }

  usernameStyleClass(id: string | undefined | null): string {
    if (!id || id === 'default') return '';
    return 'uname-' + id;
  }

  async buyUsernameStyle(item: { id: string; label: string; price: number }) {
    if (!this.currentUser || this.purchasing) return;
    if (this.ownedUsernameStyles.includes(item.id)) return;
    if (!this.canAfford(item.price)) {
      this.flashPurchaseMsg(`❌ Du brauchst ${item.price - this.coins} mehr Münzen`);
      return;
    }
    this.purchasing = true;
    const res = await this.firebase.purchaseItem(
      this.currentUser.uid,
      'usernameStyle',
      item.id,
      item.price,
    );
    this.purchasing = false;
    if (res.success) {
      this.coins = res.newCoins ?? this.coins;
      this.ownedUsernameStyles = [...this.ownedUsernameStyles, item.id];
      this.flashPurchaseMsg(`✅ Style "${item.label}" gekauft!`);
    } else {
      this.flashPurchaseMsg(`❌ ${res.error}`);
    }
  }

  private flashPurchaseMsg(msg: string) {
    this.purchaseMsg = msg;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.purchaseMsg = '';
      this.cdr.detectChanges();
    }, 2500);
  }

  ngOnDestroy() {
    clearInterval(this.swInterval);
    clearInterval(this.cdInterval);
    clearInterval(this.clockInterval);
    clearInterval(this.zgInterval);
    clearInterval(this.scInterval);
    clearInterval(this.bpmDemoInterval);
    clearTimeout(this.rtTimeoutId);
    clearTimeout(this.seqShowTimer);
  }
}
