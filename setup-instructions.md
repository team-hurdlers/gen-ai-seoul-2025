# 🔗 Google Sheets 연동 설정 가이드

## ✅ 현재 상태
- ✅ 랜딩페이지 완료 (http://localhost:8000에서 확인 가능)
- ✅ Google Apps Script 코드 준비 완료
- ⏳ Google Apps Script 배포 및 URL 설정 필요

## 📝 단계별 설정 방법

### 1단계: Google Apps Script 설정
1. **[Google Apps Script](https://script.google.com)** 접속
2. **"새 프로젝트"** 클릭
3. 프로젝트 이름을 **"Gen AI Seoul Form Handler"**로 변경
4. **`google-apps-script.js` 파일의 전체 코드를 복사해서 붙여넣기**

### 2단계: 배포하기
1. Apps Script 편집기에서 **"배포"** → **"새 배포"** 클릭
2. **유형 선택**: "웹 앱" 선택
3. **설정**:
   - 실행 대상: **"나"**
   - 액세스 권한: **"모든 사용자"**
4. **"배포"** 클릭
5. **웹 앱 URL을 복사** (예: `https://script.google.com/macros/s/AKfyc...../exec`)

### 3단계: script.js 파일 수정
배포 완료 후 받은 URL로 script.js 파일 수정:

```javascript
// 67번째 줄 근처에서 다음 부분을 수정
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwP2G9bChKb-n4WDYYac4AHNnG_yBHHNzcukuUK3lU6wtA8dfw5p4Ub7vxi6IAIV2OE/exec';
```

### 4단계: 테스트
1. http://localhost:8000에서 폼 작성 및 제출
2. Google Sheets에서 데이터 확인
3. 성공! 🎉

## 📊 Google Sheets 구조

연동 후 스프레드시트에 다음과 같이 데이터가 저장됩니다:

| 신청일시 | 이름 | 전화번호 | 회사명 | 이메일 | 관심분야 | 신청경로 |
|---------|------|----------|--------|--------|----------|----------|
| 2025-01-XX XX:XX | 홍길동 | 010-1234-5678 | ABC회사 | hong@abc.com | AI 전략 수립 | Gen AI Seoul 2025 Landing Page |

## 🔧 문제 해결

### Q: "권한이 필요합니다" 오류가 나타나면?
A: Google Apps Script 첫 실행 시 권한 승인이 필요합니다.
1. "권한 검토" 클릭
2. Google 계정으로 로그인
3. "고급" → "안전하지 않은 페이지로 이동" 클릭
4. "허용" 클릭

### Q: 폼 제출 후 데이터가 저장되지 않으면?
A: 브라우저 개발자 도구(F12)에서 Console 탭 확인
- "Google Apps Script URL을 설정해주세요!" 메시지가 나오면 3단계 진행
- 다른 오류가 있으면 URL이나 스프레드시트 권한 확인

### Q: 스프레드시트 접근 권한 오류가 나타나면?
A: 스프레드시트 공유 설정 확인
1. Google Sheets에서 "공유" 클릭
2. Apps Script를 실행하는 계정에 "편집자" 권한 부여

## 🎯 완료 후 확인사항
- [ ] Google Apps Script 배포 완료
- [ ] 웹 앱 URL을 script.js에 설정
- [ ] 테스트 폼 제출 성공
- [ ] Google Sheets에 데이터 저장 확인 