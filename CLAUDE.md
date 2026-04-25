# CLAUDE.md — FocusFlow 프로젝트 가이드

## 글로벌 인프라 참조 (필수)

📖 **[글로벌 인프라 참조 가이드](C:\Users\bluee\.claude\INFRASTRUCTURE_GLOBAL_REFERENCE.md)** — 섹션 7 "모바일 앱 빌드 & 배포 완전 가이드" 전체 숙지 필수
📖 **[전역 개발 전략](C:\Users\bluee\.claude\CLAUDE.md)** — BE 표준, FE 표준, 커밋 규칙
📖 **기준 모델**: `SAAS/DreamWay/` — 빌드, 배포, API Key, 환경변수, 플랫폼 설정 모두 참조

---

## 작업 규칙

작업이 완료되면 반드시 변경사항을 커밋하고 원격 저장소에 푸시한다.

### Metro 포트 격리
- **Metro 포트**: `8082` (고정) — 다른 프로젝트 Metro와 **동시 실행 금지** (Windows watcher 핸들 제한). 전환 시 기존 Metro 종료 후 시작.
- **`taskkill //F //IM node.exe` 절대 금지**: Metro뿐 아니라 Claude Code 세션까지 종료됨. Metro 종료는 포트 기반 PID kill만 사용.
- **에뮬레이터 기동 시**: `adb reverse tcp:8082 tcp:8082` (현재 프로젝트 포트만 설정)

---

## 1. 프로젝트 개요

### 앱 정보
- **앱 이름**: FocusFlow (포커스플로우) — 확정
- **컨셉**: 집중 타이머(뽀모도로) + 배경음(화이트노이즈/자연음) 믹서 올인원 앱
- **슬로건**: "소리로 만드는 나만의 집중 공간"
- **타겟**: 학생, 재택 직장인, 프리랜서, 카페 공부족 (글로벌)
- **번들 ID**: `brp.focusflow.app` — 확정
- **카테고리**: Productivity (생산성)

### 개발 방침
- **언어**: 한국어 + 영어 동시 지원 (i18n)
- **플랫폼**: Android 우선 개발, iOS는 이후
- **출시 전략**: Phase 1~4 전체 구현 후 출시
- **테마**: 다크/라이트 모드 모두 지원
- **Firebase**: 기존 `brp-app-project`에 앱 추가

### 핵심 차별화
- 타이머 앱들은 소리가 없고, 소리 앱들은 타이머가 없음 → **통합**
- 단순 타이머가 아닌 **집중 통계 + 습관 형성** (스트릭, 일간/주간 리포트)
- 세션 중 사운드 믹싱 (비 + 카페 + 피아노 등 자유 조합)

---

## 2. 수익 모델

### 무료 (Free Tier)
- 기본 타이머 (25/5분 뽀모도로)
- 기본 사운드 5종 (비, 파도, 바람, 새소리, 화이트노이즈)
- 일간 통계
- 리워드 광고로 프리미엄 사운드 1개 24시간 해금 (일 3회)

### 프리미엄 (구독)
- **월 $2.99 / 연 $19.99** (예정)
- 프리미엄 사운드팩 전체 (30종+)
- 사운드 믹서 (최대 3개 동시 재생 + 볼륨 개별 조절)
- 주간/월간 집중 리포트 + AI 인사이트
- 커스텀 타이머 (자유 시간 설정)
- 광고 제거
- 위젯

### 인앱결제 상품 (react-native-iap)
| 상품 ID | 유형 | 가격 |
|---------|------|------|
| `focusflow_monthly` | 월 구독 | $2.99 |
| `focusflow_yearly` | 연 구독 | $19.99 |
| `sound_pack_nature` | 일회성 | $0.99 |
| `sound_pack_cafe` | 일회성 | $0.99 |
| `sound_pack_asmr` | 일회성 | $0.99 |

---

## 3. 기술 스택

### FE (MVP — BE 없이 시작)
| 영역 | 기술 |
|------|------|
| 프레임워크 | React Native 0.76+ + Expo 52+ |
| 언어 | TypeScript |
| 상태관리 | Zustand |
| 네비게이션 | Expo Router |
| 로컬 저장소 | MMKV (타이머 기록, 설정) |
| 오디오 | expo-av (사운드 재생, 믹싱) |
| 인앱결제 | react-native-iap |
| 광고 | react-native-google-mobile-ads (리워드) |
| 푸시 | expo-notifications + FCM |
| 위젯 | react-native-widget (Android), expo-widgets (iOS) |
| 다국어 | i18next + react-i18next (한/영) |

### BE (2차 — 클라우드 동기화 시)
| 영역 | 기술 |
|------|------|
| 프레임워크 | Spring Boot 3.2+ |
| 언어 | Java 17 |
| DB | Oracle Autonomous (OCI) |
| 캐시 | Redis |
| 인증 | JWT + Apple/Google/Kakao OAuth2 |
| 배포 | OCI Compute + Jenkins + systemctl |

### 사운드 파일 호스팅
- **MVP**: 앱 번들에 포함 (기본 5종, 각 1~2MB)
- **프리미엄**: Cloudflare R2에 호스팅 → 앱에서 다운로드
- **형식**: MP3 또는 OGG, 루프 가능한 30초~1분 클립

---

## 4. MVP 기능 정의 (v1.0)

### Phase 1 — 핵심 (출시 최소 요건)
- [ ] 뽀모도로 타이머 (25분 집중 / 5분 휴식 / 15분 긴 휴식)
- [ ] 타이머 커스텀 설정 (시간 자유 입력)
- [ ] 기본 사운드 5종 재생 (단일)
- [ ] 백그라운드 재생 (앱 나가도 소리 + 타이머 유지)
- [ ] 세션 완료 알림 (진동 + 사운드)
- [ ] 오늘 집중 시간 표시
- [ ] 로컬 저장 (MMKV)

### Phase 2 — 차별화
- [ ] 사운드 믹서 (2~3개 동시, 개별 볼륨)
- [ ] 집중 통계 (일간/주간 차트)
- [ ] 스트릭 시스템 (연속 집중일)
- [ ] 프리미엄 사운드팩 다운로드
- [ ] 인앱결제 (구독 + 사운드팩)
- [ ] 리워드 광고

### Phase 3 — 성장
- [ ] 위젯 (오늘 집중 시간, 빠른 타이머 시작)
- [ ] AI 집중 인사이트 (Claude Haiku — 패턴 분석, 최적 시간 추천)
- [ ] FCM 푸시 (일일 집중 리마인더)
- [ ] 소셜 공유 (집중 카드 스크린샷)
- [ ] 다크/라이트 테마 (초기부터 지원)

### Phase 4 — 확장 (BE 필요)
- [ ] 클라우드 동기화 (기기 간 데이터)
- [ ] 글로벌 랭킹 (익명, 오늘 집중 시간 순위)
- [ ] 사운드 커뮤니티 (사용자 믹스 공유) — 사람관리 최소화, 콘텐츠만

---

## 5. 디자인 컨셉

### 무드
- **Calm Productivity** — 차분하면서도 생산적인 느낌
- 다크/라이트 모드 모두 지원 (다크 모드 기본)
- 미니멀 UI (타이머가 주인공)

### 색상 팔레트 (확정)
- **Primary**: Deep Navy (#1A1A2E) — 배경
- **Accent**: Soft Blue (#4ECDC4) — 타이머, 버튼
- **Secondary**: Warm Amber (#FFD93D) — 강조, 스트릭
- **Text**: Off-White (#E8E8E8)

### 폰트
- 숫자(타이머): 모노스페이스 또는 커스텀 (큰 사이즈)
- 본문: Pretendard (한글) / Inter (영문)

---

## 6. 배포 계획

### Android
- **빌드**: GitHub Actions → AAB (DreamWay 방식)
- **배포**: Google Play Store 내부 테스트 → 프로덕션
- **Keystore**: `focusflow-release.keystore` (생성 필요)
- **서비스 계정**: DreamWay와 동일 (`brp-app-project`)

### iOS
- **빌드**: Codemagic → IPA (apple 환경변수 그룹 재사용)
- **배포**: TestFlight → App Store
- **Bundle ID**: `brp.focusflow.app`

### 사전 준비
- [ ] Google Play Console에 앱 등록
- [ ] App Store Connect에 앱 등록
- [ ] Firebase 프로젝트 생성 (또는 brp-app-project에 앱 추가)
- [ ] Keystore 생성
- [ ] Codemagic에 앱 추가
- [ ] GitHub 레포 생성 (BlueDeveloper/focusflow)

---

## 7. 환경변수

### FE (.env.local)
```
APP_ENV=local|preview|production
CODEMAGIC_API_TOKEN=(글로벌 참조)
CODEMAGIC_APP_ID=(Codemagic 등록 후)
```

### GitHub Secrets (Android CI)
```
GOOGLE_SERVICES_JSON — Firebase Android 설정
KEYSTORE_BASE64 — 릴리즈 키스토어 base64
KEYSTORE_PASSWORD — 키스토어 비밀번호
KEY_ALIAS — focusflow-key
KEY_PASSWORD — 키 비밀번호
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON — Play Store 서비스 계정
```

### Codemagic Secrets (iOS CI — apple 그룹 공통)
```
APP_STORE_CONNECT_KEY_IDENTIFIER — MNLKJ6RKMN (공통)
APP_STORE_CONNECT_ISSUER_ID — (공통)
APP_STORE_CONNECT_PRIVATE_KEY — (공통)
CERTIFICATE_PRIVATE_KEY — (공통)
GOOGLE_SERVICE_INFO_PLIST — (앱별 base64)
```

---

## 8. 경쟁 분석

### 주요 경쟁 앱
| 앱 | 다운로드 | 강점 | 약점 |
|-----|---------|------|------|
| Forest | 1000만+ | 게이미피케이션 (나무 키우기) | 사운드 없음 |
| Tide | 500만+ | 사운드 + 타이머 | 무거움, 구독 비쌈 ($9.99/월) |
| Brain.fm | 100만+ | AI 음악 생성 | 구독만 ($6.99/월), 오프라인 불가 |
| Noisli | 50만+ | 사운드 믹서 | 타이머 기능 약함 |
| Focus To-Do | 500만+ | 할일 + 뽀모도로 | 사운드 없음, UI 복잡 |

### 우리의 포지션
- **Tide보다 가볍고 저렴** ($2.99 vs $9.99)
- **Forest보다 사운드 풍부** (믹서 지원)
- **Noisli보다 타이머 강력** (통계, 스트릭)
- **Brain.fm보다 접근성** (무료 티어 충분히 쓸만)

---

## 9. 마일스톤

| 단계 | 목표 | 예상 |
|------|------|------|
| **M1** | FE 프로젝트 세팅 + 타이머 코어 | - |
| **M2** | 사운드 재생 + 믹서 | - |
| **M3** | 통계 + 스트릭 + 로컬 저장 | - |
| **M4** | 인앱결제 + 광고 연동 | - |
| **M5** | 디자인 고도화 + QA | - |
| **M6** | Play Store + App Store 출시 | - |

---

## 10. 작업 로그 & 이슈

- `docs/work-log/` : 날짜별 작업 내역 및 미해결 이슈 기록
- 작업 시작 전 최신 로그를 확인하여 미해결 이슈를 파악한다

## 11. 프로젝트 인원

- **관리자**: 윤동제
- **총괄 개발자**: Claude
- **기획**: Claude (프로젝트 기획자 역할)
