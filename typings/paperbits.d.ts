declare module Paperbits {
    interface IInjector {
        bind(name: string, transient: any): void;
        bindSingleton(name: string, singletone: any): void;
        bindComponent<T>(name: string, factory: (ctx: IInjector, params?: any) => T): void;
        bindInstance<T>(name: string, instance: T): void;
        bindFactory<T>(name, factory: (ctx: IInjector) => T): void;
        resolve<TImplementationType>(runtimeIdentifier: string): TImplementationType;
    }

    interface IRegistration {

    }

    interface IEventManager {
        addEventListener(eventName: string, callback: any): void;
        removeEventListener(eventName: string, callback: any): void;
        dispatchEvent(eventName: string): void;
        dispatchEvent(eventName: string, args: any): void;
    }

    module Permalinks {
        interface IPermalink {

        }
    }

    module Persistence {
        interface IObjectStorage { }
        interface IFileStorage { }
        class CachedObjectStorage {
            constructor(objectStorage, eventManager);
        }
    }

    module Configuration {
        interface IConfigProvider {
            getSettings(): Promise<any>;
        }
    }

    module Http {
        interface IHttpClient {
            sendRequest<T>(request: IHttpRequest): Promise<T>;
        }

        export interface IHttpRequest {
            url: string;
            method?: string;
            headers?: Array<IHttpHeader>;
            body?: any;
        }

        export interface IHttpHeader {
            name: string;
            value: string;
        }
    }

    module Tutorials {
        interface Tutorial {
            addStep(step: TutorialStep): void;
            runScenario(): void;
        }

        interface TutorialStep {}
    }

    module Ui {
        interface IViewManager {
            addProgressIndicator(title: string, content: string, progress?: number);
            addPromiseProgressIndicator<T>(task: ProgressPromise<T>, title: string, content: string);
            openWorkshop(componentName: string, parameters?: any): void;
            foldEverything(): void;
            foldWorkshops(): void;
            unfoldWorkshop(): void;
            clearJourney(): void;
            closeWidgetEditor(): void;
        }
    }

    module Editing {
        interface IHtmlEditor {
            getClosestNode(nodeNames: Array<string>): HTMLElement;
            insertText(text: string): void;
            insertHtml(html: string): void;
            toggleBold(): void;
            toggleItalic(): void;
            toggleUnderline(): void;
            toggleUl(): void;
            toggleOl(): void;
            toggleP(): void;
            toggleH1(): void;
            toggleH2(): void;
            toggleH3(): void;
            toggleH4(): void;
            toggleQuote(): void;
            toggleCode(): void;
            alignLeft(): void;
            alignCenter(): void;
            alignRight(): void;
            hyperlink(): HTMLLinkElement;
            removeHyperlink(): void;
            clearFormatting(): void;
            justify(): void;
            getStack(): Array<HTMLElement>;
            addSelectionChangeListener(callback: () => void): void;
            addEditorDisabledListener(callback: () => void): void;
            setCaretAtEndOf(node: Node): void;
            setCaretAt(clientX: number, clientY: number): void;
            enable();
            disable();
        }
    }

    var Utils;
}

declare class ProgressPromise<T> {
    constructor(resolve?, reject?, progress?);
}

declare var _;
