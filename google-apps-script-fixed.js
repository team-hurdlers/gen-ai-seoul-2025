/**
 * Gen AI Seoul 2025 - 무료 AX 컨설팅 신청 폼 처리 (오류 수정 버전)
 * 이 코드를 Google Apps Script에 완전히 새로 붙여넣으세요
 */

function doPost(e) {
  console.log('=== Form Handler Started ===');
  console.log('Received event:', JSON.stringify(e));
  
  if (!e) {
    console.log('Event object is null or undefined');
    throw new Error('이벤트 객체가 전달되지 않았습니다.');
  }
  
  try {
    // 스프레드시트 ID
    const SPREADSHEET_ID = '1Mv0LHKsT2MaqxFT7TjBkOS896nGHxwAVva05x9pwhQ4';
    console.log('Opening spreadsheet:', SPREADSHEET_ID);
    
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    console.log('Spreadsheet opened successfully');
    
    // 데이터 추출 (여러 방법으로 시도)
    let data = {};
    
    // 방법 1: postData에서 JSON 파싱
    if (e && e.postData && e.postData.contents) {
      console.log('Method 1: Parsing JSON from postData');
      try {
        data = JSON.parse(e.postData.contents);
        console.log('JSON parsed successfully:', data);
      } catch (jsonError) {
        console.log('JSON parsing failed:', jsonError);
        data = null;
      }
    }
    
    // 방법 2: URL 파라미터에서 추출
    if (!data && e && e.parameters) {
      console.log('Method 2: Extracting from URL parameters');
      data = {
        name: e.parameters.name ? e.parameters.name[0] : '',
        phone: e.parameters.phone ? e.parameters.phone[0] : '',
        company: e.parameters.company ? e.parameters.company[0] : '',
        email: e.parameters.email ? e.parameters.email[0] : '',
        interest: e.parameters.interest ? e.parameters.interest[0] : '',
        timestamp: new Date().toLocaleString('ko-KR'),
        source: 'Gen AI Seoul 2025 Landing Page'
      };
      console.log('Parameters extracted:', data);
    }
    
    // 방법 3: 직접 파라미터 접근
    if (!data || !data.name) {
      console.log('Method 3: Direct parameter access');
      data = {
        name: e.parameter?.name || '',
        phone: e.parameter?.phone || '',
        company: e.parameter?.company || '',
        email: e.parameter?.email || '',
        interest: e.parameter?.interest || '',
        timestamp: new Date().toLocaleString('ko-KR'),
        source: 'Gen AI Seoul 2025 Landing Page'
      };
      console.log('Direct access result:', data);
    }
    
    // 데이터 검증
    if (!data.name || !data.email) {
      console.log('Data validation failed:', data);
      throw new Error('Required fields (name, email) are missing');
    }
    
    // 헤더 확인 및 추가
    if (sheet.getLastRow() === 0) {
      console.log('Adding headers to empty sheet');
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
    
    // 관심분야 텍스트 변환
    const interestMap = {
      'ai-strategy': 'AI 전략 수립',
      'marketing-automation': '마케팅 자동화',
      'content-creation': 'AI 콘텐츠 제작',
      'all': '전체 관심',
      '': '선택안함'
    };
    
    const interestText = interestMap[data.interest] || data.interest || '선택안함';
    
    // 새 행 추가
    const newRow = [
      data.timestamp || new Date().toLocaleString('ko-KR'),
      data.name || '',
      data.phone || '',
      data.company || '',
      data.email || '',
      interestText,
      data.source || 'Gen AI Seoul 2025 Landing Page'
    ];
    
    console.log('Adding new row:', newRow);
    sheet.appendRow(newRow);
    console.log('Data added successfully!');
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: '신청이 성공적으로 저장되었습니다.',
        data: data,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('=== ERROR OCCURRED ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    // 오류 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: '저장 중 오류가 발생했습니다: ' + error.toString(),
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청 처리 (상태 확인용)
function doGet(e) {
  console.log('GET request received:', JSON.stringify(e));
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'running',
      message: 'Gen AI Seoul 2025 Form Handler is running!',
      timestamp: new Date().toISOString(),
      version: '2.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 강제 테스트 함수 (수동 실행용)
function forceTest() {
  console.log('=== FORCE TEST START ===');
  
  const SPREADSHEET_ID = '1Mv0LHKsT2MaqxFT7TjBkOS896nGHxwAVva05x9pwhQ4';
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getActiveSheet();
  
  // 헤더 추가 (없는 경우)
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
    '강제 테스트',
    '010-1234-5678',
    'Google Apps Script',
    'test@test.com',
    'AI 전략 수립',
    'Force Test Function'
  ]);
  
  console.log('Force test completed successfully!');
  return 'Test data added successfully!';
}

// 실제 폼 데이터로 테스트
function testWithRealData() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        name: '테스트 사용자',
        phone: '010-9999-9999',
        company: '테스트 회사',
        email: 'real-test@example.com',
        interest: 'ai-strategy',
        timestamp: new Date().toLocaleString('ko-KR'),
        source: 'Gen AI Seoul 2025 Landing Page'
      })
    }
  };
  
  console.log('Testing with real form data...');
  const result = doPost(testEvent);
  console.log('Test result:', result.getContent());
  
  return result.getContent();
} 