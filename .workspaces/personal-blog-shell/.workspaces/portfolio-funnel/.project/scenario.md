요구사항(학원 관리 프로그램)을 읽고 -> packages/domains/{student,teacher,class,schedule,billing}/src/* 도메인 경계 정의 문서 생성
도메인 경계를 읽고 -> 각 도메인 패키지 내부에 entity, port, adapter 폴더 생성/관리
도메인 패키지 구조를 읽고 -> app/service 레이어에서 @domain/* 포트 의존으로 사용처 코드 처리
운영 요구(확장/테스트/팀협업)를 읽고 -> 기능별(postpix) 단일폴더 대신 도메인 패키지 분리 전략으로 아키텍처 결정 기록
