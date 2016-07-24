module Vienna {
    import IHtmlEditor = Vienna.Editing.IHtmlEditor;

    const tutorialCaption = "PaperBits Tutorial";

    export class TutorialScenario {
        private tutorial: Tutorial;
        private eventManager: IEventManager;
        private viewManager: Ui.ViewManager;
        private htmlEditor: IHtmlEditor;

        constructor(tutorial: Tutorial, eventManager: IEventManager, viewManager: Ui.ViewManager, htmlEditor: IHtmlEditor) {
            this.tutorial = tutorial;
            this.eventManager = eventManager;
            this.viewManager = viewManager;
            this.htmlEditor = htmlEditor;

            this.run = this.run.bind(this);
            this.delayRun = this.delayRun.bind(this);

            this.viewManager.foldWorkshops();
            this.eventManager.addEventListener("pageContentLoaded", this.delayRun);
        }

        private delayRun(): void {
            setTimeout(this.run, 3000);
        }

        private run(): void {
            var headlineElement = $("h1:contains('apps')")[0];

            this.htmlEditor.enable();
            this.htmlEditor.setCaretAtEndOf(headlineElement);

            var typeCount = 0;

            this.tutorial.addStep({
                arrowText: "Type something",
                arrowPosition: "top right",
                targetElementSearch: () => {
                    return $("h1:contains('apps')")[0];
                },
                targetEvent: "domchange",
                isComplete: () => {
                    typeCount++;

                    if (typeCount <= 1) {
                        this.htmlEditor.enable();
                    }

                    if (typeCount >= 2) {
                        this.viewManager.addProgressIndicator(tutorialCaption, "Congrats! You just learned how to edit text. Easy, isn't it?", 10);
                        return true;
                    }

                    return false;
                },
                stepCompleteDelay: 4000
            });

            this.tutorial.addStep({
                targetElementSearch: () => {
                    return $("paper-picture[src*='pen-fight']")[0];
                },
                arrowText: "Now, grab this picture...",
                arrowPosition: "top left",
                targetEvent: "domchange",
                isComplete: (trackedElement) => {
                    return ($(trackedElement).hasClass("dragged"));
                }
            });

            this.tutorial.addStep({
                targetElementSearch: () => {
                    return $("paper-picture[src*='pen-fight']")[0];
                },
                targetElementFixed: true,
                arrowText: "...that's right. Move it to another place.",
                arrowPosition: "top left",
                targetEvent: "domchange",
                isComplete: (trackedElement) => {
                    if (!$(trackedElement).hasClass("dragged")) {
                        this.viewManager.addProgressIndicator(tutorialCaption, "Yes! This is how you re-arange items in responsive grid.", 20);
                        return true;
                    }
                    return false;
                },
                stepCompleteDelay: 3000
            });

            this.tutorial.addStep({
                arrowText: "Open navigation editor",
                arrowPosition: "top right",
                targetElementSearch: () => {
                    this.viewManager.unfoldWorkshop();
                    return $("#buttonOpenNavigation")[0]
                },
                targetElementFixed: true,
                targetEvent: "click",
                isComplete: () => {
                    setTimeout(function () {
                        $("a:contains('Main menu')").click();
                    }, 1000);
                    return true;
                },
                stepCompleteDelay: 1000
            });

            this.tutorial.addStep({
                arrowText: "Click to add menu item",
                arrowPosition: "top right",
                targetElementSearch: () => {
                    return $("button:contains('Add navigation item')")[0];
                },
                targetElementFixed: true,
                targetEvent: "click",
                isComplete: () => {
                    return true;
                }
            });

            this.tutorial.addStep({
                arrowText: "Do you like that label? How about changing it?",
                arrowPosition: "bottom",
                targetElementSearch: () => {
                    return $("navbar a:contains('< New >')")[0];
                },
                trackedElementSearch: () => {
                    return $("navbar")[0]
                },
                targetEvent: "domchange",
                isComplete: (trackedElement) => {
                    this.viewManager.addProgressIndicator(tutorialCaption, "Great job! Now you know how to manage menus.", 50);

                    setTimeout(this.viewManager.clearJourney, 3500);

                    return true;
                },
                stepCompleteDelay: 4000
            });

            this.tutorial.addStep({
                targetElementSearch: () => {
                    return $("paper-picture[src*='pen-and-ruler']")[0]
                },
                arrowText: "Next step: double-click on this guy",
                arrowPosition: "top left",
                targetEvent: "dblclick",
                isComplete: () => true,
                stepCompleteDelay: 1000
            });

            this.tutorial.addStep({
                targetElementSearch: () => {
                    return $(".picture-editor .picture.circle")[0]
                },
                targetElementFixed: true,
                trackedElementSearch: () => {
                    return $("paper-picture[src*='pen-and-ruler']")[0];
                },
                arrowText: "...ant try to change picture layout",
                arrowPosition: "top right",
                targetEvent: "domchange",
                isComplete: () => {
                    this.viewManager.addProgressIndicator(tutorialCaption, "Well done! All the widget editors are open with double-click.", 30);
                    setTimeout(this.viewManager.closeWidgetEditor, 2500);
                    this.viewManager.closeWidgetEditor();
                    return true;
                },
                stepCompleteDelay: 3000
            });



            this.tutorial.addStep({
                arrowText: "Please drop an image file anywhere here.",
                arrowPosition: "bottom left",
                targetElementSearch: () => {
                    return document.body;
                },
                targetElementFixed: true,
                targetEvent: "domchange",
                isComplete: () => {
                    if ($(".vienna-droppedcontent").length > 0) {
                        return true;
                    }
                    return false;
                }
            });

            this.tutorial.addStep({
                targetElementSearch: () => {
                    return $("dropbucket")[0];
                },
                trackedElementSearch: () => {
                    return document.body
                },
                targetElementFixed: true,
                arrowText: "Let's grab it...",
                arrowPosition: "top left",
                targetEvent: "domchange",
                isComplete: (trackedElement) => {
                    return $(".dragged").length > 0;
                }
            });

            this.tutorial.addStep({
                arrowText: "...and move it to the content",
                arrowPosition: "top left",
                targetElementSearch: () => {
                    return $(".dragged")[0];
                },
                targetElementFixed: true,
                targetEvent: "domchange",
                isComplete: (trackedElement) => {
                    if (!$(trackedElement).hasClass("dragged")) {
                        this.viewManager.addProgressIndicator(tutorialCaption, "Aha! As you can see, file is automatically uploaded to media library.", 80);
                        return true;
                    }
                    return false;
                },
                stepCompleteDelay: 3000
            });

            this.tutorial.addStep({
                arrowText: "This is media library",
                arrowPosition: "top right",
                targetElementSearch: () => {
                    return $("#buttonOpenUploads")[0];
                },
                targetElementFixed: true,
                targetEvent: "click",
                isComplete: () => {
                    this.viewManager.addProgressIndicator(tutorialCaption, "That's it for now. Please feel free to explore other widgets and editors as well.\n Don't forget to subscribe to our newsletter!", 100);
                    return true;
                },
                stepCompleteDelay: 3000
            });

            this.tutorial.addStep({
                arrowText: "Subscribe to newsletter.",
                arrowPosition: "top right",
                targetElementSearch: () => {
                    return $("#inputSubscribe button")[0];
                },
                targetEvent: "domchange",
                isComplete: () => true
            });

            this.tutorial.runScenario();
        }
    }
}