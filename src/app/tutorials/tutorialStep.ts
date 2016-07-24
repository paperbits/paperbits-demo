module Vienna {
    export interface TutorialStep {
        targetElementFixed?: boolean;
        targetElementSearch?: () => HTMLElement;
        trackedElementSearch?: () => HTMLElement;
        targetEvent: string;
        arrowText: string;
        arrowPosition: string;
        isComplete: (trackedElement: HTMLElement) => boolean;
        stepCompleteDelay?: number;
    }
}