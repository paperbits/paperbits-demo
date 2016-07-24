module Vienna {
    import IConfigProvider = Vienna.Configuration.IConfigProvider;

    export module Domain {
        export module Engagement {
            export interface IIntercomService {
                update(data: ILead): void;
            }

            export interface ILead {
                name: string;
                email: string;
                user_id: string;
                created_at: number;
            }

            export class IntercomService implements IIntercomService {
                constructor(configProvider: IConfigProvider) {
                    this.boot = this.boot.bind(this);
                    this.onConfigLoaded = this.onConfigLoaded.bind(this);

                    configProvider.getSetting().then(this.onConfigLoaded);
                }

                private onConfigLoaded(config: any) {
                    this.boot(config.intercom.appId, config.intercom.settings);
                }

                public update(data: ILead): void {
                    window["Intercom"]("update", data);
                }

                private boot(appId: string, intercomSettings: any) {
                    if (typeof window["Intercom"] === "function") {
                        window["Intercom"]('reattach_activator');
                        window["Intercom"]('update', intercomSettings);
                    }
                    else {
                        var w: Window = window;
                        var d: Document = w.document;

                        var i = function () {
                            i["c"](arguments)
                        };
                        i["q"] = [];
                        i["c"] = function (args) {
                            i["q"].push(args)
                        };

                        var s = d.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = 'https://widget.intercom.io/widget/' + appId;
                        var x = d.getElementsByTagName('body')[0];
                        x.appendChild(s);

                        w["Intercom"] = i;

                        window["Intercom"]("boot", {
                            app_id: appId
                        });
                    }
                }
            }
        }
    }
}