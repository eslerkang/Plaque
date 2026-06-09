export type Locale = "ko" | "en";
export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_COOKIE = "plaque_locale";

// ── Translation dictionary ────────────────────────────────────────────────────
export const translations = {
  ko: {
    // ── App ─────────────────────────────────────────────────────────────────
    "app.name": "Plaque",
    "app.tagline": "나만의 미술관 스크랩북",

    // ── BottomNav ────────────────────────────────────────────────────────────
    "nav.scrapbook": "스크랩북",
    "nav.add": "추가",
    "nav.search": "검색",
    "nav.settings": "설정",

    // ── Landing ──────────────────────────────────────────────────────────────
    "landing.headline": "Plaque",
    "landing.subline": "나만의 미술관 스크랩북",
    "landing.body1": "전시장에서 마주친 작품을 사진으로 기록하고,\n감상과 평점을 남겨두세요.",
    "landing.body2": "나중에 언제든 꺼내볼 수 있는\n나만의 미술관 아카이브.",
    "landing.cta": "시작하기",
    "landing.feature.photo": "사진 기록",
    "landing.feature.memo": "감상 메모",
    "landing.feature.archive": "나만의 아카이브",

    // ── Login ────────────────────────────────────────────────────────────────
    "login.title": "Plaque",
    "login.subtitle": "나만의 미술관",
    "login.google": "Google로 계속하기",
    "login.loading": "로그인 중...",
    "login.error": "로그인 오류가 발생했습니다. 다시 시도해 주세요.",

    // ── Consent ──────────────────────────────────────────────────────────────
    "consent.title": "서비스 이용 동의",
    "consent.description": "Plaque를 이용하기 위해 아래 약관에 동의해 주세요. 개인 미술 아카이브 서비스로, 기록하신 사진 및 정보는 개인 사용 목적에 한하여 보관됩니다.",
    "consent.terms": "이용약관에 동의합니다. (필수)",
    "consent.privacy": "개인정보처리방침에 동의합니다. (필수)",
    "consent.agreePrefix": "",
    "consent.agreeSuffix": "에 동의합니다. (필수)",
    "consent.submit": "동의하고 시작하기",
    "consent.submitting": "처리 중...",
    "consent.required": "두 항목 모두 동의해야 서비스를 이용할 수 있습니다.",
    "consent.error": "처리 중 오류가 발생했습니다. 다시 시도해 주세요.",

    // ── Scrapbook ────────────────────────────────────────────────────────────
    "scrapbook.title": "Plaque",
    "scrapbook.addArtwork": "작품 추가",
    "scrapbook.count": "{n}점의 작품",
    "scrapbook.empty.headline": "첫 작품을 기록해보세요.",
    "scrapbook.empty.body": "전시장에서 만난 작품을 사진으로 남기고\n나만의 미술관을 만들어보세요.",
    "scrapbook.empty.cta": "작품 추가하기",
    "scrapbook.error": "작품을 불러오는 중 오류가 발생했습니다.",
    "scrapbook.sort.newest": "최신순",
    "scrapbook.sort.visitDate": "방문일순",
    "scrapbook.sort.rating": "평점순",
    "scrapbook.view.grid": "그리드",
    "scrapbook.view.timeline": "타임라인",

    // ── Timeline ─────────────────────────────────────────────────────────────
    "timeline.undated": "날짜 미등록",
    "timeline.artworkCount": "작품 {n}점",

    // ── Artwork detail ───────────────────────────────────────────────────────
    "detail.back": "뒤로",
    "detail.edit": "편집",
    "detail.year": "제작 연도",
    "detail.medium": "재료/기법",
    "detail.location": "장소",
    "detail.exhibition": "전시",
    "detail.visitDate": "방문일",
    "detail.showOriginal": "원본 이미지 보기 ↓",
    "detail.hideOriginal": "원본 이미지 접기 ↑",
    "detail.aiSection": "더 알아보기 (준비 중)",
    "detail.delete": "삭제",
    "detail.deleteTitle": "작품 삭제",
    "detail.deleteBody": "이 작품 기록을 삭제할까요? 삭제 후에는 복구할 수 없어요.",
    "detail.deleteConfirm": "삭제",
    "detail.deleteError": "삭제 중 오류가 발생했습니다. 다시 시도해 주세요.",

    // ── Add artwork ──────────────────────────────────────────────────────────
    "add.step.upload": "사진 선택",
    "add.step.review": "이미지 검토",
    "add.step.metadata": "작품 정보",
    "add.upload.title": "사진을 선택하세요",
    "add.upload.subtitle": "카메라로 찍거나 갤러리에서 가져오기",
    "add.upload.gallery": "갤러리",
    "add.upload.camera": "카메라",
    "add.upload.error": "이미지 파일만 업로드할 수 있어요.",
    "add.review.analyzing": "이미지 분석 중...",
    "add.review.skipBtn": "원본으로 바로 계속하기",
    "add.review.original": "원본 이미지",
    "add.review.cleaned": "보정된 이미지",
    "add.review.recommended": "권장",
    "add.review.noCorrection": "작품 경계를 자동으로 찾지 못했어요. 원본 이미지를 사용할게요.",
    "add.review.next": "다음",
    "add.metadata.originalSelected": "원본 이미지 선택됨",
    "add.metadata.cleanedSelected": "보정된 이미지 선택됨",
    "add.metadata.changeImage": "변경하기",
    "add.metadata.prev": "이전",
    "add.metadata.save": "스크랩북에 저장",
    "add.metadata.saving": "저장 중...",
    "add.metadata.error": "저장 중 오류가 발생했습니다. 다시 시도해 주세요.",

    // ── Edit artwork ─────────────────────────────────────────────────────────
    "edit.title": "작품 편집",
    "edit.original": "원본",
    "edit.cleaned": "보정본",
    "edit.cancel": "취소",
    "edit.save": "저장",
    "edit.saving": "저장 중...",
    "edit.error": "저장 중 오류가 발생했습니다.",

    // ── Form fields ──────────────────────────────────────────────────────────
    "field.title": "작품 제목",
    "field.title.required": "작품 제목 *",
    "field.title.placeholder": "예: 별이 빛나는 밤",
    "field.title.error": "작품 제목은 필수입니다.",
    "field.artist": "작가",
    "field.artist.placeholder": "예: 빈센트 반 고흐",
    "field.year": "제작 연도",
    "field.year.placeholder": "예: 1889",
    "field.medium": "재료 / 기법",
    "field.medium.placeholder": "예: 유화",
    "field.gallery": "미술관 / 갤러리",
    "field.gallery.placeholder": "예: 뉴욕 현대미술관 (MoMA)",
    "field.exhibition": "전시명",
    "field.exhibition.placeholder": "예: 반 고흐: 별을 향한 여정",
    "field.visitDate": "방문 날짜",
    "field.rating": "평점",
    "field.note": "감상 메모",
    "field.note.placeholder": "이 작품에 대한 생각이나 느낌을 자유롭게 적어보세요...",
    "field.tags": "태그",
    "field.tags.placeholder": "예: 인상주의, 풍경화",

    // ── Search ───────────────────────────────────────────────────────────────
    "search.placeholder": "작품, 작가, 갤러리 검색...",
    "search.filter": "필터",
    "search.filter.rating": "평점",
    "search.filter.tag": "태그",
    "search.filter.clear": "필터 초기화",
    "search.results": "{n}개의 결과",
    "search.total": "{n}점의 작품",
    "search.empty": "검색 결과가 없어요.",
    "search.emptyFiltered": "필터 조건에 맞는 작품이 없어요.",

    // ── Settings ─────────────────────────────────────────────────────────────
    "settings.title": "설정",
    "settings.profile": "프로필",
    "settings.email": "이메일",
    "settings.displayName": "표시 이름",
    "settings.displayName.placeholder": "표시 이름을 입력하세요",
    "settings.save": "저장",
    "settings.saved": "저장되었습니다 ✓",
    "settings.saving": "저장 중...",
    "settings.error": "저장 중 오류가 발생했습니다.",
    "settings.archive": "나의 아카이브",
    "settings.artworks": "기록한 작품",
    "settings.galleries": "방문한 갤러리",
    "settings.appInfo": "앱 정보",
    "settings.version": "버전",
    "settings.appName": "이름",
    "settings.export": "내보내기",
    "settings.exportPdf": "컬렉션 PDF로 저장",
    "settings.exportPdfDesc": "모든 작품을 미술관 카탈로그 형식으로 내보냅니다",
    "settings.language": "언어",
    "settings.legal": "약관 · 정책",
    "settings.terms": "이용약관",
    "settings.privacy": "개인정보처리방침",
    "settings.signOut": "로그아웃",
    "settings.signingOut": "로그아웃 중...",

    // ── Export ───────────────────────────────────────────────────────────────
    "export.back": "스크랩북",
    "export.print": "PDF로 저장",
    "export.subtitle": "Personal Archive",
    "export.headline": "나만의 미술관 컬렉션",
    "export.total": "총 {n}점의 작품",
    "export.footer": "Plaque — 나만의 미술관",

    // ── Onboarding ───────────────────────────────────────────────────────────
    "onboarding.title": "Plaque에 오신 걸 환영해요",
    "onboarding.subtitle": "나만의 미술관 아카이브를 시작해볼게요.",
    "onboarding.feature1.title": "사진으로 기록",
    "onboarding.feature1.body": "전시장에서 만난 작품을 카메라로 담아요.",
    "onboarding.feature2.title": "메모와 평점",
    "onboarding.feature2.body": "감상, 날짜, 갤러리 정보를 함께 남겨요.",
    "onboarding.feature3.title": "나만의 컬렉션",
    "onboarding.feature3.body": "태그와 검색으로 언제든 꺼내볼 수 있어요.",
    "onboarding.cta": "첫 작품 기록하기",
    "onboarding.dismiss": "둘러보기",

    // ── AI placeholder ───────────────────────────────────────────────────────
    "ai.section": "더 알아보기 (준비 중)",
    "ai.explain": "AI 해설 보기",
    "ai.context": "작품의 앞뒤 이야기",
    "ai.similar": "비슷한 작품 추천",
    "ai.taste": "내 취향 분석",

    // ── Not found / Error ────────────────────────────────────────────────────
    "error.404.heading": "페이지를 찾을 수 없어요",
    "error.404.body": "링크가 잘못되었거나 이미 삭제된 페이지입니다.",
    "error.404.cta": "스크랩북으로 돌아가기",
    "error.general.heading": "문제가 발생했어요",
    "error.general.body": "일시적인 오류입니다. 잠시 후 다시 시도해 주세요.",
    "error.retry": "다시 시도",
    "error.home": "홈으로",

    // ── Common ───────────────────────────────────────────────────────────────
    "common.cancel": "취소",
    "common.confirm": "확인",
    "common.back": "뒤로",
    "common.loading": "로딩 중...",
  },

  en: {
    // ── App ─────────────────────────────────────────────────────────────────
    "app.name": "Plaque",
    "app.tagline": "Your Personal Museum Archive",

    // ── BottomNav ────────────────────────────────────────────────────────────
    "nav.scrapbook": "Archive",
    "nav.add": "Add",
    "nav.search": "Search",
    "nav.settings": "Settings",

    // ── Landing ──────────────────────────────────────────────────────────────
    "landing.headline": "Plaque",
    "landing.subline": "Your Personal Museum Archive",
    "landing.body1": "Photograph artworks you discover at exhibitions\nand keep your impressions alongside them.",
    "landing.body2": "A personal museum catalog\nyou can revisit any time.",
    "landing.cta": "Get started",
    "landing.feature.photo": "Photo Log",
    "landing.feature.memo": "Personal Notes",
    "landing.feature.archive": "Your Archive",

    // ── Login ────────────────────────────────────────────────────────────────
    "login.title": "Plaque",
    "login.subtitle": "Your Personal Museum",
    "login.google": "Continue with Google",
    "login.loading": "Signing in...",
    "login.error": "Sign-in error. Please try again.",

    // ── Consent ──────────────────────────────────────────────────────────────
    "consent.title": "Terms Agreement",
    "consent.description": "Please agree to the following terms to use Plaque. Your photos and notes are stored for personal use only.",
    "consent.terms": "I agree to the Terms of Service (required)",
    "consent.privacy": "I agree to the Privacy Policy (required)",
    "consent.agreePrefix": "I agree to the ",
    "consent.agreeSuffix": " (required)",
    "consent.submit": "Agree and Continue",
    "consent.submitting": "Processing...",
    "consent.required": "You must agree to both items to use the service.",
    "consent.error": "Something went wrong. Please try again.",

    // ── Scrapbook ────────────────────────────────────────────────────────────
    "scrapbook.title": "Plaque",
    "scrapbook.addArtwork": "Add artwork",
    "scrapbook.count": "{n} works",
    "scrapbook.empty.headline": "Record your first artwork.",
    "scrapbook.empty.body": "Photograph works you see at exhibitions\nand build your personal museum.",
    "scrapbook.empty.cta": "Add artwork",
    "scrapbook.error": "Failed to load artworks.",
    "scrapbook.sort.newest": "Newest",
    "scrapbook.sort.visitDate": "Visit date",
    "scrapbook.sort.rating": "Rating",
    "scrapbook.view.grid": "Grid",
    "scrapbook.view.timeline": "Timeline",

    // ── Timeline ─────────────────────────────────────────────────────────────
    "timeline.undated": "No date",
    "timeline.artworkCount": "{n} works",

    // ── Artwork detail ───────────────────────────────────────────────────────
    "detail.back": "Back",
    "detail.edit": "Edit",
    "detail.year": "Year",
    "detail.medium": "Medium",
    "detail.location": "Location",
    "detail.exhibition": "Exhibition",
    "detail.visitDate": "Visited",
    "detail.showOriginal": "Show original ↓",
    "detail.hideOriginal": "Hide original ↑",
    "detail.aiSection": "Explore further (coming soon)",
    "detail.delete": "Delete",
    "detail.deleteTitle": "Delete artwork",
    "detail.deleteBody": "Delete this record? This cannot be undone.",
    "detail.deleteConfirm": "Delete",
    "detail.deleteError": "Delete failed. Please try again.",

    // ── Add artwork ──────────────────────────────────────────────────────────
    "add.step.upload": "Photo",
    "add.step.review": "Review",
    "add.step.metadata": "Details",
    "add.upload.title": "Choose a photo",
    "add.upload.subtitle": "Take a new photo or pick from your gallery",
    "add.upload.gallery": "Gallery",
    "add.upload.camera": "Camera",
    "add.upload.error": "Only image files are allowed.",
    "add.review.analyzing": "Analysing image...",
    "add.review.skipBtn": "Skip and use original",
    "add.review.original": "Original",
    "add.review.cleaned": "Corrected",
    "add.review.recommended": "Recommended",
    "add.review.noCorrection": "Couldn't detect artwork edges. Using the original.",
    "add.review.next": "Next",
    "add.metadata.originalSelected": "Original selected",
    "add.metadata.cleanedSelected": "Corrected selected",
    "add.metadata.changeImage": "Change",
    "add.metadata.prev": "Back",
    "add.metadata.save": "Save to archive",
    "add.metadata.saving": "Saving...",
    "add.metadata.error": "Save failed. Please try again.",

    // ── Edit artwork ─────────────────────────────────────────────────────────
    "edit.title": "Edit artwork",
    "edit.original": "Original",
    "edit.cleaned": "Corrected",
    "edit.cancel": "Cancel",
    "edit.save": "Save",
    "edit.saving": "Saving...",
    "edit.error": "Save failed.",

    // ── Form fields ──────────────────────────────────────────────────────────
    "field.title": "Title",
    "field.title.required": "Title *",
    "field.title.placeholder": "e.g. The Starry Night",
    "field.title.error": "Title is required.",
    "field.artist": "Artist",
    "field.artist.placeholder": "e.g. Vincent van Gogh",
    "field.year": "Year",
    "field.year.placeholder": "e.g. 1889",
    "field.medium": "Medium",
    "field.medium.placeholder": "e.g. Oil on canvas",
    "field.gallery": "Museum / Gallery",
    "field.gallery.placeholder": "e.g. MoMA, New York",
    "field.exhibition": "Exhibition",
    "field.exhibition.placeholder": "e.g. Van Gogh: Starry Nights",
    "field.visitDate": "Visit date",
    "field.rating": "Rating",
    "field.note": "Notes",
    "field.note.placeholder": "What did you feel about this work?",
    "field.tags": "Tags",
    "field.tags.placeholder": "e.g. impressionism, landscape",

    // ── Search ───────────────────────────────────────────────────────────────
    "search.placeholder": "Search artworks, artists, galleries...",
    "search.filter": "Filters",
    "search.filter.rating": "Rating",
    "search.filter.tag": "Tags",
    "search.filter.clear": "Clear filters",
    "search.results": "{n} results",
    "search.total": "{n} works",
    "search.empty": "No results found.",
    "search.emptyFiltered": "No works match the current filters.",

    // ── Settings ─────────────────────────────────────────────────────────────
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.email": "Email",
    "settings.displayName": "Display name",
    "settings.displayName.placeholder": "Enter a display name",
    "settings.save": "Save",
    "settings.saved": "Saved ✓",
    "settings.saving": "Saving...",
    "settings.error": "Save failed.",
    "settings.archive": "My Archive",
    "settings.artworks": "Artworks",
    "settings.galleries": "Galleries visited",
    "settings.appInfo": "App info",
    "settings.version": "Version",
    "settings.appName": "Name",
    "settings.export": "Export",
    "settings.exportPdf": "Save collection as PDF",
    "settings.exportPdfDesc": "Export all artworks as a museum-style catalogue",
    "settings.language": "Language",
    "settings.legal": "Terms & Policies",
    "settings.terms": "Terms of Service",
    "settings.privacy": "Privacy Policy",
    "settings.signOut": "Sign out",
    "settings.signingOut": "Signing out...",

    // ── Export ───────────────────────────────────────────────────────────────
    "export.back": "Archive",
    "export.print": "Save as PDF",
    "export.subtitle": "Personal Archive",
    "export.headline": "My Museum Collection",
    "export.total": "{n} works",
    "export.footer": "Plaque — My Museum",

    // ── Onboarding ───────────────────────────────────────────────────────────
    "onboarding.title": "Welcome to Plaque",
    "onboarding.subtitle": "Let's start your personal museum archive.",
    "onboarding.feature1.title": "Photograph artworks",
    "onboarding.feature1.body": "Capture works you discover at exhibitions.",
    "onboarding.feature2.title": "Notes & ratings",
    "onboarding.feature2.body": "Record impressions, dates, and gallery details.",
    "onboarding.feature3.title": "Your collection",
    "onboarding.feature3.body": "Tag and search to find anything later.",
    "onboarding.cta": "Add your first artwork",
    "onboarding.dismiss": "Browse first",

    // ── AI placeholder ───────────────────────────────────────────────────────
    "ai.section": "Explore further (coming soon)",
    "ai.explain": "AI interpretation",
    "ai.context": "Story behind this work",
    "ai.similar": "Similar works",
    "ai.taste": "My taste profile",

    // ── Not found / Error ────────────────────────────────────────────────────
    "error.404.heading": "Page not found",
    "error.404.body": "This link is broken or the page has been removed.",
    "error.404.cta": "Back to archive",
    "error.general.heading": "Something went wrong",
    "error.general.body": "A temporary error occurred. Please try again.",
    "error.retry": "Try again",
    "error.home": "Home",

    // ── Common ───────────────────────────────────────────────────────────────
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.back": "Back",
    "common.loading": "Loading...",
  },
} as const;

export type TranslationKey = keyof typeof translations.ko;

/**
 * Translate a key to the given locale.
 * Supports simple {n} interpolation: t("scrapbook.count", locale, { n: 5 }) → "5점의 작품"
 */
export function t(
  key: TranslationKey,
  locale: Locale = DEFAULT_LOCALE,
  vars?: Record<string, string | number>
): string {
  const dict = translations[locale] ?? translations[DEFAULT_LOCALE];
  let str: string = (dict as Record<string, string>)[key] ?? (translations[DEFAULT_LOCALE] as Record<string, string>)[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
