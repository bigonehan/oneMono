let currentFolder = null;
let currentItems = [];

// 플러그인 초기화
eagle.onPluginCreate(async (plugin) => {
    console.log('=== 플러그인 시작 ===');
    
    try {
        // 1. 선택된 폴더 가져오기
        console.log('1단계: 선택된 폴더 가져오기 시도...');
        const folders = await eagle.folder.getSelected();
        
        console.log('선택된 폴더 개수:', folders ? folders.length : 0);
        console.log('선택된 폴더 전체 데이터:', JSON.stringify(folders, null, 2));
        
        if (!folders || folders.length === 0) {
            console.error('❌ 선택된 폴더 없음');
            showMessage('폴더를 먼저 선택해주세요.', 'error');
            document.getElementById('renameBtn').disabled = true;
            return;
        }

        currentFolder = folders[0];
        console.log('✓ 현재 폴더 ID:', currentFolder.id);
        console.log('✓ 현재 폴더 이름:', currentFolder.name);
        console.log('✓ 현재 폴더 전체 정보:', currentFolder);
        
        // UI에 폴더 이름 표시
        document.getElementById('folderName').textContent = currentFolder.name;
        
        // 2. 해당 폴더의 아이템 가져오기
        console.log('\n2단계: 폴더 내 아이템 가져오기 시도...');
        console.log('검색 조건:', { folders: [currentFolder.id] });
        
        currentItems = await eagle.item.get({
            folders: [currentFolder.id]
        });
        
        console.log('✓ 조회된 아이템 개수:', currentItems.length);
        
        if (currentItems.length > 0) {
            console.log('✓ 첫 번째 아이템 정보:');
            console.log('  - ID:', currentItems[0].id);
            console.log('  - 이름:', currentItems[0].name);
            console.log('  - 확장자:', currentItems[0].ext);
            console.log('  - 전체 데이터:', currentItems[0]);
        } else {
            console.log('⚠️ 폴더에 아이템이 없습니다');
        }
        
        // UI에 아이템 개수 표시
        document.getElementById('itemCount').textContent = currentItems.length;
        
        if (currentItems.length === 0) {
            showMessage('선택한 폴더에 이미지가 없습니다.', 'info');
            document.getElementById('renameBtn').disabled = true;
            return;
        }

        // 3. 미리보기 업데이트
        console.log('\n3단계: 미리보기 업데이트...');
        updatePreview();
        
        // 4. 이벤트 리스너 설정
        console.log('4단계: 이벤트 리스너 설정...');
        setupEventListeners();
        
        console.log('\n✅ 플러그인 초기화 완료!');
        
    } catch (error) {
        console.error('❌ 초기화 오류:', error);
        console.error('오류 스택:', error.stack);
        showMessage('플러그인 초기화 중 오류가 발생했습니다: ' + error.message, 'error');
    }
});

// 이벤트 리스너 설정
function setupEventListeners() {
    const renameBtn = document.getElementById('renameBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const startNumber = document.getElementById('startNumber');
    const paddingLength = document.getElementById('paddingLength');
    
    renameBtn.addEventListener('click', handleRename);
    cancelBtn.addEventListener('click', handleCancel);
    
    // 입력값 변경 시 미리보기 업데이트
    startNumber.addEventListener('input', updatePreview);
    paddingLength.addEventListener('input', updatePreview);
    
    console.log('✓ 이벤트 리스너 설정 완료');
}

// 미리보기 업데이트
function updatePreview() {
    if (!currentFolder) {
        console.log('미리보기: 폴더 없음');
        return;
    }
    
    const startNum = parseInt(document.getElementById('startNumber').value) || 1;
    const padding = parseInt(document.getElementById('paddingLength').value) || 3;
    const folderName = currentFolder.name;
    
    console.log('미리보기 생성:', { startNum, padding, folderName });
    
    // 예시 생성
    const examples = [];
    for (let i = 0; i < Math.min(3, currentItems.length); i++) {
        const num = (startNum + i).toString().padStart(padding, '0');
        
        // 확장자 가져오기
        let ext = '';
        if (currentItems[i]) {
            if (currentItems[i].ext) {
                ext = '.' + currentItems[i].ext;
            } else if (currentItems[i].name) {
                const lastDot = currentItems[i].name.lastIndexOf('.');
                if (lastDot > 0) {
                    ext = currentItems[i].name.substring(lastDot);
                }
            }
        }
        
        examples.push(`${folderName}_${num}${ext}`);
    }
    
    const previewText = `예시: ${examples.join(', ')}${currentItems.length > 3 ? ' ...' : ''}`;
    document.getElementById('previewExample').textContent = previewText;
    console.log('미리보기:', previewText);
}

// 이름 변경 실행
async function handleRename() {
    console.log('\n=== 이름 변경 시작 ===');
    
    if (!currentFolder || currentItems.length === 0) {
        console.error('❌ 변경할 이미지 없음');
        showMessage('변경할 이미지가 없습니다.', 'error');
        return;
    }
    
    const renameBtn = document.getElementById('renameBtn');
    const startNum = parseInt(document.getElementById('startNumber').value) || 1;
    const padding = parseInt(document.getElementById('paddingLength').value) || 3;
    const folderName = currentFolder.name;
    
    console.log('설정값:');
    console.log('  - 시작 번호:', startNum);
    console.log('  - 자릿수:', padding);
    console.log('  - 폴더명:', folderName);
    console.log('  - 총 아이템:', currentItems.length);
    
    // 버튼 비활성화
    renameBtn.disabled = true;
    renameBtn.innerHTML = '<span class="loading"></span>변경 중...';
    
    try {
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        
        // 각 아이템의 이름 변경
        for (let i = 0; i < currentItems.length; i++) {
            try {
                const item = currentItems[i];
                const num = (startNum + i).toString().padStart(padding, '0');
                
                console.log(`\n[${i + 1}/${currentItems.length}] 아이템 처리`);
                console.log('  원본 이름:', item.name);
                console.log('  원본 확장자:', item.ext);
                
                // 새 이름 생성 (확장자 제외)
                const newName = `${folderName}_${num}`;
                console.log('  새 이름:', newName);
                
                // 이름 변경
                item.name = newName;
                
                // 변경사항 저장
                console.log('  저장 시도...');
                const saveResult = await item.save();
                console.log('  저장 결과:', saveResult);
                
                if (saveResult) {
                    successCount++;
                    console.log('  ✓ 성공');
                } else {
                    errorCount++;
                    errors.push(`아이템 ${i + 1}: 저장 실패`);
                    console.log('  ✗ 실패 (false 반환)');
                }
                
                // 진행 상황 표시
                showMessage(
                    `진행 중... (${successCount + errorCount}/${currentItems.length})`, 
                    'info'
                );
                
                // UI 업데이트를 위한 짧은 대기
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`  ✗ 아이템 ${i + 1} 오류:`, error);
                console.error('  오류 상세:', error.message);
                console.error('  오류 스택:', error.stack);
                errors.push(`아이템 ${i + 1}: ${error.message}`);
                errorCount++;
            }
        }
        
        console.log('\n=== 이름 변경 완료 ===');
        console.log('성공:', successCount);
        console.log('실패:', errorCount);
        
        if (errors.length > 0) {
            console.error('오류 목록:', errors);
        }
        
        // 완료 메시지
        if (errorCount === 0) {
            showMessage(
                `✅ 성공! ${successCount}개의 이미지 이름을 변경했습니다.`, 
                'success'
            );
        } else {
            showMessage(
                `⚠️ 완료: ${successCount}개 성공, ${errorCount}개 실패`, 
                'error'
            );
        }
        
        // 2초 후 창 닫기
        setTimeout(() => {
            console.log('플러그인 창 닫기...');
            eagle.window.close();
        }, 2000);
        
    } catch (error) {
        console.error('❌ 이름 변경 오류:', error);
        console.error('오류 스택:', error.stack);
        showMessage('이름 변경 중 오류가 발생했습니다: ' + error.message, 'error');
        
        // 버튼 다시 활성화
        renameBtn.disabled = false;
        renameBtn.textContent = '이름 변경 실행';
    }
}

// 취소 버튼 처리
function handleCancel() {
    console.log('취소 버튼 클릭');
    eagle.window.close();
}

// 메시지 표시
function showMessage(text, type = 'info') {
    console.log(`메시지 [${type}]:`, text);
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

// 윈도우 크기 조정
eagle.onPluginRun(() => {
    console.log('플러그인 실행 - 윈도우 크기 조정');
    eagle.window.setSize({
        width: 550,
        height: 600
    });
});
