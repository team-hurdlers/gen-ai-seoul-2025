# 🔧 Google Apps Script 오류 해결 가이드

## ❌ 발생한 오류
```
Form submission error: [TypeError: Cannot read properties of undefined (reading 'postData')]
```

## ✅ 해결 방법

### 1단계: Google Apps Script 코드 업데이트
1. Google Apps Script 편집기에서 **`google-apps-script.js`** 파일의 **전체 코드를 새로운 버전으로 교체**
2. 수정된 코드는 `postData`가 없는 경우도 안전하게 처리합니다

### 2단계: 디버깅 테스트
1. Google Apps Script 편집기에서 **`debugRequest`** 함수 실행:
   ```javascript
   // 실행 > debugRequest 선택 후 실행
   ```
2. 권한 승인 후 Google Sheets에 테스트 데이터가 추가되는지 확인

### 3단계: 웹 앱 재배포
1. **배포 > 배포 관리**
2. **새 버전 생성** (중요!)
3. **새 배포** 클릭
4. **새로운 웹 앱 URL 복사**

### 4단계: 클라이언트 코드 URL 업데이트
1. `script.js` 파일의 72번째 줄 수정:
   ```javascript
   const GOOGLE_SCRIPT_URL = '새로운_웹앱_URL_여기에_붙여넣기';
   ```

## 🧪 테스트 순서

### 1. Google Apps Script 테스트
```javascript
// 1. debugRequest() 함수 실행
// 2. testFormSubmission() 함수 실행
```

### 2. 웹 앱 접근 테스트
- 브라우저에서 웹 앱 URL 직접 접속
- "Gen AI Seoul 2025 Form Handler is running!" 메시지 확인

### 3. 실제 폼 테스트
- 랜딩페이지에서 폼 작성 및 제출
- 브라우저 개발자 도구 Console에서 성공 메시지 확인

## 🚨 주요 변경사항

### Google Apps Script 개선점:
1. **안전한 데이터 파싱**: `postData`가 없어도 오류 없이 처리
2. **FormData 지원**: JSON과 FormData 두 가지 방식 모두 지원
3. **더 나은 오류 처리**: 구체적인 오류 메시지 제공
4. **디버깅 함수**: 수동으로 데이터 추가 및 테스트 가능

### 클라이언트 JavaScript 개선점:
1. **이중 전송 방식**: JSON 실패 시 FormData로 자동 재시도
2. **더 나은 로깅**: 성공/실패 상태를 Console에 명확히 표시
3. **CORS 처리 개선**: 일반 요청 우선, 실패 시 no-cors 모드 사용

## ✨ 최종 확인 체크리스트

- [ ] Google Apps Script 코드 업데이트 완료
- [ ] `debugRequest()` 함수 실행 성공
- [ ] 새 버전으로 웹 앱 재배포 완료
- [ ] `script.js`에 새 URL 설정 완료
- [ ] 브라우저에서 웹 앱 URL 접속 확인
- [ ] 랜딩페이지 폼 테스트 성공
- [ ] Google Sheets에 데이터 저장 확인

## 📞 추가 도움이 필요하시면

각 단계에서 문제가 발생하면 해당 단계의 오류 메시지를 알려주세요! 