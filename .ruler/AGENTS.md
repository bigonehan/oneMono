# AGENTS.md
# 🤖 Agent Integration Guide

이 문서는 codex/agent가 인식할 수 있도록  
패키지별 역할과 의존 관계를 요약한 가이드다.  
상세 구조와 예제는 `structure.md`를 참고한다.

---


#### 🧱 Naming Rule
| 구분 | 규칙 | 예시 |
|------|------|------|
| 파일명 | `<DomainName>Adapter<Implementation>.ts` | `PostAdapterConsole.ts`, `UserAdapterPostgre.ts` |
| 폴더명 | 도메인 단위 (소문자) | `adapters/post/`, `adapters/user/` |
| 구현체 수가 많을 경우 | 파일명 기준 정렬을 위해 `Adapter` 중앙 고정 | ✅ `PostAdapterSupabase.ts` <br>❌ `SupabasePostAdapter.ts` |

---


## 📦 packages 구조별 역할

### 🧩 domains/
- 각 도메인의 Entity, Type, Port(interface) 정의
- 외부 의존성 없음
- 예시: `PostPort.ts`, `UserPort.ts`

---

### 🔌 adapters/
- Domain의 Port를 실제로 구현하는 계층
- 외부 리소스(Infra)와 연결
- Mock, Console, DB, API Adapter 등 다양한 구현체 존재
- 예시: `PostAdapterConsole.ts`, `PostAdapterPostgre.ts`

---

### ⚙️ infra/
- 외부 SDK, DB, 클라우드 클라이언트 초기화 및 관리
- Adapter가 의존하는 기술적 객체 제공
- 예시: `postgres/pool.ts`, `supabase/client.ts`

---

### 🧠 services/
- Port를 주입받아 비즈니스 로직을 수행하는 계층
- Domain 규칙 조합, 검증, 변환 담당
- Adapter 구현체를 직접 모르고 Port에만 의존
- 예시: `PostService.ts`, `UserService.ts`

---

### 🧩 layers/
- Effect-TS의 DI 계층
- Adapter 구현체를 Layer로 등록 (`Layer.succeed`)
- Adapter 교체는 이 Layer 파일만 수정하면 됨
- 예시: `PostLayer.ts`, `UserLayer.ts`

---

### 🧱 apps/
- 실행 및 UI 계층 (API 서버, Web, Worker 등)
- Layer를 주입하고 Effect runtime을 실행
- 비즈니스 흐름 제어
- 예시: `apps/web/src/pages/post.astro`

---

## ⚙️ 주요 의존 방향

App → Service → Domain(Port) → Adapter → Infra

yaml
코드 복사

---

## 🔄 Layer 주입 방식 요약

| 단계 | 역할 |
|------|------|
| `Layer.succeed(Tag, instance)` | Port 구현체 등록 |
| `Effect.provide(Layer)` | Adapter 환경 주입 |
| `yield* _(Tag)` | 주입된 Port 사용 |

---

## 📘 규칙 요약

- **Domain**: 외부 의존 없음  
- **Adapter**: Domain + Infra 의존  
- **Service**: Domain(Port)만 의존  
- **App**: Service + Layer만 호출  
- **Infra**: 외부 SDK 관리 전용  

---

## 🔍 참조
구체적인 예시와 실행 흐름은  
👉 **[`structure.md`](./structure.md)** 파일을 참고.
