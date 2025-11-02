import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export class LifecycleManager {
    public ctx: gsap.Context | null;
    private boundAfterSwapHandler: () => void;
    private boundPageLoadHandlers: Map<string, () => void>;
    private boundDomReadyHandlers: Map<string, () => void>;
    private lastRunRouteById: Map<string, string>;
    private static instance: LifecycleManager | null = null;

    private constructor() {
        this.ctx = null;
        this.boundAfterSwapHandler = this.onChangePage.bind(this);
        this.boundPageLoadHandlers = new Map();
        this.boundDomReadyHandlers = new Map();
        this.lastRunRouteById = new Map();
        
        // GSAP 플러그인 등록
        gsap.registerPlugin(ScrollTrigger);
        
        // 브라우저 환경에서만 이벤트 리스너 등록
        if (typeof document !== "undefined") {
            document.addEventListener("astro:after-swap", this.boundAfterSwapHandler);
        }
    }

    /**
     * 싱글톤 인스턴스 반환
     */
    static getInstance(): LifecycleManager {
        if (!LifecycleManager.instance) {
            LifecycleManager.instance = new LifecycleManager();
        }
        return LifecycleManager.instance;
    }

    /**
     * GSAP Context 초기화
     */
    initializeContext(): void {
        if (this.ctx === null) {
            this.ctx = gsap.context(() => {});
        }
    }

    /**
     * 주어진 ID를 가진 요소가 DOM에 존재하는지 확인
     * @param id - 확인할 요소의 ID
     * @returns 요소 존재 여부
     */
    elementExists(id: string): boolean {
        if (!id) throw new Error("ID cannot be null");
        if (typeof document === "undefined") return false;
        return document.getElementById(id) !== null;
    }

    /**
     * 페이지 로드 시 특정 요소가 있을 때 콜백 실행
     * @param id - 확인할 요소의 ID
     * @param callback - 실행할 콜백 함수
     */
    onElementLoaded(
        id: string,
        callback: (ctx: gsap.Context | null) => void
    ): void {
        if (!this.boundPageLoadHandlers.has(id) && typeof document !== "undefined") {
            const handler = () => this.onPageLoad(id, callback);
            this.boundPageLoadHandlers.set(id, handler);
            document.addEventListener("astro:page-load", handler);
        }

        if (typeof document === "undefined") return;

        if (document.readyState === "loading" && !this.boundDomReadyHandlers.has(id)) {
            const readyHandler = () => {
                this.boundDomReadyHandlers.delete(id);
                this.onPageLoad(id, callback);
            };
            this.boundDomReadyHandlers.set(id, readyHandler);
            document.addEventListener("DOMContentLoaded", readyHandler, { once: true });
            return;
        }

        this.onPageLoad(id, callback);
    }

    /**
     * 페이지 로드 이벤트 핸들러
     * @param id - 확인할 요소의 ID
     * @param callback - 실행할 콜백 함수
     */
    onPageLoad(
        id: string,
        callback: (ctx: gsap.Context | null) => void
    ): void {
        if (this.elementExists(id)) {
            const currentRouteKey = this.getCurrentRouteKey();
            if (this.lastRunRouteById.get(id) === currentRouteKey) {
                return;
            }

            this.initializeContext();
            callback(this.ctx);
            this.lastRunRouteById.set(id, currentRouteKey);
        }
    }

    /**
     * Context를 되돌리고 모든 애니메이션 제거
     */
    revertContext(): void {
        if (this.ctx !== null) {
            this.ctx.revert();
            this.ctx = null;
        }
    }

    /**
     * 페이지 전환 시 호출되는 핸들러
     */
    onChangePage(): void {
        this.revertContext();
        this.lastRunRouteById.clear();
    }

    /**
     * 모든 이벤트 리스너와 애니메이션 정리
     */
    cleanup(): void {
        this.revertContext();
        
        if (typeof document !== "undefined") {
            document.removeEventListener("astro:after-swap", this.boundAfterSwapHandler);
            this.boundPageLoadHandlers.forEach((handler) => {
                document.removeEventListener("astro:page-load", handler);
            });
            this.boundDomReadyHandlers.forEach((handler) => {
                document.removeEventListener("DOMContentLoaded", handler);
            });
        }
        
        this.boundPageLoadHandlers.clear();
        this.boundDomReadyHandlers.clear();
        this.lastRunRouteById.clear();
    }

    /**
     * 현재 라우트 키 반환
     */
    private getCurrentRouteKey(): string {
        if (typeof window === "undefined") return "server";
        const { pathname, search, hash } = window.location;
        return `${pathname}${search}${hash}`;
    }
}

/**
 * LifecycleManager 싱글톤 인스턴스를 반환하는 헬퍼 함수
 */
export function getAnimationManager(): LifecycleManager {
    return LifecycleManager.getInstance();
}

export { gsap, ScrollTrigger };
