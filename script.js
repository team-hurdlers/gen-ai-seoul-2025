// Smooth scrolling functions
function scrollToForm() {
    document.getElementById('consulting-form').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToBrands() {
    document.getElementById('brands').scrollIntoView({
        behavior: 'smooth'
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll('.brand-card, .highlight-item, .reference-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Initialize form handling
    initializeForm();
});

// Form handling and Google Sheets integration
function initializeForm() {
    const form = document.getElementById('consultingForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            email: formData.get('email'),
            interest: formData.get('interest'),
            timestamp: new Date().toLocaleString('ko-KR'),
            source: 'Gen AI Seoul 2025 Landing Page'
        };
        
        // Validate form data
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '제출 중...';
        submitBtn.disabled = true;
        
        try {
            // Google Apps Script Web App URL - 새 배포 URL 연결
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgFwhIN4Em2N8GGt2WRLkvEGQBJq11tW5G5Dj1Q1FGllw9PYiD3rJo1Ar8sxqlHY7R/exec';
            
            // 실제 Google Apps Script로 데이터 전송
            if (GOOGLE_SCRIPT_URL !== 'PLACEHOLDER_URL') {
                try {
                    // 첫 번째 방법: JSON POST 요청
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    console.log('✅ 폼 데이터가 성공적으로 전송되었습니다.');
                } catch (error) {
                    console.warn('JSON POST 실패, FormData로 재시도:', error);
                    
                    // 두 번째 방법: FormData로 재시도
                    const formData = new FormData();
                    Object.keys(data).forEach(key => {
                        formData.append(key, data[key]);
                    });
                    
                    await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        body: formData
                    });
                    
                    console.log('✅ FormData로 재전송 완료');
                }
            } else {
                // 아직 URL이 설정되지 않았다면 시뮬레이션 실행
                await simulateFormSubmission(data);
                console.log('⚠️ Google Apps Script URL을 설정해주세요!');
            }
            
            showSuccessMessage();
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage('신청 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Form validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('이름을 정확히 입력해 주세요.');
    }
    
    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push('올바른 전화번호를 입력해 주세요.');
    }
    
    if (!data.company || data.company.trim().length < 2) {
        errors.push('회사명을 입력해 주세요.');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('올바른 이메일 주소를 입력해 주세요.');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (Korean format)
function isValidPhone(phone) {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Simulate form submission (remove this when using real Google Apps Script)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('Form submission data:', data);
        setTimeout(resolve, 1500); // Simulate network delay
    });
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('consultingForm');
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <strong>신청이 완료되었습니다!</strong><br>
        무료 AX 컨설팅 바우처를 곧 이메일로 보내드리겠습니다.<br>
        Gen AI Seoul 2025 부스에서 만나뵐 수 있기를 기대합니다!
    `;
    
    form.insertBefore(message, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Show error message
function showErrorMessage(errorText) {
    const form = document.getElementById('consultingForm');
    
    // Remove existing error messages
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = errorText;
    
    form.insertBefore(message, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 3 && value.length <= 7) {
                value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
            } else if (value.length >= 8) {
                value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
            }
            e.target.value = value;
        });
    }
});

// Scroll to top functionality (optional)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll-to-top button if needed
document.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
});

// Google Analytics tracking (add your GA tracking ID)
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('consultingForm');
    if (form) {
        form.addEventListener('submit', function() {
            trackEvent('form_submit', {
                form_name: 'ax_consulting_application'
            });
        });
    }
    
    // Track button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('button_click', {
                button_text: this.textContent.trim()
            });
        });
    });
});

// Reference Gallery Functions
function filterReferences(category) {
    const items = document.querySelectorAll('.reference-item');
    const buttons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.querySelector('.btn-secondary');
    
    // Update active button - data-category 속성으로 정확히 매칭
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category || 
            (category === 'all' && btn.textContent.includes('전체'))) {
            btn.classList.add('active');
        }
    });
    
    // 모든 이미지 일단 숨김 (CSS 숨김 제거)
    items.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('hidden');
    });
    
    // 필터링된 이미지들 찾기
    let filteredItems;
    if (category === 'all') {
        filteredItems = Array.from(items);
    } else {
        filteredItems = Array.from(items).filter(item => 
            item.getAttribute('data-category') === category
        );
    }
    
    // 초기 표시 개수 설정 (PC: 9개, 모바일: 5개)
    const isMobile = window.innerWidth <= 768;
    const initialCount = isMobile ? 5 : 9;
    
    // 초기 개수만큼만 표시
    filteredItems.forEach((item, index) => {
        if (index < initialCount) {
            setTimeout(() => {
                item.style.display = 'block';
            }, index * 50); // 순차적으로 나타나는 효과
        }
    });
    
    // "더 많은 작품 보기" 버튼 상태 업데이트
    if (loadMoreBtn) {
        if (filteredItems.length > initialCount) {
            loadMoreBtn.textContent = '더 많은 작품 보기';
            loadMoreBtn.disabled = false;
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Track filtering event
    trackEvent('reference_filter', {
        category: category,
        totalItems: filteredItems.length,
        initialShown: Math.min(initialCount, filteredItems.length)
    });
}

// 카테고리별 텍스트 매핑
function getCategoryText(category) {
    const categoryMap = {
        'all': '전체',
        'fashion': '패션',
        'product': '제품',
        'portrait': '포트레이트',
        'automotive': '자동차',
        'food': '음식'
    };
    return categoryMap[category] || category;
}

function loadMoreReferences() {
    const btn = event.target;
    const originalText = btn.textContent;
    const grid = document.getElementById('referencesGrid');
    // 현재 활성 필터 찾기
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const currentFilter = activeFilterBtn?.getAttribute('data-category') || 
                         (activeFilterBtn?.textContent.includes('전체') ? 'all' : 'all');
    
    // 현재 표시되는 이미지 개수 확인
    let visibleItems;
    if (currentFilter === 'all') {
        visibleItems = document.querySelectorAll('.reference-item:not([style*="display: none"])');
    } else {
        visibleItems = document.querySelectorAll(`.reference-item[data-category="${currentFilter}"]:not([style*="display: none"])`);
    }
    
    // 숨겨진 이미지들 찾기
    let hiddenItems;
    if (currentFilter === 'all') {
        hiddenItems = document.querySelectorAll('.reference-item[style*="display: none"]');
    } else {
        hiddenItems = document.querySelectorAll(`.reference-item[data-category="${currentFilter}"][style*="display: none"]`);
    }
    
    if (hiddenItems.length === 0) {
        // 더 이상 보여줄 이미지가 없으면
        btn.textContent = '모든 작품을 확인했습니다';
        btn.disabled = true;
        return;
    }
    
    // 로딩 상태 표시
    btn.textContent = '로딩 중...';
    btn.disabled = true;
    
    setTimeout(() => {
        // 디바이스별 로드 개수 설정
        const isMobile = window.innerWidth <= 768;
        const loadCount = isMobile ? 3 : 9; // 모바일: 3개씩, PC: 9개씩
        
        // 지정된 개수만큼 이미지 표시
        for (let i = 0; i < Math.min(loadCount, hiddenItems.length); i++) {
            hiddenItems[i].style.display = 'block';
            
            // 애니메이션 효과
            setTimeout(() => {
                hiddenItems[i].style.opacity = '0';
                hiddenItems[i].style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    hiddenItems[i].style.transition = 'all 0.5s ease';
                    hiddenItems[i].style.opacity = '1';
                    hiddenItems[i].style.transform = 'translateY(0)';
                }, 50);
            }, i * 100); // 순차적으로 나타나는 효과
        }
        
        // 버튼 상태 복원
        btn.textContent = originalText;
        btn.disabled = false;
        
        // 더 이상 로드할 이미지가 있는지 확인
        const remainingHidden = document.querySelectorAll(
            currentFilter === 'all' 
                ? '.reference-item[style*="display: none"]'
                : `.reference-item[data-category="${currentFilter}"][style*="display: none"]`
        );
        
        if (remainingHidden.length === 0) {
            btn.textContent = '모든 작품을 확인했습니다';
            btn.disabled = true;
        }
        
        // 사용자에게 피드백
        const loadedCount = Math.min(loadCount, hiddenItems.length);
        showTemporaryMessage(`${loadedCount}개의 새로운 작품을 불러왔습니다! 🎨`);
        
    }, 800); // 로딩 애니메이션 시간
    
    // Track event
    trackEvent('load_more_references', {
        filter: currentFilter,
        device: window.innerWidth <= 768 ? 'mobile' : 'desktop'
    });
}

function showTemporaryMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.maxWidth = '300px';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Image lazy loading optimization
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for lazy loading images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.getAttribute('data-src')) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.remove('loading');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all images with loading attribute
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
    
    // Add click events to reference items for modal
    const referenceItems = document.querySelectorAll('.reference-item');
    referenceItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h4')?.textContent || 'Superbot101 작품';
            const description = this.querySelector('p')?.textContent || '';
            const category = this.getAttribute('data-category');
            
            // 모달 열기
            openImageModal(img.src, title, description, category);
            
            // 트래킹
            trackEvent('reference_view', {
                category: category,
                title: title
            });
        });
    });
    
    // Initialize image modal
    createImageModal();
});

// 이미지 모달 생성
function createImageModal() {
    // 모달이 이미 존재하면 리턴
    if (document.getElementById('imageModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeImageModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeImageModal()">&times;</button>
            <img class="modal-image" src="" alt="">
            <div class="modal-info">
                <h3 class="modal-title"></h3>
                <p class="modal-description"></p>
                <span class="modal-category"></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

// 이미지 모달 열기
function openImageModal(imageSrc, title, description, category) {
    const modal = document.getElementById('imageModal');
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalCategory = modal.querySelector('.modal-category');
    
    modalImage.src = imageSrc;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalCategory.textContent = `#${getCategoryText(category)}`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 이미지 모달 닫기
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // 스크롤 복원
}

// Hurdlers101 서비스 캐러셀 기능 (수평 스크롤 기반)
function moveCarousel(direction) {
    const carousel = document.getElementById('servicesCarousel');
    const cardWidth = 320 + 24; // 카드 너비 + gap
    const scrollAmount = cardWidth * 2; // 한번에 2개 카드씩 이동
    
    if (direction === 1) {
        // 오른쪽으로 스크롤
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    } else {
        // 왼쪽으로 스크롤
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // 버튼 상태 업데이트
    setTimeout(() => {
        updateCarouselButtons();
    }, 300);
}

function updateCarouselButtons() {
    const carousel = document.getElementById('servicesCarousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn && nextBtn && carousel) {
        // 스크롤 위치에 따른 버튼 상태
        const isAtStart = carousel.scrollLeft <= 10;
        const isAtEnd = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 10);
        
        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;
    }
}

// 캐러셀 스크롤 이벤트 리스너 추가
function initCarouselScrollListener() {
    const carousel = document.getElementById('servicesCarousel');
    if (carousel) {
        carousel.addEventListener('scroll', updateCarouselButtons);
    }
}

// 페이지 로드시 캐러셀 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 기존 초기화 코드...
    
    // 캐러셀 초기화
    setTimeout(() => {
        updateCarouselButtons();
        initCarouselScrollListener();
    }, 100);
    
    // 윈도우 리사이즈시 캐러셀 재설정
    window.addEventListener('resize', function() {
        setTimeout(() => {
            updateCarouselButtons();
        }, 100);
    });
});

/* 
Google Apps Script 설정 가이드:

1. Google Apps Script (https://script.google.com) 접속
2. 새 프로젝트 생성
3. 다음 코드를 추가:

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

4. 배포 > 새 배포 > 유형 선택: 웹 앱
5. 실행 대상: 나 / 액세스 권한: 모든 사용자
6. 배포 URL을 복사하여 GOOGLE_SCRIPT_URL 변수에 입력

Google Sheets 헤더 설정:
A1: 신청일시
B1: 이름  
C1: 전화번호
D1: 회사명
E1: 이메일
F1: 관심분야
G1: 신청경로
*/ 