module Vienna.Widgets.Domain.Engagement {
    import IIntercomService = Vienna.Domain.Engagement.IIntercomService;
    import ILead = Vienna.Domain.Engagement.ILead;

    const subscribedKey = "subscribedTime";

    export class FollowUs {
        private viewManager: Ui.ViewManager;
        public isNotSubscribed: KnockoutObservable<boolean>;
        public name: KnockoutObservable<string>;
        public email: KnockoutObservable<string>;

        constructor(private intercomService: IIntercomService, viewManager: Ui.ViewManager) {
            this.viewManager = viewManager;

            this.name = ko.observable<string>();
            this.email = ko.observable<string>();
            let subscribedTime = this.getCookieValue(subscribedKey);

            this.isNotSubscribed = ko.observable<boolean>(!subscribedTime);
        }

        public follow(): void {
            var lead: ILead = {
                name: this.email(),
                email: this.email(),
                user_id: this.email(),
                created_at: (new Date).getTime()
            };
            this.intercomService.update(lead);
            dataLayer.push({
                'event': 'Convertion.Newsletter'
            });
            this.setCookie(subscribedKey, lead.created_at.toString());
            this.isNotSubscribed(false);

            this.viewManager.addProgressIndicator("Newsletter", "Thank you! We'll be in touch.", 100);
        }

        private getCookieValue(cookieName): any {
            var ca = document.cookie.split('; ');
            return _.find(ca, (cookie) => {
                return cookie.indexOf(cookieName) === 0;
            });
        }

        private setCookie(variable, value) {
            var date = new Date();
            date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
            document.cookie = variable + '=' + value + '; expires=' + date.toUTCString() + ';';
        }
    }
}