# 🧭 Monorepo Architecture Structure (Effect-TS + Hexagonal)

## 1️⃣ Overview
이 프로젝트는 **Hexagonal Architecture** 기반으로 설계되었으며,  
Effect-TS의 Layer 시스템을 활용하여 도메인 독립성과 의존성 주입(DI)을 함수형으로 관리한다.

Domain → Port → Adapter → Service → Layer → App

yaml
코드 복사

---

## 2️⃣ Directory Structure

packages/
┣ domains/
┃ ┣ post/
┃ ┗ user/
┣ adapters/
┃ ┣ post/
┃ ┗ user/
┣ services/
┃ ┣ post/
┃ ┗ user/
┣ infra/
┃ ┣ postgres/
┃ ┗ supabase/
apps/
┣ api/
┗ web/

## 3️⃣ Domain Layer
비즈니스 핵심 규칙과 타입 정의 계층.  
외부 의존성 없음.

### 주요 파일
- `Post.ts` : Entity 정의  
- `PostPort.ts` : Port 인터페이스 정의  

---

## 4️⃣ Adapter Layer
Port를 실제로 구현하는 계층.  
외부 시스템(DB, API, 콘솔 등)과 Domain을 연결한다.

### 주요 구현체
- `PostAdapterConsole.ts` : 콘솔용 Mock Adapter  
- `PostAdapterPostgre.ts` : PostgreSQL 기반 Adapter  
- `PostAdapterSupabase.ts` : Supabase 기반 Adapter  

---

## 5️⃣ Infra Layer
공통 외부 리소스 초기화 계층.  
SDK나 DB Pool 등 기술 의존적 객체를 관리한다.

### 예시
- `postgres/pool.ts` : PostgreSQL Pool 관리  
- `supabase/client.ts` : Supabase Client 초기화  

---

## 6️⃣ Service Layer
비즈니스 로직 조합 계층.  
Adapter를 직접 모르고 Port 인터페이스만 사용한다.

### 예시
- `PostService.ts` : PostPort 기반 로직 정의 (create, list, update 등)

---

## 7️⃣ Layer Definition
Effect-TS의 환경 주입(DI) 계층.  
Layer를 통해 Adapter 교체 및 환경 설정을 수행한다.

### 예시
- `PostLayer.ts` : PostPort 구현체를 Layer로 등록 (`ConsoleLive`, `PostgreLive` 등)

---

## 8️⃣ App Layer
실제 실행 계층.  
Service와 Layer를 불러와 Effect runtime을 통해 동작을 수행한다.  
Adapter 교체는 Layer만 변경하면 된다.

### 예시
- `apps/web/src/pages/post.astro`
  - Effect runtime 실행  
  - Service 주입 및 Layer 선택  
  - 비즈니스 흐름 (create → list → update → list)

---

## 9️⃣ Flow Summary

1️⃣ Domain → Port 정의
2️⃣ Adapter → Port 구현체 작성
3️⃣ Infra → SDK / DB 커넥션 관리
4️⃣ Service → Port 기반 비즈니스 로직
5️⃣ Layer → Adapter를 환경에 등록
6️⃣ App → Layer 주입 + 실행

yaml
코드 복사

---

## 🧠 Key Concepts

| 계층 | 역할 | 의존 대상 |
|------|------|-----------|
| **Domain** | 비즈니스 규칙 | 없음 |
| **Port** | 외부 의존성 인터페이스 | 없음 |
| **Adapter** | Port 구현 | Domain + Infra |
| **Infra** | 외부 시스템 초기화 | 외부 SDK |
| **Service** | 비즈니스 로직 조합 | Domain(Port) |
| **Layer** | 환경 주입, Adapter 교체 | Adapter |
| **App** | 실행, UI, 테스트 | Service + Layer |

---

## ⚙️ Effect-TS Layer 역할

| 전통 DI 용어 | Effect-TS 대응 |
|---------------|----------------|
| Interface / Token | `Context.Tag` |
| 구현체 등록 | `Layer.succeed(tag, instance)` |
| 주입 | `Effect.provide(layer)` |
| 의존성 요청 | `yield* _(Tag)` |
| 객체 해제 | `Layer.scoped` |

---

## ✅ 핵심 결론

> 1️⃣ 도메인 단위로 Port를 정의하고  
> 2️⃣ Adapter로 구현체를 작성하고  
> 3️⃣ Service에서 Port를 주입받아 로직을 수행하며  
> 4️⃣ Layer로 Adapter를 등록하고  
> 5️⃣ App에서 Layer를 주입해 실행한다.  

이 구조를 따르면  
- 도메인 독립성 100%  
- Adapter 교체 자유도 100%  
- 테스트와 실제 환경 분리 용이  
- Effect-TS Layer 시스템과 완전 호환.
