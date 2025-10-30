import gsap from "gsap";

export class LifecycleManager {
    public ctx: gsap.Context | null;
    private boundAfterSwapHandler: () => void;
    private boundPageLoadHandlers: Map<string, () => void>;
    private static instance: LifecycleManager | null = null;

    private constructor() {
        this.ctx = null;
        this.boundAfterSwapHandler = this.onChangePage.bind(this);
        this.boundPageLoadHandlers = new Map();
        
        if (typeof document !== "undefined") {
            document.addEventListener("astro:after-swap", this.boundAfterSwapHandler);
        }
    }

    static getInstance(): LifecycleManager {
        if (!LifecycleManager.instance) {
            LifecycleManager.instance = new LifecycleManager();
        }
        return LifecycleManager.instance;
    }

    initializeContext(): void {
        if (this.ctx === null) {
            this.ctx = gsap.context(() => {});
        }
    }

    elementExists(id: string): boolean {
        if (!id) throw new Error("ID cannot be null");
        if (typeof document === "undefined") return false;
        return document.getElementById(id) !== null;
    }

    onElementLoaded(id: string, callback: (ctx: gsap.Context | null) => void): void {
        if (!this.boundPageLoadHandlers.has(id)) {
            const handler = () => this.onPageLoad(id, callback);
            this.boundPageLoadHandlers.set(id, handler);
            
            if (typeof document !== "undefined") {
                document.addEventListener("astro:page-load", handler);
            }
        }
    }

    onPageLoad(id: string, callback: (ctx: gsap.Context | null) => void): void {
        if (this.elementExists(id)) {
            this.initializeContext();
            callback(this.ctx);
        }
    }

    revertContext(): void {
        if (this.ctx !== null) {
            this.ctx.revert();
            this.ctx = null;
        }
    }

    onChangePage(): void {
        this.revertContext();
    }

    cleanup(): void {
        this.revertContext();
        if (typeof document !== "undefined") {
            document.removeEventListener("astro:after-swap", this.boundAfterSwapHandler);
            this.boundPageLoadHandlers.forEach((handler) => {
                document.removeEventListener("astro:page-load", handler);
            });
        }
        this.boundPageLoadHandlers.clear();
    }
}

export function getAnimationManager(): LifecycleManager {
    return LifecycleManager.getInstance();
}
