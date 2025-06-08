# 🤖 Gen AI Seoul 2025 - Official Landing Page

Gen AI Seoul 2025 부스를 위한 공식 랜딩페이지입니다.  
**Neon101 × Hurdlers101 × Superbot101**이 함께하는 AX Company Group의 부스를 소개하고, 무료 AX 컨설팅 신청을 받는 페이지입니다.

🌐 **Live Demo**: **[https://gen-ai-seoul-2025.vercel.app](https://gen-ai-seoul-2025.vercel.app)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/team-hurdlers/gen-ai-seoul-2025)

## 🎯 주요 기능

- **반응형 디자인**: 데스크톱, 태블릿, 모바일 모든 기기에서 최적화
- **부드러운 애니메이션**: 스크롤 기반 fade-in 효과
- **실시간 폼 검증**: 한국어 전화번호, 이메일 형식 검증
- **Google Sheets 연동**: 신청 데이터 자동 수집
- **SEO 최적화**: 메타 태그 및 Open Graph 설정

## 📁 프로젝트 구조

```
landing/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 기능
├── README.md           # 프로젝트 설명서
└── img/               # 이미지 에셋
    ├── genai_)bg.png
    ├── logo.png
    ├── logo_Group 1.png
    ├── neonxhurdlersxsuperbot.png
    └── og_img.png
```

## 🚀 빠른 시작

1. **파일 다운로드**
   ```bash
   # 현재 디렉토리에서 바로 사용 가능
   ```

2. **웹 서버에서 실행**
   ```bash
   # Python을 사용한 간단한 서버
   python -m http.server 8000
   
   # 또는 Node.js 사용
   npx serve .
   ```

3. **브라우저에서 확인**
   ```
   http://localhost:8000
   ```

## 📋 페이지 구성

### 1. Hero Section
- 메인 타이틀: "Gen AI Seoul 2025"
- 서브 타이틀: "AI 전략부터 콘텐츠까지"
- 브랜드 로고 조합
- CTA 버튼: "무료 AX 컨설팅 받기", "3개 브랜드 둘러보기"

### 2. Intro Section
- AX Company Group 소개
- 3개 브랜드 하이라이트 (Neon101, Hurdlers101, Superbot101)

### 3. Brand Detail Section
- **Neon101**: AX Company Group - AI 전략 수립 및 기술 도입 컨설팅
- **Hurdlers101**: AX Consulting Agency - 데이터 기반 마케팅 자동화
- **Superbot101**: AI 이미지/영상 제작사 - AI 기반 브랜드 콘텐츠 제작

### 4. References Grid
- Superbot101의 AI 콘텐츠 제작 사례
- 6개 카테고리 소개 (브랜드 무비, 유튜브 쇼츠, 제품 홍보 릴스 등)

### 5. 무료 AX 컨설팅 신청 폼
- 필수 입력: 이름, 전화번호, 회사명, 이메일
- 선택 입력: 관심 분야
- 실시간 검증 및 Google Sheets 자동 저장

### 6. Footer
- 브랜드 링크 및 연락처 정보

## 🔧 Google Sheets 연동 설정

### 1. Google Sheets 준비
1. 새 Google Sheets 생성
2. 첫 번째 행에 헤더 설정:
   ```
   A1: 신청일시
   B1: 이름  
   C1: 전화번호
   D1: 회사명
   E1: 이메일
   F1: 관심분야
   G1: 신청경로
   ```

### 2. Google Apps Script 설정
1. [Google Apps Script](https://script.google.com) 접속
2. 새 프로젝트 생성
3. 다음 코드 입력:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.phone,
    data.company,
    data.email,
    data.interest,
    data.source
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. **배포 설정**:
   - 우상단 "배포" → "새 배포"
   - 유형 선택: "웹 앱"
   - 실행 대상: "나"
   - 액세스 권한: "모든 사용자"
   - 배포 클릭

5. **script.js 파일 수정**:
   ```javascript
   // 79번째 줄의 URL을 실제 웹 앱 URL로 교체
   const GOOGLE_SCRIPT_URL = '여기에_실제_웹앱_URL_입력';
   
   // 83-91번째 줄의 주석 해제
   const response = await fetch(GOOGLE_SCRIPT_URL, {
       method: 'POST',
       mode: 'no-cors',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(data)
   });
   ```

## 🎨 커스터마이징

### 색상 변경
```css
/* styles.css에서 주요 색상 변수들 */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --text-color: #1a1a1a;
  --gray-light: #f8fafc;
}
```

### 폰트 변경
```html
<!-- index.html head 섹션에서 Google Fonts 링크 수정 -->
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT_HERE&display=swap" rel="stylesheet">
```

### 이미지 교체
- `img/` 폴더의 이미지 파일들을 원하는 이미지로 교체
- 파일명은 동일하게 유지하거나 HTML에서 경로 수정

## 📱 반응형 브레이크포인트

- **데스크톱**: 1200px 이상
- **태블릿**: 768px - 1199px
- **모바일**: 767px 이하
- **소형 모바일**: 480px 이하

## 🔍 SEO 설정

### 메타 태그
```html
<title>Gen AI Seoul 2025 - AI 전략부터 콘텐츠까지</title>
<meta name="description" content="Neon101 × Hurdlers101 × Superbot101이 함께하는 Gen AI Seoul 2025 부스">
<meta property="og:title" content="Gen AI Seoul 2025 - AI 전략부터 콘텐츠까지">
<meta property="og:description" content="무료 AX 컨설팅 1회권 신청하고 AI 혁신을 경험하세요">
<meta property="og:image" content="./img/og_img.png">
```

## 🚀 배포 가이드

### GitHub Pages
1. GitHub 저장소에 코드 업로드
2. Settings > Pages > Source: Deploy from a branch
3. Branch: main 선택
4. 배포 URL로 접속

### Netlify
1. [Netlify](https://netlify.com)에 폴더 드래그 앤 드롭
2. 자동 배포 완료
3. 도메인 설정 (선택사항)

### Vercel
1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 자동 빌드 및 배포
3. 커스텀 도메인 설정 (선택사항)

## 📊 성능 최적화

- **이미지 최적화**: WebP 형식 권장
- **CSS/JS 압축**: 프로덕션 환경에서 minify 적용
- **CDN 사용**: 이미지 및 에셋 CDN 연결 권장

## 🛠️ 개발 도구

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, Custom Properties
- **Vanilla JavaScript**: ES6+ 문법 사용
- **Google Fonts**: Inter 폰트 패밀리

## 📞 지원 및 문의

- **이메일**: [문의 이메일]
- **웹사이트**: [Neon101.ai](https://neon101.ai)
- **Instagram**: [인스타그램 링크]

---

**© 2025 AX Company Group. All rights reserved.** 