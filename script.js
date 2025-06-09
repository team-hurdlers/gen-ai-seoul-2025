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
    
    // Initialize Superbot101 gallery with infinite scroll
    initializeGallery();
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
            privacyRequired: formData.get('privacyRequired'),
            marketingOptional: formData.get('marketingOptional'),
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
    
    // 개인정보 수집 및 이용 동의 (필수) 체크
    if (!data.privacyRequired) {
        errors.push('개인정보 수집 및 이용 동의는 필수입니다.');
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
    
    // 개인정보 동의 체크박스 이벤트 리스너 설정
    initConsentCheckboxes();
});

// 개인정보 동의 관련 변수
let currentModalType = null;

// 개인정보 동의 체크박스 초기화
function initConsentCheckboxes() {
    const consentAll = document.getElementById('consentAll');
    const privacyRequired = document.getElementById('privacyRequired');
    const marketingOptional = document.getElementById('marketingOptional');
    
    if (consentAll && privacyRequired && marketingOptional) {
        // 전체동의 체크박스 이벤트
        consentAll.addEventListener('change', function() {
            privacyRequired.checked = this.checked;
            marketingOptional.checked = this.checked;
        });
        
        // 개별 체크박스 이벤트
        privacyRequired.addEventListener('change', updateConsentAllStatus);
        marketingOptional.addEventListener('change', updateConsentAllStatus);
    }
}

// 전체동의 상태 업데이트
function updateConsentAllStatus() {
    const consentAll = document.getElementById('consentAll');
    const privacyRequired = document.getElementById('privacyRequired');
    const marketingOptional = document.getElementById('marketingOptional');
    
    if (privacyRequired && marketingOptional && consentAll) {
        consentAll.checked = privacyRequired.checked && marketingOptional.checked;
    }
}

// 동의 세부사항 토글
function toggleConsentDetails() {
    const wrapper = document.getElementById('consentDetailsWrapper');
    const toggleBtn = document.querySelector('.consent-toggle-btn');
    
    if (wrapper.classList.contains('expanded')) {
        wrapper.classList.remove('expanded');
        toggleBtn.classList.remove('expanded');
    } else {
        wrapper.classList.add('expanded');
        toggleBtn.classList.add('expanded');
    }
}

// 개인정보 동의 모달 열기
function openConsentModal(type) {
    currentModalType = type;
    const modal = document.getElementById('consentModal');
    const title = document.getElementById('consentModalTitle');
    const body = document.getElementById('consentModalBody');
    
    if (type === 'privacy') {
        title.textContent = '개인정보 수집 동의 안내';
        body.innerHTML = `
            <h4>개인정보 수집 및 이용에 대한 동의서</h4>
            <p>(주)허들러는 「개인정보 보호법」 제15조에 의거하여 개인정보 수집·이용을 동의를 받고 있습니다. 정보주체가 동의한 내용 외의 다른 목적으로 활용하지 않습니다.</p>
            
            <h4>• 개인정보 수집·이용 목적</h4>
            <p>상담 문의 대응을 위함</p>
            
            <h4>• 수집하는 개인정보의 항목</h4>
            <p>휴대전화번호</p>
            
            <h4>• 개인정보의 보유 및 이용 기간</h4>
            <p>정보 문의 당일 활용일로부터 1년간 보관 후 파기</p>
            
            <p style="margin-top: 1.5rem; padding: 1rem; background: #f9fafb; border-radius: 8px; font-size: 0.9rem; color: #6b7280;">
                ※ 귀하는 본 동의를 거부하실 수 있습니다. 다만, 위 개인정보 수집·이용에 관한 동의를 상담 대응을 위한 필수 사항이므로, 위 사항에 동의하셔야만 상담 문의가 가능합니다.
            </p>
        `;
    } else if (type === 'marketing') {
        title.textContent = '광고성 정보 수신 동의 안내';
        body.innerHTML = `
            <h4>광고성 정보 수신에 대한 동의서</h4>
            <p>(주)허들러는 다음과 같은 광고성 정보를 전송하고자 합니다.</p>
            
            <h4>• 수신하는 개인정보의 항목</h4>
            <p>휴대전화번호</p>
            
            <h4>• 수집하는 개인정보의 항목</h4>
            <p>휴대전화번호</p>
            
            <h4>• 개인정보의 보유 및 이용 기간</h4>
            <p>정보 문의 당일 활용일로부터 1년간 보관 후 파기</p>
            
            <p style="margin-top: 1.5rem; padding: 1rem; background: #f9fafb; border-radius: 8px; font-size: 0.9rem; color: #6b7280;">
                ※ 동의를 하지 않아도 무료 컨설팅 신청은 가능합니다.
            </p>
        `;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 개인정보 동의 모달 닫기
function closeConsentModal() {
    const modal = document.getElementById('consentModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModalType = null;
}

// 모달에서 동의하기
function agreeFromModal() {
    if (currentModalType === 'privacy') {
        const privacyCheckbox = document.getElementById('privacyRequired');
        if (privacyCheckbox) {
            privacyCheckbox.checked = true;
        }
    } else if (currentModalType === 'marketing') {
        const marketingCheckbox = document.getElementById('marketingOptional');
        if (marketingCheckbox) {
            marketingCheckbox.checked = true;
        }
    }
    
    updateConsentAllStatus();
    closeConsentModal();
}

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

// Superbot101 갤러리 무한스크롤 기능
let galleryImagesLoaded = 0;
let isLoadingMore = false;
let hasMoreImages = true;

function initializeGallery() {
    const allItems = document.querySelectorAll('.reference-item');
    const initialCount = window.innerWidth <= 768 ? 6 : 12; // 모바일: 6개, PC: 12개
    
    // 모든 이미지를 일단 숨김
    allItems.forEach((item, index) => {
        if (index < initialCount) {
            item.style.display = 'block';
            galleryImagesLoaded++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // 무한스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', throttle(checkScrollPosition, 100));
    
    // 더 로드할 이미지가 있는지 확인
    if (allItems.length <= initialCount) {
        hasMoreImages = false;
    }
}

function checkScrollPosition() {
    if (!hasMoreImages || isLoadingMore) return;
    
    // 페이지 하단에서 200px 위에 도달했을 때 더 로드
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMoreImages();
    }
}

function loadMoreImages() {
    if (isLoadingMore || !hasMoreImages) return;
    
    isLoadingMore = true;
    
    const allItems = document.querySelectorAll('.reference-item');
    const hiddenItems = document.querySelectorAll('.reference-item[style*="display: none"]');
    
    if (hiddenItems.length === 0) {
        hasMoreImages = false;
        isLoadingMore = false;
        showTemporaryMessage('모든 작품을 확인했습니다! 🎨');
        return;
    }
    
    // 디바이스별 로드 개수 설정
    const loadCount = window.innerWidth <= 768 ? 4 : 8; // 모바일: 4개씩, PC: 8개씩
    const itemsToShow = Math.min(loadCount, hiddenItems.length);
    
    // 로딩 인디케이터 표시
    showLoadingIndicator();
    
    // 이미지를 순차적으로 로드
    for (let i = 0; i < itemsToShow; i++) {
        setTimeout(() => {
            hiddenItems[i].style.display = 'block';
            hiddenItems[i].style.opacity = '0';
            hiddenItems[i].style.transform = 'translateY(30px)';
            
            // 새로 로드된 이미지에 클릭 이벤트 추가
            addClickEventToItem(hiddenItems[i]);
            
            // 페이드인 애니메이션
            setTimeout(() => {
                hiddenItems[i].style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                hiddenItems[i].style.opacity = '1';
                hiddenItems[i].style.transform = 'translateY(0)';
            }, 100);
            
            galleryImagesLoaded++;
            
            // 마지막 이미지 로드 완료 후
            if (i === itemsToShow - 1) {
                setTimeout(() => {
                    hideLoadingIndicator();
                    isLoadingMore = false;
                    
                    // 더 로드할 이미지가 있는지 확인
                    const remainingHidden = document.querySelectorAll('.reference-item[style*="display: none"]');
                    if (remainingHidden.length === 0) {
                        hasMoreImages = false;
                        showTemporaryMessage('모든 작품을 확인했습니다! 🎨');
                    }
                }, 600);
            }
        }, i * 100); // 순차적 로드
    }
    
    // 트래킹
    trackEvent('infinite_scroll_load', {
        images_loaded: itemsToShow,
        total_loaded: galleryImagesLoaded + itemsToShow,
        device: window.innerWidth <= 768 ? 'mobile' : 'desktop'
    });
}

// 로딩 인디케이터 표시
function showLoadingIndicator() {
    // 기존 로딩 인디케이터가 있으면 제거
    const existingIndicator = document.getElementById('galleryLoadingIndicator');
    if (existingIndicator) existingIndicator.remove();
    
    const indicator = document.createElement('div');
    indicator.id = 'galleryLoadingIndicator';
    indicator.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            color: #666;
            font-size: 0.9rem;
        ">
            <div style="
                width: 20px;
                height: 20px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #8A2BE2;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 10px;
            "></div>
            새로운 작품을 불러오는 중...
        </div>
    `;
    
    const gallery = document.getElementById('referencesGrid');
    gallery.insertAdjacentElement('afterend', indicator);
}

// 로딩 인디케이터 제거
function hideLoadingIndicator() {
    const indicator = document.getElementById('galleryLoadingIndicator');
    if (indicator) {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
    }
}

// 스크롤 이벤트 최적화를 위한 throttle 함수
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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
        addClickEventToItem(item);
    });
    
    // Initialize image modal
    createImageModal();
});

// 이미지 아이템에 클릭 이벤트 추가하는 함수
function addClickEventToItem(item) {
    // 이미 이벤트가 추가되어 있는지 확인
    if (item.getAttribute('data-click-added')) return;
    
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const title = this.querySelector('h4')?.textContent || 'Superbot101 작품';
        const description = this.querySelector('p')?.textContent || '';
        const category = this.getAttribute('data-category') || 'general';
        
        // 모달 열기
        openImageModal(img.src, title, description, category);
        
        // 트래킹
        trackEvent('reference_view', {
            category: category,
            title: title
        });
    });
    
    // 이벤트 추가 표시
    item.setAttribute('data-click-added', 'true');
}

// 카테고리 텍스트 변환 함수
function getCategoryText(category) {
    const categoryMap = {
        'all': '전체',
        'fashion': '패션',
        'product': '제품',
        'portrait': '포트레이트',
        'car': '자동차',
        'food': '음식',
        'general': '일반'
    };
    return categoryMap[category] || '일반';
}

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