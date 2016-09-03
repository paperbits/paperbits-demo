module Paperbits.Registrations {
    export class TutorialScenarioRegistration implements IRegistration {
        public register(injector: IInjector): void {
            injector.bind("tutorialScenario", Paperbits.Tutorials.TutorialScenario);
            injector.resolve("tutorialScenario");
        }
    }
}