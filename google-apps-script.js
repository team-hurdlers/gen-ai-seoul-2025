/**
 * Gen AI Seoul 2025 - 무료 AX 컨설팅 신청 폼 처리
 * Google Apps Script 코드 (개선된 버전)
 * 
 * 사용법:
 * 1. 이 코드를 Google Apps Script에 복사하여 붙여넣기
 * 2. 스프레드시트 ID를 확인하고 수정 (이미 설정됨)
 * 3. 배포 > 새 배포 > 웹 앱으로 배포
 */

function doPost(e) {
  console.log('=== Form Handler Started ===');
  console.log('Received event:', e);
  
  try {
    // Google 스프레드시트 ID
    const SPREADSHEET_ID = '1Mv0LHKsT2MaqxFT7TjBkOS896nGHxwAVva05x9pwhQ4';
    
    console.log('Opening spreadsheet:', SPREADSHEET_ID);
    
    // 스프레드시트 접근
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet opened successfully');
    
    // 이벤트 객체 안전성 검증
    if (!e) {
      console.log('Event object is null or undefined');
      throw new Error('이벤트 객체가 전달되지 않았습니다.');
    }
    
    let data = {};
    
    // 1. POST 데이터에서 JSON 파싱 시도
    if (e.postData && e.postData.contents) {
      console.log('Method 1: JSON parsing from postData');
      console.log('Raw postData contents:', e.postData.contents);
      
      try {
        data = JSON.parse(e.postData.contents);
        console.log('Successfully parsed JSON data:', data);
      } catch (jsonError) {
        console.log('JSON parsing failed:', jsonError.toString());
        
        // 2. FormData 방식으로 재시도
        console.log('Method 2: FormData parameter parsing');
        if (e.parameter) {
          data = e.parameter;
          console.log('FormData parameters:', data);
        } else {
          console.log('No parameter object available');
        }
      }
    } else if (e.parameter) {
      // 3. 직접 parameter 접근
      console.log('Method 3: Direct parameter access');
      data = e.parameter;
      console.log('Direct parameters:', data);
    } else {
      console.log('No data found in any format');
      throw new Error('폼 데이터를 찾을 수 없습니다.');
    }
    
    // 데이터 기본값 설정
    const formData = {
      name: data.name || '',
      phone: data.phone || '',
      company: data.company || '',
      email: data.email || '',
      interest: data.interest || '',
      timestamp: data.timestamp || new Date().toLocaleString('ko-KR'),
      source: data.source || 'Gen AI Seoul 2025 Landing Page'
    };
    
    console.log('Processed form data:', formData);
    
    // 최소한의 데이터 검증 (너무 엄격하지 않게)
    if (!formData.name && !formData.email && !formData.phone) {
      throw new Error('최소한 이름, 이메일, 전화번호 중 하나는 입력해주세요.');
    }
    
    // 시트 찾기 또는 생성
    let sheet;
    try {
      sheet = ss.getSheetByName('Gen AI Seoul 2025');
      console.log('Found existing sheet');
    } catch (error) {
      console.log('Creating new sheet');
      sheet = ss.insertSheet('Gen AI Seoul 2025');
      
      // 헤더 설정
      const headers = [
        '날짜/시간', '이름', '전화번호', '회사명', 
        '이메일', '관심 분야', '신청 경로'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 스타일링
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      
      console.log('Sheet created with headers');
    }
    
    // 데이터 추가
    const newRow = [
      formData.timestamp,
      formData.name,
      formData.phone,
      formData.company,
      formData.email,
      formData.interest,
      formData.source
    ];
    
    sheet.appendRow(newRow);
    sheet.autoResizeColumns(1, 7);
    
    console.log('✅ 데이터 저장 완료:', newRow);
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: '신청이 완료되었습니다.',
        data: {
          timestamp: formData.timestamp,
          name: formData.name,
          received: true
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.log('=== ERROR OCCURRED ===');
    console.log('Error details:', error.toString());
    console.log('Error stack:', error.stack);
    
    // 오류 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: '처리 중 오류가 발생했습니다: ' + error.toString(),
        timestamp: new Date().toLocaleString('ko-KR'),
        debug: true
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청 처리 (웹앱 상태 확인)
function doGet(e) {
  console.log('GET request received:', e);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Gen AI Seoul 2025 Form Handler 실행 중',
      timestamp: new Date().toLocaleString('ko-KR'),
      version: '2.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 테스트 함수 (수동 실행용)
function testFormSubmission() {
  console.log('=== 테스트 시작 ===');
  
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        name: '테스트 사용자',
        phone: '010-1234-5678',
        company: '테스트 회사',
        email: 'test@example.com',
        interest: 'AI 마케팅 자동화',
        timestamp: new Date().toLocaleString('ko-KR'),
        source: 'Test Submission'
      })
    }
  };
  
  const result = doPost(testEvent);
  console.log('테스트 결과:', result.getContent());
  
  return result.getContent();
}

// 스프레드시트 초기 설정
function setupSpreadsheet() {
  try {
    const ss = SpreadsheetApp.create('Gen AI Seoul 2025 - 신청 현황');
    const sheet = ss.getActiveSheet();
    sheet.setName('Gen AI Seoul 2025');
    
    const headers = [
      '날짜/시간', '이름', '전화번호', '회사명', 
      '이메일', '관심 분야', '신청 경로'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('스프레드시트 생성 완료');
    console.log('ID:', ss.getId());
    console.log('URL:', ss.getUrl());
    
    return {
      id: ss.getId(),
      url: ss.getUrl()
    };
    
  } catch (error) {
    console.error('스프레드시트 생성 오류:', error);
    throw error;
  }
}

// 기존 스프레드시트 테스트
function testExistingSpreadsheet() {
  try {
    const SPREADSHEET_ID = '1Mv0LHKsT2MaqxFT7TjBkOS896nGHxwAVva05x9pwhQ4';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    console.log('스프레드시트 접근 성공');
    console.log('시트 이름들:', ss.getSheets().map(sheet => sheet.getName()));
    
    return '스프레드시트 연결 정상';
    
  } catch (error) {
    console.error('스프레드시트 접근 오류:', error);
    return '스프레드시트 접근 실패: ' + error.toString();
  }
}

// 디버깅용 함수
function debugRequest() {
  const spreadsheet = SpreadsheetApp.openById('1Mv0LHKsT2MaqxFT7TjBkOS896nGHxwAVva05x9pwhQ4');
  const sheet = spreadsheet.getActiveSheet();
  
  // 헤더 설정
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '신청일시',
      '이름',
      '전화번호', 
      '회사명',
      '이메일',
      '관심분야',
      '신청경로'
    ]);
  }
  
  // 테스트 데이터 추가
  sheet.appendRow([
    new Date().toLocaleString('ko-KR'),
    '디버그 테스트',
    '010-0000-0000',
    'Google Apps Script',
    'debug@test.com',
    'AI 전략 수립',
    'Manual Debug Test'
  ]);
  
  console.log('Debug data added successfully!');
} 